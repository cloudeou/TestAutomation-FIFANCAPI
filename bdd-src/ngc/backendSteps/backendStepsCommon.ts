import {Common} from "../../utils/commonBDD/Common";
import {DbProxyApi} from "../db/db-proxy-api/db-proxy.api";
import {envConfig} from "../../env-config";
import {StringUtils} from "../../utils/common/StringUtils";
import {axiosInstance} from "../../axios-instance";
import retry from "retry-as-promised";
import {AxiosResponse} from "axios";
import {TelusApiUtils} from "../../telus-apis/telus-apis";
import {
  getHoldOrderTaskNumber,
  getManualCreditTaskId, getManualTasksFromOrder, getShipmentOrderNumberAndPurchaseOrderNumber, getTaskNumber,
  getWorkOrderNumbersNotCompleted,
  queryNcCustomerOrdersStatusNeitherCompletedNorProcessed
} from "../db/db-queries";
import {postgresQueryExecutor} from "@cloudeou/telus-bdd";
const dbProxy = new DbProxyApi();
const tapis = new TelusApiUtils()

export class TasksProcessor {

  constructor() {}

  async processManualTask (customerId: string) {
    const manualCreditTaskId = await this.requestManualCreditTaskId(customerId);
    console.log('get correct manualCreditTaskId', manualCreditTaskId);
    if (manualCreditTaskId !== null && manualCreditTaskId !== undefined) {
      await Common.delay(10000)
      await this._processManualTask(manualCreditTaskId);
      await Common.delay(15000);
    }
  }

  private async requestManualCreditTaskId (customerId: string) {
    try {
      await Common.delay(15000)
      const response = await dbProxy.executeQuery(getManualCreditTaskId(customerId));
      return response.data.rows[0];
    }
    catch (error) {
      console.log(error);
      throw error
    }
  }


  private async _processManualTask(taskObjectId: string) {
    // Disable TLS/SSL unauthorized verification; i.e. ignore ssl certificates
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let api = envConfig.processManualTaskCompletion.base + envConfig.processManualTaskCompletion.endpoint;
    const keywordToReplace = '#TASK_OBJECT_ID#';
    api = StringUtils.replaceString(api, keywordToReplace, taskObjectId);

    const headers = await this.generateTAP360Headers();

    console.log(`manual-task-api-url: ${api}`);

    try {
      const response: any = await axiosInstance({
        method: "post",
        url: api,
        headers: {...headers, 'Content-Type': 'text/plain'},
      });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }

  }

  private async generateTAP360Headers():  Promise<any> {

    return {
      accept: "application/json",
      env: envConfig.envName
    };
  }

}

export class OrdersProcessor {

  private _allPendingOrders: any;


  constructor() {}

  async processPendingWorkOrders(customerId: string) {
    const pendingWorkOrders: any = await this.requestWorkOrderNumbersNotCompleted(customerId);

    console.log('pendingWorkOrders class, ',pendingWorkOrders)

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
            async (options) => {
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

                  console.log(`status -`, response.data.rows)

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
  }

  private async requestWorkOrderNumbersNotCompleted (customerId: string) {
    await retry(
      async  (options) => {
        // options.current, times callback has been called including this call
        await Common.delay(5000);
        const response = await dbProxy.executeQuery(getWorkOrderNumbersNotCompleted(customerId));
        await Common.delay(10000);
        const workOrderNumbersNotCompleted = response.data.rows;
        console.log('getWorkOrderNumbersNotCompleted',response.data)
        if (workOrderNumbersNotCompleted.length === undefined) {
          throw 'Got pending work orders as undefined' + response;
        }

        return workOrderNumbersNotCompleted
      },
      {
        max: 5, // maximum amount of tries
        timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
        backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      },
    )
  }

  async processAllPendingOrders (customerId: string) {
   this._allPendingOrders = await this.requestPendingOrders(customerId)


    if (
      this._allPendingOrders != null &&
      this._allPendingOrders !== undefined &&
      this._allPendingOrders.length > 0
    ) {
      try {

        for (let orIndex = 0; orIndex < this._allPendingOrders.length; orIndex++) {
          const orderInternalId = this._allPendingOrders[orIndex][1];
          const orderName = this._allPendingOrders[orIndex][0];
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
      async  (options) => {
        // options.current, times callback has been called including this call

        const response: AxiosResponse = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId))

        if (response.data.rows.length === undefined) {
          throw 'Got pending orders as undefined' + response;
        }
        this._allPendingOrders = response.data.rows;
      },
      {
        max: 5, // maximum amount of tries
        timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
        backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      },
    );

    if (
      this._allPendingOrders != null &&
      this._allPendingOrders !== undefined &&
      this._allPendingOrders.length > 0
    ) {
      for (let orIndex = 0; orIndex < this._allPendingOrders.length; orIndex++) {
        const orderInternalId = this._allPendingOrders[orIndex][1];
        const orderName = this._allPendingOrders[orIndex][0];
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



  }

  private async requestPendingOrders (customerId: string) {

    return await retry(
      async function (options) {
        // options.current, times callback has been called including this call
        const response = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));
        if (response.data.rows.length === undefined) {
          throw 'Got pending orders as undefined' + response;
        }
        console.log('allPendingOrders ' + response.data.rows)

        return  response.data.rows;
      },
      {
        max: 5, // maximum amount of tries
        timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
        backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      },
    );
  }

}