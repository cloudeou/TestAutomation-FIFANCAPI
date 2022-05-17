import PreconditionContext from "../../contexts/ngc/PreconditionContext";
import {Identificators} from "../../contexts/Identificators";
import {AssertionModes, featureContext, postgresQueryExecutor, test} from "@cloudeou/telus-bdd";
import ResponseContext from "../../contexts/ngc/ResponseConntext";
import ShoppingCartContext from "../../contexts/ngc/ShoppingCartContext";
import {
    getManualCreditTaskId, getSalesOrderStatusQuery, getWorkOrderNumbersNotCompleted,
    queryNcCustomerOrdersStatusNeitherCompletedNorProcessed
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
      incompleteorders = response.data.rows[0];
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

          try {
            const response = await dbProxy.executeQuery(getWorkOrderNumbersNotCompleted(customerId));
            const workOrderNumbersNotCompleted = response.data.rows[0];
            console.log('getWorkOrderNumbersNotCompleted',response.data)
            if (workOrderNumbersNotCompleted.length === undefined) {
              throw 'Got pending work orders as undefined' + response;
            }
            pendingWorkOrders = workOrderNumbersNotCompleted;


            return workOrderNumbersNotCompleted

          } catch (error: any) {
            console.log(error)
            // errorContext().status = ErrorStatus.skipped;
            // errorContext().error = `Error while getting sales order status from DB: ${JSON.stringify(error)}`;
          }
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

                const pendingWorkOrder = pendingWorkOrders[orIndex]

                  if (pendingWorkOrder.toLowerCase().includes('work order')) {

                    let workOrderNumber = pendingWorkOrder.split(',')[0];
                    const workOrderName = pendingWorkOrder.split(',')[2];

                      await retry(
                          async function (options) {
                              // options.current, times callback has been called including this call

                            try {
                              const response: AxiosResponse = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId))

                              console.log('queryNcCustomerOrdersStatusNeitherCompletedNorProcessed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', response.data)

                              const arrayOfArraysWithOrdersnotprocessed = response.data.rows[0]

                              for(const arrayWithOrdersnotprocessed of arrayOfArraysWithOrdersnotprocessed) {
                                for (let orIndex = 0; orIndex < arrayWithOrdersnotprocessed.length; orIndex++) {
                                  const orderNotProcessed = arrayWithOrdersnotprocessed[orIndex]

                                  const orderInternalId = orderNotProcessed.split(',')[1];
                                  const orderName = orderNotProcessed.split(',')[0];
                                  if (orderName.toLowerCase().includes('work order')) {

                                    let query = `select to_char(status) from nc_po_Tasks where order_id = ${orderInternalId} and name = 'Wait for Release Activation notification'`;
                                    const response = await dbProxy.executeQuery(query)
                                    const status = response.data.rows[0].length;
                                    if (status === undefined) {
                                      throw (
                                        'Got task release activation as undefined' + response
                                      );
                                    }
                                    if (status != '9130031781613016721') {
                                      throw new Error(
                                        'Wait for release activation is not in waiting state',
                                      );
                                    }
                                  }
                                }
                              }

                            }
                            catch (e) {
                              console.log(e)
                              throw e
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
      //
      //         let allPendingOrders;
      //         logger.debug('Getting pending orders');
      //         await Common.delay(10000);
      //         await retry(
      //             async function (options) {
      //                 // options.current, times callback has been called including this call
      //                 return await du
      //                     .select(
      //                         dbcfg,
      //                         dq.queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(
      //                             dbcfg,
      //                             customerId,
      //                         ),
      //                     )
      //                     .then((response) => {
      //                         if (response.length === undefined) {
      //                             throw 'Got pending orders as undefined' + response;
      //                         }
      //                         allPendingOrders = response;
      //                     });
      //             },
      //             {
      //                 max: 5, // maximum amount of tries
      //                 timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
      //                 backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      //             },
      //         );
      //
      //         if (
      //             allPendingOrders != null &&
      //             allPendingOrders !== undefined &&
      //             allPendingOrders.length > 0
      //         ) {
      //             for (let orIndex = 0; orIndex < allPendingOrders.length; orIndex++) {
      //                 const orderInternalId = allPendingOrders[orIndex][1];
      //                 const orderName = allPendingOrders[orIndex][0];
      //                 if (orderName.toLowerCase().includes('shipment')) {
      //                     logger.debug(
      //                         'Processing release activation for orderInternalId: ' +
      //                         orderInternalId,
      //                     );
      //                     await tapis.processReleaseActivation(apicfg, orderInternalId);
      //                     // logger.debug('Getting shipment order and purchase no.');
      //                     const res = await du.getShipmentOrderNumberAndPurchaseOrderNumber(
      //                         dbcfg,
      //                         orderInternalId,
      //                     );
      //
      //                     await Common.delay(10000);
      //                     await tapis.processShipmentOrder(
      //                         apicfg,
      //                         res.shipmentOrderNumber,
      //                         res.purchaseeOrderNumber,
      //                     );
      //
      //                     // Hit shipment order completion
      //                     logger.debug('Getting HoldOrderTaskNumber');
      //                     await Common.delay(10000);
      //                     const holdordertask = await du.getHoldOrderTaskNumber(
      //                         dbcfg,
      //                         res.purchaseeOrderNumber,
      //                     );
      //                     logger.debug(holdordertask);
      //                     try {
      //                         logger.debug('Processing Hold order task: ' + holdordertask);
      //                         await tapis.processHoldOrderTask(apicfg, holdordertask);
      //                     } catch (err) {
      //                         //logger.debug(JSON.stringify(err));
      //                     }
      //                     logger.debug(
      //                         'Processing shipment order no. ' + res.shipmentOrderNumber,
      //                     );
      //
      //                     // Wait for 10 seconds to get completedawait
      //                     await btapi.wait(10000);
      //                 }
      //             }
      //         }
      //
      //         await retry(
      //             async function (options) {
      //                 // options.current, times callback has been called including this call
      //                 return await du
      //                     .select(
      //                         dbcfg,
      //                         dq.queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(
      //                             dbcfg,
      //                             customerId,
      //                         ),
      //                     )
      //                     .then((response) => {
      //                         if (response.length === undefined) {
      //                             throw 'Got pending orders as undefined' + response;
      //                         }
      //                         allPendingOrders = response;
      //                     });
      //             },
      //             {
      //                 max: 5, // maximum amount of tries
      //                 timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
      //                 backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      //             },
      //         );
      //         if (
      //             allPendingOrders != null &&
      //             allPendingOrders !== undefined &&
      //             allPendingOrders.length > 0
      //         ) {
      //             for (let orIndex = 0; orIndex < allPendingOrders.length; orIndex++) {
      //                 const orderInternalId = allPendingOrders[orIndex][1];
      //                 const orderName = allPendingOrders[orIndex][0];
      //                 if (orderName.toLowerCase().includes('mailbox cfs')) {
      //                     logger.debug(
      //                         'Processing Wait for Email Reservation for orderInternalId: ' +
      //                         orderInternalId,
      //                     );
      //                     logger.debug('Getting Wait for Email Reservation task');
      //                     const res = await du.getTaskNumber(
      //                         dbcfg,
      //                         orderInternalId,
      //                         'Wait for Email Reservation',
      //                     );
      //                     for (let index = 0; index < res.length; index++) {
      //                         await tapis.processHoldOrderTask(apicfg, res[index]);
      //                     }
      //                 }
      //                 if (orderName.toLowerCase().includes('home phone')) {
      //                     const res = await du.getManualTasksFromOrder(
      //                         dbcfg,
      //                         orderInternalId,
      //                         'Validate Service',
      //                     );
      //                     logger.info('processing Validate Service for Home Phone product');
      //                     for (let index = 0; index < res.length; index++) {
      //                         await tapis.processManualTask(apicfg, res[index]);
      //                     }
      //                 }
      //                 if (orderName.toLowerCase().includes('home security')) {
      //                     const res = await du.getManualTasksFromOrder(
      //                         dbcfg,
      //                         orderInternalId,
      //                         'Home security Product Manual Task',
      //                     );
      //                     logger.info('processing Home security Product Manual Task');
      //                     for (let index = 0; index < res.length; index++) {
      //                         await tapis.processManualTask(apicfg, res[index]);
      //                     }
      //                 }
      //                 if (orderName.toLowerCase().includes('tn porting')) {
      //                     let task = await du.getTaskNumber(
      //                         dbcfg,
      //                         orderInternalId,
      //                         'Wait for Final Status Notification Task',
      //                     );
      //                     logger.info('processing Wait for Final Status Notification Task');
      //                     for (let index = 0; index < task.length; index++) {
      //                         await tapis.processHoldOrderTask(apicfg, task[index]);
      //                     }
      //                 }
      //                 if (orderName.toLowerCase().includes('reverse logistics')) {
      //                     let task = await du.getTaskNumber(
      //                         dbcfg,
      //                         orderInternalId,
      //                         'Wait for SAP Order closure',
      //                     );
      //                     logger.info('processing Wait for SAP Order closure');
      //                     for (let index = 0; index < task.length; index++) {
      //                         await tapis.processHoldOrderTask(apicfg, task[index]);
      //                     }
      //                 }
      //             }
      //         }
      //
      //         await retry(
      //             async function (options) {
      //                 // options.current, times callback has been called including this call
      //                 return await du
      //                     .select(
      //                         dbcfg,
      //                         dq.queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(
      //                             dbcfg,
      //                             customerId,
      //                         ),
      //                     )
      //                     .then((response) => {
      //                         if (!response || response.length === undefined) {
      //                             throw 'Got pending orders as undefined' + response;
      //                         }
      //                         if (response.length > 0) {
      //                             throw new Error(
      //                                 `Retrying now as we are getting still pending orders: ${JSON.stringify(
      //                                     response,
      //                                 )}`,
      //                             );
      //                         }
      //                         logger.debug(
      //                             `all pending orders after completing order on ncbe${JSON.stringify(
      //                                 response,
      //                             )}`,
      //                         );
      //                         shoppingCartContext().setAllPendingOrders(response);
      //                     });
      //             },
      //             {
      //                 max: 5, // maximum amount of tries
      //                 timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
      //                 backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      //             },
      //         );
      //     } else {
      //         shoppingCartContext().setAllPendingOrders([]);
      //         logger.debug('all orders are processed');
      //     }
    }

  })
}
