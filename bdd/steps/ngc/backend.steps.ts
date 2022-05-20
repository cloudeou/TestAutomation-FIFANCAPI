import PreconditionContext from "../../contexts/ngc/PreconditionContext";
import {Identificators} from "../../contexts/Identificators";
import {AssertionModes, featureContext, postgresQueryExecutor, test} from "@cloudeou/telus-bdd";
import ResponseContext from "../../contexts/ngc/ResponseConntext";
import ShoppingCartContext from "../../contexts/ngc/ShoppingCartContext";
import {
  getManualCreditTaskId,
  getSalesOrderStatusQuery,
  getWorkOrderNumbersNotCompleted,
  queryNcCustomerOrdersStatusNeitherCompletedNorProcessed,
  getShipmentOrderNumberAndPurchaseOrderNumber,
  getHoldOrderTaskNumber,
  getTaskNumber,
  getManualTasksFromOrder,
  getErrorsOccuredForCustomer,
  getBillingFailedActionStatus,
  queryCheckOrdersStatuses,
  queryCheckTheRDB_SALES_ORDERSTable,
  queryATTR_TYPE_ID,
  iptvServiceKey, queryOption82
} from "../../../bdd-src/ngc/db/db-queries";
import {TelusApiUtils} from "../../../bdd-src/telus-apis/telus-apis";
import {Common} from "../../../bdd-src/utils/commonBDD/Common";
import retry from "retry-as-promised";
import {AxiosResponse} from "axios";
import {DbProxyApi} from "../../../bdd-src/ngc/db/db-proxy-api/db-proxy.api";
import {OrdersProcessor, TasksProcessor} from "../../../bdd-src/ngc/backendSteps/backendStepsCommon";
import {replacerFunc} from "../../../bdd-src/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import {checkEmail, getLastEmail} from "../../../bdd-src/utils/mailer/mailSlurpApi";
import { data } from '../../../test-data/data';

type step = (
    stepMatcher: string | RegExp,
    callback: (...args: any) => void
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
  const tasksProcessor = new TasksProcessor();
  const ordersProcessor = new OrdersProcessor()

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
    let incompleteorders: any;

    try {
      const response = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId!));
      await Common.delay(10000)
      incompleteorders = response.data.rows;
      console.log('get correct incompleteorders', incompleteorders);
    } catch (error) {

      console.log(error);
      throw error
    }
    if (!!incompleteorders && incompleteorders.length > 0) {

      await tasksProcessor.processManualTask(customerId)

      await ordersProcessor.processPendingWorkOrders(customerId)

      await ordersProcessor.processAllPendingOrders(customerId)

      /*let pendingWorkOrders: any;

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
          }*/
/////////////////////////////
      /*let allPendingOrders;
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
      }*/
      console.log('!!!!!!!!! last block')

      await retry(
          async (options) => {
              // options.current, times callback has been called including this call
            const response: AxiosResponse = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId))

            if (!response || response.data.rows.length === undefined) {
              throw 'Got pending orders as undefined' + response;
            }
            if (response.data.rows.length > 0) {
              console.log('error inside if')
              throw new Error(
                `Retrying now as we are getting still pending orders: ${JSON.stringify(
                  response,
                  replacerFunc()
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
      );
    }

      else {
        shoppingCartContext().setAllPendingOrders([]);
      }

  })

  when('try to cancel sales order on BE', async () => {
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

      await tasksProcessor.processManualTask(customerId)

      /*const responseGetManualCreditTaskId = await dbProxy.executeQuery(getManualCreditTaskId(customerId));


      const manualCreditTaskId = responseGetManualCreditTaskId.data.rows[0]
      if (manualCreditTaskId !== null) {
        await tapis.processManualTask(manualCreditTaskId);
        await Common.delay(5000);
      }*/

      await ordersProcessor.processPendingWorkOrders(customerId)

      /*let pendingWorkOrders: any;
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
      }*/

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

      await ordersProcessor.processAllPendingOrders(customerId)

      /*let allPendingOrders: any ;
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
      }*/

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
  });

  then('validate that no errors created on BE', async () => {
    const customerId = preconditionContext().getCustomerObjectId()!;
    const response = await dbProxy.executeQuery(getErrorsOccuredForCustomer(customerId))

    const customerErrors = response.data.rows
    console.debug('Errors' + JSON.stringify(customerErrors));
    test('customerErrors is not null', customerErrors,AssertionModes.strict).isnot(null,'customerErrors has not to be null')
    test('customerErrors is not undefined', customerErrors,AssertionModes.strict).isnot(undefined,'customerErrors has not to be undefined')
    test('customerErrors.length less than 1', customerErrors.length < 1,AssertionModes.strict).is(true,'customerErrors.length less than 1')
  });

  and('validate that all orders are completed successfully', () => {
    let allPendingOrders = shoppingCartContext().getAllPendingOrders();
    test('allPendingOrders length toBe (0)', allPendingOrders.length, AssertionModes.strict).is(0,'allPendingOrders length should Be (0)')
  });

  and('validate that all orders are canceled successfully', () => {
    let allPendingOrders = shoppingCartContext().getAllPendingOrders();
    test('allPendingOrders length toBe (0)', allPendingOrders.length, AssertionModes.strict).is(0,'allPendingOrders length should Be (0)')
  });

  /*and('check that the letters was received:', async (letterInfoTable) => {
    await Common.delay(15000);
    const emailId = preconditionContext().getEmailId();
    const userEmail = await getLastEmail(emailId);
    for (let letter in userEmail)
      letterInfoTable.forEach(({ subject, body }: any) => {
        const splittedBody = body.split('=>');
        let checkResult =  checkEmail(userEmail[0],splittedBody,subject);
        if (checkResult.includesSubject === false || checkResult.includesSubject === false)
          checkResult =  checkEmail(userEmail[1],splittedBody,subject);
        test(`Email contains ${splittedBody}`,checkResult.includesKeyWords, AssertionModes.strict).is(true,`Email doest not contains ${splittedBody}`)
        test(`Email contains letter with subject ${subject}`,checkResult.includesSubject, AssertionModes.strict).is(true,`Email doest not contains letter with subject ${subject}, but ${userEmail[0].headerSubject}`)

      });

    // const customerEmail = preconditionContext().getCustomerEmail();
    // const userLetters = await getUserAllLetters(
    //   customerEmail,
    //   letterInfoTable.length,
    // );
    // expect(userLetters, "Letters wasn't received").not.toBeNull();
    // expect(
    //   userLetters.length,
    //   `Recieved letters is't equal to table length`,
    // ).toEqual(letterInfoTable.length);
    //
    // logger.info(
    //   `Started comparing subject and body in inbox ${userLetters[0].inboxId}`,
    // );
    // letterInfoTable.forEach(({ subject, body }) => {
    //   const foundLetter = userLetters.find((letter: any) => {
    //     const splittedBody = body.split('=>');
    //
    //     if (splittedBody.length === 1) {
    //       if (
    //         !!letter.subject.match(new RegExp(subject, 'ig')) ||
    //         !!letter.body.match(new RegExp(splittedBody[0], 'ig'))
    //       ) {
    //         logger.info(
    //           `Letter: ${letter.id} in inbox: ${letter.inboxId}@mailslurp.com recieved`,
    //         );
    //         return true;
    //       }
    //     }
    //     const includesKeyWords = splittedBody.every(
    //       (keyword: any) =>
    //         !!letter.subject.match(new RegExp(subject, 'ig')) ||
    //         !!letter.body.match(new RegExp(keyword, 'ig')),
    //     );
    //     if (includesKeyWords) {
    //       logger.info(
    //         `Letter: ${letter.id} in inbox: ${letter.inboxId}@mailslurp.com recieved`,
    //       );
    //       return true;
    //     }
    //   });
    //   expect(
    //     foundLetter,
    //     `Letter with subject ${subject} did't come`,
    //   ).not.toBeUndefined();
    // });
  });*/

  and('validate that all billing actions completed successfully', async () => {
    const customerId = preconditionContext().getCustomerObjectId()!;
    const response = await dbProxy.executeQuery(getBillingFailedActionStatus(customerId))
    const billingActionStatus = response.data.rows

    test(`Billing action status for ${customerId} is not NULL`, billingActionStatus, AssertionModes.strict).isnot(null,`Billing action status for ${customerId} should not be NULL`)
    test(`Billing action status for ${customerId} is defined`, billingActionStatus, AssertionModes.strict).isnot(undefined,`Billing action status for ${customerId} is not defined`)
    test(`Status for customer: ${customerId} should be less then 1}`,billingActionStatus.length < 1 , AssertionModes.strict).is(true,`Status for customer: ${customerId} is ${billingActionStatus}`)
  });

  and(/check (present|absent) order statuses/, async (status,table) => {
    let customerObjectId = preconditionContext().getCustomerObjectId()!;
    let statusMap = Common.getStatusesMapFromTable(table);

    await Common.delay(15000);
    for (const [key, value] of statusMap) {
      const response = await dbProxy.executeQuery(queryCheckOrdersStatuses(key, customerObjectId))
      let orderStatus = response.data.rows
       console.log(orderStatus)
       console.log(key)
      status === 'present'
        ?
        test(`Status for ${key} = ${orderStatus[0][1]} but not ${value} is equal to ${data.statuses[value]}`, orderStatus[0][0], AssertionModes.strict)
          .is(data.statuses[value],`Status for ${key} = ${orderStatus[0][1]} but not ${value}`)
        //expect(orderStatus[0][0], `Status for ${key} = ${orderStatus[0][1]} but not ${value}`,).toEqual(data.statuses[value])
        :
        test('orderStatus equal []', orderStatus.length === 0, AssertionModes.strict).is(true,`Order ${key} present in shoping cart`)
        //expect(orderStatus, `Order ${key} present in shoping cart`).toEqual([]);
    }
  });

  and('check the RDB_SALES_ORDERS table', async () => {
    const response = await dbProxy.executeQuery(queryCheckTheRDB_SALES_ORDERSTable())
    const ifTableExist = response.data.rows[0][0]
    test('єRDB_SALES_ORDERS ifTableExist not toBeNull', ifTableExist, AssertionModes.strict).isnot(null, 'єRDB_SALES_ORDERS ifTableExist should not toBeNull');
    test('єRDB_SALES_ORDERS ifTableExist not toBeUndefined', ifTableExist, AssertionModes.strict).isnot(undefined, 'єRDB_SALES_ORDERS ifTableExist should not toBeUndefined');
  });

  and('check that ATTR_TYPE_ID is text', async () => {
    const response = await dbProxy.executeQuery(queryATTR_TYPE_ID())
    const isTest = response.data.rows[0][0];
    test('check that ATTR_TYPE_ID is text',isTest, AssertionModes.strict ).is(0,'check that ATTR_TYPE_ID is text');
  });

  and(/check appointment for (.*) month/, async (monthToCheck) => {
    let addressId = preconditionContext().getAddressId();
    await tapis.processSearchAvailableAppointment(addressId,monthToCheck)
  });

  /*and(/send async call to (link|unlink) a Smart Speaker/, async (value) => {
    const enterpriseCustomerID =preconditionContext().getExternalCustomerId();
    value === 'link'
      ? console.log( await tapis.sendingCallToLink(apicfg,enterpriseCustomerID, 'new'))
      : console.log( await tapis.sendingCallToLink(apicfg,enterpriseCustomerID, 'delete'))
  });*/

  /*and('add STB with SOAP', async () => {
    const customerId =preconditionContext().getExternalCustomerId();

    const response = await dbProxy.executeQuery(iptvServiceKey(customerId))

    /!*let iptvServiceKey = await du.select(
      dbcfg,
      dq.iptvServiceKey(
        customerId,
      ),
    );*!/
    console.log('customerId: ' + customerId)

    console.log('iptvServiceKey: ' + response.data.rows)

    console.log( await tapis.stepForAddingSTB(response.data.rows))
  });*/

  and('get option 82', async () => {
    const customerId =preconditionContext().getExternalCustomerId();

    const response = await dbProxy.executeQuery(queryOption82(customerId,))

    let option82 = response.data.rows
    console.log('customerId: ' + customerId)

    console.log('option82: ' + option82)

  });

  and('filter customers by values', async (table) => {
    let valuesMap = Common.createValuesMapFromTable(table);
    console.log(valuesMap);

    let Option82 = valuesMap['Option82'] ? valuesMap['Option82'] : ''
    console.log('Option82: ' + Option82)

    let connectivityStatus = valuesMap['connectivityStatus'] ? valuesMap['connectivityStatus'] : ''
    console.log('connectivityStatus: ' + connectivityStatus)

    let activeServiceIndicator = valuesMap['activeServiceIndicator'] ? valuesMap['activeServiceIndicator'] : ''
    console.log('activeServiceIndicator: ' + activeServiceIndicator)

    let hsiaServiceIndicator = valuesMap['hsiaServiceIndicator'] ? valuesMap['hsiaServiceIndicator'] : ''
    console.log('hsiaServiceIndicator: ' + hsiaServiceIndicator)

    let tvServiceIndicator = valuesMap['tvServiceIndicator'] ? valuesMap['tvServiceIndicator'] : ''
    console.log('tvServiceIndicator: ' + tvServiceIndicator)

    let voiceServiceIndicator = valuesMap['voiceServiceIndicator'] ? valuesMap['voiceServiceIndicator'] : ''
    console.log('voiceServiceIndicator: ' + voiceServiceIndicator)


    // let newArr = [...valuesMap.entries()]
    // console.log('newArr: ' + newArr)
    // console.log('newArr: ' + newArr.length)

    // let Option82 = newArr.find(([key, value]) => key === 'Option82')
    // ? newArr.find(([key, value]) => key === 'Option82')[1] : ''
    // console.log('Option82: ' + Option82)

    // let connectivityStatus = newArr.find(([key, value]) => key === 'connectivityStatus')
    // ? newArr.find(([key, value]) => key === 'connectivityStatus')[1] : ''
    // console.log('connectivityStatus: ' + connectivityStatus)

    // let activeServiceIndicator = newArr.find(([key, value]) => key === 'activeServiceIndicator')
    // ? newArr.find(([key, value]) => key === 'activeServiceIndicator')[1] : ''
    // console.log('activeServiceIndicator: ' + activeServiceIndicator)

    // let hsiaServiceIndicator = newArr.find(([key, value]) => key === 'hsiaServiceIndicator')
    // ? newArr.find(([key, value]) => key === 'hsiaServiceIndicator')[1] : ''
    // console.log('hsiaServiceIndicator: ' + hsiaServiceIndicator)

    // let tvServiceIndicator = newArr.find(([key, value]) => key === 'tvServiceIndicator')
    // ? newArr.find(([key, value]) => key === 'tvServiceIndicator')[1] : ''
    // console.log('tvServiceIndicator: ' + tvServiceIndicator)

    // let voiceServiceIndicator = newArr.find(([key, value]) => key === 'voiceServiceIndicator')
    // ? newArr.find(([key, value]) => key === 'voiceServiceIndicator')[1] : ''
    // console.log('voiceServiceIndicator: ' + voiceServiceIndicator)


    // console.log( await tapis.filterCustomersByValues(apicfg, Option82, connectivityStatus, activeServiceIndicator, hsiaServiceIndicator, tvServiceIndicator, voiceServiceIndicator))

  });

}
