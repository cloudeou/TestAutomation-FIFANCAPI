import PreconditionContext from "../../contexts/ngc/PreconditionContext";
import {Identificators} from "../../contexts/Identificators";
import {AssertionModes, featureContext, postgresQueryExecutor, test} from "@cloudeou/telus-bdd";
import ResponseContext from "../../contexts/ngc/ResponseConntext";
import ShoppingCartContext from "../../contexts/ngc/ShoppingCartContext";
import {
  getManualCreditTaskId, getSalesOrderStatusQuery, getWorkOrderNumbersNotCompleted,
  queryNcCustomerOrdersStatusNeitherCompletedNorProcessed, getShipmentOrderNumberAndPurchaseOrderNumber,
  getHoldOrderTaskNumber, getTaskNumber, getManualTasksFromOrder, getErrorsOccuredForCustomer
} from "../../../bdd-src/ngc/db/db-queries";
import {TelusApiUtils} from "../../../bdd-src/telus-apis/telus-apis";
import {Common} from "../../../bdd-src/utils/commonBDD/Common";
import retry from "retry-as-promised";
import {AxiosResponse} from "axios";
import {DbProxyApi} from "../../../bdd-src/ngc/db/db-proxy-api/db-proxy.api";

type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

export const backendSteps = ({ given, and, when, then } : { [key: string]: step }) => {
  let preconditionContext = (): PreconditionContext =>
    featureContext().getContextById(Identificators.preConditionContext);
  let responseContext = (): ResponseContext =>
    featureContext().getContextById(Identificators.ResponseContext);
  let shoppingCartContext = (): ShoppingCartContext =>
    featureContext().getContextById(Identificators.shoppingCartContext);
  const tapis = new TelusApiUtils();
  const dbProxy = new DbProxyApi();

  when('try to complete sales order on BE', async () => {
    let customExternalId = preconditionContext().getExternalCustomerId();
    let addressId = preconditionContext().getAddressId();
    let salesOrderId = shoppingCartContext().getSalesOrderId();
    console.debug('Sales Order ID' + salesOrderId);
    test('customExternalId is defined',
      customExternalId,
      AssertionModes.strict).isnot(undefined, 'ecid undefined');
    test('Customer external Id is not null',
      customExternalId,
      AssertionModes.strict).isnot(null, "Customer external Id is null'");
    test('SO is defined',
      salesOrderId,
      AssertionModes.strict).isnot(undefined, 'SO is undefined');
    test('SO is not null',
      salesOrderId,
      AssertionModes.strict).isnot(null, 'SO is null');
    let response = responseContext().getShoppingCartResponse();
    test('Response is not null',
      response,
      AssertionModes.strict).isnot(null, 'Response is null');
    const customerId = preconditionContext().getCustomerObjectId()!;
    console.debug('customer id' + customerId);
    let order: any;
    order = {customerId};
    order.customerId = customerId;
    console.debug(`Customer's internal id: ${order.customerId}`);
    console.debug('Storing Manual Task Id');
    let incompleteorders, manualCreditTaskId: any;
    try {
      const response = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId!));
      await Common.delay(5000)
      incompleteorders = response.data.rows;
      console.log('get correct incompleteorders', incompleteorders);
    } catch (error) {

      console.log(error);
      throw error
    }
    if (!!incompleteorders && incompleteorders.length > 0) {
      try {
        await Common.delay(15000)
        const response = await dbProxy.executeQuery(getManualCreditTaskId(customerId));
        manualCreditTaskId = response.data.rows[0];
        console.log('get correct manualCreditTaskId', manualCreditTaskId);
      } catch (error) {
        console.log(error);
        throw error
      }

      if (manualCreditTaskId !== null && manualCreditTaskId !== undefined) {
        await Common.delay(10000)
        await tapis.processManualTask(manualCreditTaskId);
        await Common.delay(15000);
      }
      let pendingWorkOrders: any;

      await retry(
        async function (options) {
          // options.current, times callback has been called including this call
          await Common.delay(5000);
          const response = await dbProxy.executeQuery(getWorkOrderNumbersNotCompleted(customerId));
          await Common.delay(10000);
          const workOrderNumbersNotCompleted = response.data.rows;
          console.log('getWorkOrderNumbersNotCompleted',response.data)
          if (workOrderNumbersNotCompleted.length === undefined) {
            throw 'Got pending work orders as undefined' + response;
          }
          pendingWorkOrders = workOrderNumbersNotCompleted;


          return workOrderNumbersNotCompleted
        },
        {
          max: 5, // maximum amount of tries
          timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
          backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
        },
      );

          if (
              pendingWorkOrders !== null &&
              pendingWorkOrders !== undefined &&
              pendingWorkOrders.length > 0
          ) {
            for (let orIndex = 0; orIndex < pendingWorkOrders.length; orIndex++) {
              let workOrderNumber = pendingWorkOrders[orIndex][0];
              const workOrderName = pendingWorkOrders[orIndex][2];
              if (workOrderName.toLowerCase().includes('work order')) {

                await retry(
                  async function (options) {
                    // options.current, times callback has been called including this call

                    const response: AxiosResponse = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));

                    const ordersnotprocessed = response.data.rows;


                    for (
                      let orIndex = 0;
                      orIndex < ordersnotprocessed.length;
                      orIndex++
                    ) {
                      const orderInternalId = ordersnotprocessed[orIndex][1];
                      const orderName = ordersnotprocessed[orIndex][0];
                      if (orderName.toLowerCase().includes('work order')) {
                        let query = `select to_char(status) from nc_po_Tasks where order_id = ${orderInternalId} and name = 'Wait for Release Activation notification'`;

                        const response = await dbProxy.executeQuery(query)

                        console.log(`!!!!!!!!!!!!!!!response.data.rows -`, response.data.rows)

                        if (response.data.rows[0][0].length === undefined) {
                          throw (
                            'Got task release activation as undefined' + response
                          );
                        }
                        const status = response.data.rows[0][0];
                        if (status != '9130031781613016721') {
                          throw new Error(
                            'Wait for release activation is not in waiting state',
                          );
                        }
                      }
                    }
                  },
                  {
                    max: 5, // maximum amount of tries
                    timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
                    backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
                  },
                );

                await Common.delay(10000);
                await tapis.processReleaseActivation(workOrderNumber);
                await Common.delay(10000);
                await tapis.processWorkOrder(workOrderNumber);
              }
            }
          }


      let allPendingOrders;
      console.debug('Getting pending orders');
      await Common.delay(10000);
      try {
        const response = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));
        if (response.data.rows.length === undefined) {
          throw 'Got pending orders as undefined' + response;
        }
        allPendingOrders = response.data.rows;
        console.log('allPendingOrders ' + allPendingOrders)
      } catch (error) {

        console.log(error);
        throw error
      }


      if (
        allPendingOrders != null &&
        allPendingOrders !== undefined &&
        allPendingOrders.length > 0
      ) {
        try {

          for (let orIndex = 0; orIndex < allPendingOrders.length; orIndex++) {
            const orderInternalId = allPendingOrders[orIndex][1];
            const orderName = allPendingOrders[orIndex][0];
            if (orderName.toLowerCase().includes('shipment')) {
              console.debug(
                'Processing release activation for orderInternalId: ' +
                orderInternalId,
              );
              await tapis.processReleaseActivation(orderInternalId);
              // console.info('Getting shipment order and purchase no.');
              const result = await dbProxy.executeQuery(getShipmentOrderNumberAndPurchaseOrderNumber(orderInternalId))
              console.log("resultgetShipmentOrderNumberAndPurchaseOrderNumber " + JSON.stringify(result.data))
              const res = {shipmentOrderNumber: result.data.rows[0][0], purchaseeOrderNumber: result.data.rows[0][1]}
              console.log("ResgetShipmentOrderNumberAndPurchaseOrderNumber " + JSON.stringify(res))
              await Common.delay(10000);
              await tapis.processShipmentOrder(
                res.shipmentOrderNumber,
                res.purchaseeOrderNumber,
              );

              // Hit shipment order completion
              console.debug('Getting HoldOrderTaskNumber');
              await Common.delay(10000);
              const holdordertask = await postgresQueryExecutor(getHoldOrderTaskNumber(res.purchaseeOrderNumber))
              console.log("holdordertask " + holdordertask);
              try {
                console.debug('Processing Hold order task: ' + holdordertask);
                await tapis.processHoldOrderTask(holdordertask);
              } catch (err) {
                //console.info(JSON.stringify(err));
                console.log(err)
                throw err
              }
              console.debug(
                'Processing shipment order no. ' + res.shipmentOrderNumber,
              );

              // Wait for 10 seconds to get completedawait
              await tapis.wait(10000);
            }
          }
        } catch (err) {
          console.log(err)
          throw err
        }
      }

      await retry(
        async function (options) {
          // options.current, times callback has been called including this call

          const response: AxiosResponse = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId))

          if (response.data.rows.length === undefined) {
            throw 'Got pending orders as undefined' + response;
          }
          allPendingOrders = response.data.rows;
        },
        {
          max: 5, // maximum amount of tries
          timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
          backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
        },
      );


      if (
          allPendingOrders != null &&
          allPendingOrders !== undefined &&
          allPendingOrders.length > 0
      ) {
          for (let orIndex = 0; orIndex < allPendingOrders.length; orIndex++) {
              const orderInternalId = allPendingOrders[orIndex][1];
              const orderName = allPendingOrders[orIndex][0];
              if (orderName.toLowerCase().includes('mailbox cfs')) {

                  const response = await dbProxy.executeQuery(getTaskNumber(orderInternalId,'Wait for Email Reservation'));
                  const res = response.data.rows

                  for (let index = 0; index < res.length; index++) {
                      await tapis.processHoldOrderTask(res[index]);
                  }
              }
              if (orderName.toLowerCase().includes('home phone')) {

                const response = await dbProxy.executeQuery(getManualTasksFromOrder(orderInternalId,'Validate Service'))

                const res = response.data.rows

                for (let index = 0; index < res.length; index++) {
                    await tapis.processManualTask(res[index]);
                }
              }
              if (orderName.toLowerCase().includes('home security')) {
                const response = await dbProxy.executeQuery(getManualTasksFromOrder(orderInternalId,'Home security Product Manual Task'))

                const res = response.data.rows

                  for (let index = 0; index < res.length; index++) {
                      await tapis.processManualTask(res[index]);
                  }
              }
              if (orderName.toLowerCase().includes('tn porting')) {
                const response = await dbProxy.executeQuery(getTaskNumber(orderInternalId, 'Wait for Final Status Notification Task'));

                const task = response.data.rows

                  for (let index = 0; index < task.length; index++) {
                      await tapis.processHoldOrderTask(task[index]);
                  }
              }
              if (orderName.toLowerCase().includes('reverse logistics')) {
                const response = await dbProxy.executeQuery(getTaskNumber(orderInternalId, 'Wait for SAP Order closure'));

                const task = response.data.rows

                for (let index = 0; index < task.length; index++) {
                    await tapis.processHoldOrderTask(task[index]);
                }
              }
          }
      }

      console.log('!!!!!!!!! last block')

      /*await retry(
          async function (options) {
              // options.current, times callback has been called including this call
            const response: AxiosResponse = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId))

            if (!response || response.data.rows.length === undefined) {
              throw 'Got pending orders as undefined' + response;
            }
            if (response.data.rows.length > 0) {
              throw new Error(
                `Retrying now as we are getting still pending orders: ${JSON.stringify(
                  response,
                )}`,
              );
            }
            console.log(`response.data.rows !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${response.data.rows}`)
            shoppingCartContext().setAllPendingOrders(response.data.rows);

          },
          {
              max: 5, // maximum amount of tries
              timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
              backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
          },
      );*/
    }

      else {
        shoppingCartContext().setAllPendingOrders([]);
        console.log('finish')
      }

  })

  /*when('try to cancel sales order on BE', async () => {
    let customExternalId = preconditionContext().getExternalCustomerId;
    let addressId = preconditionContext().getAddressId();
    let salesOrderId = shoppingCartContext().getSalesOrderId();
    console.info('Sales Order ID' + salesOrderId);
    test('customExternalId is defined',customExternalId, AssertionModes.strict).isnot(undefined,'customExternalId should not be undefined');
    test('Customer external Id is not null', customExternalId, AssertionModes.strict).isnot(null, 'Customer external Id is null')
    test('salesOrderId should be defined', salesOrderId, AssertionModes.strict).isnot(undefined,'salesOrderId should be defined')
    test('Sales order Id is not null', salesOrderId, AssertionModes.strict).isnot(null,'Sales order Id should not be null')

    let response = responseContext().getShoppingCartResponse();
    test('Response is not null', response, AssertionModes.strict).isnot(null,'Response is null')
    const customerId = preconditionContext().getCustomerObjectId()!;
    console.info('customer id' + customerId);
    let order: any;
    order = { customerId };
    order.customerId = customerId;
    console.info(`Customer's internal id: ${order.customerId}`);
    console.info('Storing Manual Task Id');

    const incompleteordersResponse: AxiosResponse= await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));

    const incompleteorders = incompleteordersResponse.data.rows;

    if (!!incompleteorders && incompleteorders.length > 0) {
      const responseGetManualCreditTaskId = await dbProxy.executeQuery(getManualCreditTaskId(customerId));


      const manualCreditTaskId = responseGetManualCreditTaskId.data.rows[0]
      if (manualCreditTaskId !== null) {
        await tapis.processManualTask(manualCreditTaskId);
        await Common.delay(5000);
      }
      let pendingWorkOrders: any;
      console.info('Getting pending work orders');
      await retry(
        async function (options) {
          // options.current, times callback has been called including this call

          const response = await dbProxy.executeQuery(getWorkOrderNumbersNotCompleted(customerId));
          await Common.delay(10000);
          const workOrderNumbersNotCompleted = response.data.rows;

          if (workOrderNumbersNotCompleted.length === undefined) {
            throw 'Got pending work orders as undefined' + response;
          }
          pendingWorkOrders = workOrderNumbersNotCompleted;
        },
        {
          max: 5, // maximum amount of tries
          timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
          backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
        },
      );

      if (
        pendingWorkOrders !== null &&
        pendingWorkOrders !== undefined &&
        pendingWorkOrders.length > 0
      ) {
        for (let orIndex = 0; orIndex < pendingWorkOrders.length; orIndex++) {
          let workOrderNumber = pendingWorkOrders[orIndex][0];
          const workOrderName = pendingWorkOrders[orIndex][2];
          if (workOrderName.toLowerCase().includes('work order')) {
            console.info(
              'Processing release activation for workOrderNumber ' +
              workOrderNumber,
            );
            await retry(
              async function (options) {
                // options.current, times callback has been called including this call

                const ordersnotprocessedResponse: AxiosResponse= await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));

                const ordersnotprocessed = ordersnotprocessedResponse.data.rows;

                for (
                  let orIndex = 0;
                  orIndex < ordersnotprocessed.length;
                  orIndex++
                ) {
                  const orderInternalId = ordersnotprocessed[orIndex][1];
                  const orderName = ordersnotprocessed[orIndex][0];
                  if (orderName.toLowerCase().includes('work order')) {
                    let query = `select to_char(status) from nc_po_Tasks where order_id = ${orderInternalId} and name = 'Wait for Release Activation notification'`;

                    const response = await dbProxy.executeQuery(query);
                    if (response.data.rows.length === undefined) {
                      throw (
                        'Got task release activation as undefined' + response
                      );
                    }
                    const status = response.data.rows[0][0];
                    console.info(`status is - ${status}`)
                    if (status != '9130031781613016721') {
                      throw new Error(
                        'Wait for release activation is not in waiting state',
                      );
                    };
                  }
                }
              },
              {
                max: 5, // maximum amount of tries
                timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
                backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
              },
            );

            await Common.delay(10000);
            await tapis.processReleaseActivation(workOrderNumber);
            await Common.delay(10000);
            console.info('Processing the work order no.: ' + workOrderNumber);
            await tapis.processWorkOrder(workOrderNumber);
          }
        }
      }

      // await retry(
      //   async function (options) {
      //     // options.current, times callback has been called including this call
      //     return await du
      //       .getWorkOrderNumbersNotCompleted(dbcfg, customerId)
      //       .then((response) => {
      //         if (
      //             response.length > 0
      //         ) {
      //           console.warn('Sales Order status is not Processing' + response;);
      //         }
      //       }
      //   }),
      //   {
      //     max: 5, // maximum amount of tries
      //     timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
      //     backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      //   },
      // );

      let allPendingOrders: any ;
      console.info('Getting pending orders');
      await Common.delay(10000);
      await retry(
        async function (options) {
          // options.current, times callback has been called including this call
          const response: AxiosResponse= await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));

          if (response.data.rows.length === undefined) {
            throw 'Got pending orders as undefined' + response;
          }
          allPendingOrders = response.data.rows;
        },
        {
          max: 5, // maximum amount of tries
          timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
          backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
        },
      );

      if (
        allPendingOrders != null &&
        allPendingOrders !== undefined &&
        allPendingOrders.length > 0
      ) {
        for (let orIndex = 0; orIndex < allPendingOrders.length; orIndex++) {
          const orderInternalId = allPendingOrders[orIndex][1];
          const orderName = allPendingOrders[orIndex][0];
          if (orderName.toLowerCase().includes('shipment')) {
            console.info(
              'Processing release activation for orderInternalId: ' +
              orderInternalId,
            );
            await tapis.processReleaseActivation(orderInternalId);
            // console.info('Getting shipment order and purchase no.');
            const result = await dbProxy.executeQuery(getShipmentOrderNumberAndPurchaseOrderNumber(orderInternalId));
            const res = result.data.rows

            await Common.delay(10000);
            await tapis.processShipmentOrder(
              res.shipmentOrderNumber,
              res.purchaseeOrderNumber,
            );

            // Hit shipment order completion
            console.info('Getting HoldOrderTaskNumber');
            await Common.delay(10000);
            const holdordertask = await postgresQueryExecutor(getHoldOrderTaskNumber(res.purchaseeOrderNumber))

            console.info(holdordertask);
            try {
              console.info('Processing Hold order task: ' + holdordertask);
              await tapis.processHoldOrderTask(holdordertask);
            } catch (err) {
              // console.info(JSON.stringify(err));
            }
            console.info(
              'Processing shipment order no. ' + res.shipmentOrderNumber,
            );

            // Wait for 10 seconds to get completedawait
            await Common.delay(10000);
          }
        }
      }

      await retry(
        async function (options) {
          // options.current, times callback has been called including this call
          const response: AxiosResponse= await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));

          if (response.data.rows.length === undefined) {
            throw 'Got pending orders as undefined' + response;
          }
          allPendingOrders = response.data.rows;
        },
        {
          max: 5, // maximum amount of tries
          timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
          backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
        },
      );
      if (
        allPendingOrders != null &&
        allPendingOrders !== undefined &&
        allPendingOrders.length > 0
      ) {
        for (let orIndex = 0; orIndex < allPendingOrders.length; orIndex++) {
          const orderInternalId = allPendingOrders[orIndex][1];
          const orderName = allPendingOrders[orIndex][0];
          if (orderName.toLowerCase().includes('mailbox cfs')) {
            console.info(
              'Processing Wait for Email Reservation for orderInternalId: ' +
              orderInternalId,
            );
            console.info('Getting Wait for Email Reservation task');

            const response = await dbProxy.executeQuery(getTaskNumber(orderInternalId, 'Wait for Email Reservation'));

            const res = response.data.rows


            for (let index = 0; index < res.length; index++) {
              await tapis.processHoldOrderTask(res[index]);
            }
          }
          if (orderName.toLowerCase().includes('home phone')) {
            const response = await dbProxy.executeQuery(getManualTasksFromOrder(orderInternalId,'Validate Service'))

            const res = response.data.rows

            console.info('processing Validate Service for Home Phone product');
            for (let index = 0; index < res.length; index++) {
              await tapis.processManualTask(res[index]);
            }
          }

          if (orderName.toLowerCase().includes('home security')) {
            const response = await dbProxy.executeQuery(getManualTasksFromOrder(orderInternalId,'Home security Product Manual Task'))

            const res = response.data.rows


            console.info('processing Home security Product Manual Task');
            for (let index = 0; index < res.length; index++) {
              await tapis.processManualTask(res[index]);
            }
          }
          if (orderName.toLowerCase().includes('tn porting')) {
            const response = await dbProxy.executeQuery(getTaskNumber(orderInternalId, 'Wait for Final Status Notification Task'));

            const task = response.data.rows

            console.info('processing Wait for Final Status Notification Task');
            for (let index = 0; index < task.length; index++) {
              await tapis.processHoldOrderTask(task[index]);
            }
          }
        }
      }

      await retry(
        async function (options) {
          // options.current, times callback has been called including this call
          const response: AxiosResponse= await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));

          if (!response.data.rows || response.data.rows.length === undefined) {
            throw 'Got pending orders as undefined' + response;
          }
          if (response.data.rows.length > 0) {
            // throw new Error(
            //   `Retrying now as we are getting still pending orders: ${JSON.stringify(
            //     response,
            //   )}`,
            // );
          }
          // console.info(
          //   `all pending orders after completing order on ncbe${JSON.stringify(
          //     response,
          //   )}`,
          // );
          shoppingCartContext().setAllPendingOrders(response.data.rows);
        },
        {
          max: 5, // maximum amount of tries
          timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
          backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
        },
      );
    }
    else {
      shoppingCartContext().setAllPendingOrders([]);
      console.info('all orders are processed');
    }
  });*/

  then('validate that no errors created on BE', async () => {
    const customerId = preconditionContext().getCustomerObjectId()!;
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!test')
    const response = await dbProxy.executeQuery(getErrorsOccuredForCustomer(customerId))

    const customerErrors = response.data.rows
    console.debug('Errors' + JSON.stringify(customerErrors));
    test('customerErrors is not null', customerErrors,AssertionModes.strict).isnot(null,'customerErrors has not to be null')
    test('customerErrors is not undefined', customerErrors,AssertionModes.strict).isnot(undefined,'customerErrors has not to be undefined')
    test('customerErrors.length less than 1', customerErrors.length < 1,AssertionModes.strict).is(true,'customerErrors.length less than 1')
  });

}
