import retry from "retry-as-promised";
import {AxiosResponse} from "axios";
import { featureContext } from "@cloudeou/telus-bdd";
import ResponseContext from "../../../bdd/contexts/fifa/FIFA_ResponseConntext";
import { Identificators } from "../../../bdd/contexts/Identificators";
import {
  getHoldOrderTaskNumber, getManualTasksFromOrder,
  getTaskNumber, getWorkOrderNumbersNotCompleted,
  queryNcCustomerOrdersStatusNeitherCompletedNorProcessed,
  getShipmentOrderObjectIdAndShipmentItemsQuery
} from "../db/db-queries";
import {Common} from "../utils/commonBDD/Common";
import {DbProxyApi} from "../db/db-proxy-api/db-proxy.api";
import {TelusApiUtils} from "../telus-apis/telus-apis";
import { PayloadGenerator } from "./backend.payload-generator"

const dbProxy = new DbProxyApi();
const tapis = new TelusApiUtils();


export class OrdersHandler {

  private _allPendingOrders: any;
  private _pendingWorkOrders: any;
  


  constructor() {}

  async processPendingWorkOrders(customerId: string) {
    await this.requestWorkOrderNumbersNotCompleted(customerId);

    if (
      this._pendingWorkOrders !== null &&
      this._pendingWorkOrders !== undefined &&
      this._pendingWorkOrders.length > 0
    ) {
      for (let orIndex = 0; orIndex < this._pendingWorkOrders.length; orIndex++) {
        let workOrderNumber = this._pendingWorkOrders[orIndex][0];
        const workOrderName = this._pendingWorkOrders[orIndex][2];
        if (workOrderName.toLowerCase().includes('work order')) {

          await retry(
            async (options) => {

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

        if (workOrderNumbersNotCompleted.length === undefined) {
          throw 'Got pending work orders as undefined' + response;
        }

        this._pendingWorkOrders = workOrderNumbersNotCompleted
      },
      {
        max: 5, // maximum amount of tries
        timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
        backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      },
    )
  }

  async processAllPendingOrders (customerId: string) {
    let responseContext = (): ResponseContext =>
      featureContext().getContextById(Identificators.FIFA_ResponseContext);

    await this.requestPendingOrders(customerId)


    if (
      this._allPendingOrders != null &&
      this._allPendingOrders !== undefined &&
      this._allPendingOrders.length > 0
    ) {
      try {

        for (let orIndex = 0; orIndex < this._allPendingOrders.length; orIndex++) {
          const orderInternalId = this._allPendingOrders[orIndex][1];
          const orderName = this._allPendingOrders[orIndex][0];
          let response: any;
          response = responseContext().createCustomerResponse;
          let ecid = response.ecid;
          console.log("ecid", ecid)
          if (orderName.toLowerCase().includes('shipment')) {

            await tapis.processReleaseActivation(orderInternalId);

            const getShipmentOrder = await dbProxy.executeQuery(getShipmentOrderObjectIdAndShipmentItemsQuery(ecid))

            const getShipmentOrderResponse = getShipmentOrder.data.rows
            
            let items = []
            for (let orShIndex = 0; orShIndex < getShipmentOrderResponse.length; orShIndex++) {
              const shipmentOrderObjectId = getShipmentOrderResponse[orShIndex][0];
              const orderNumber = getShipmentOrderResponse[orShIndex][1];
              const sku = getShipmentOrderResponse[orShIndex][2];
              const item = new PayloadGenerator(ecid, shipmentOrderObjectId, orderNumber, sku).generateItem(ecid, shipmentOrderObjectId, orderNumber, sku)
              items.push(item)
            }

            await tapis.completeShipmentOrder(items);

            await Common.delay(10000);
            const holdordertask = await dbProxy.executeQuery(getHoldOrderTaskNumber(getShipmentOrderResponse[0][0]))
            const holdordertaskResponce = holdordertask.data.rows

            try {
              await tapis.processHoldOrderTask(holdordertaskResponce);
            } catch (err) {
              console.log(err)
              throw err
            }
            // Wait for 10 seconds to get completedawait
            await tapis.wait(20000);
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
      async  (options) => {
        // options.current, times callback has been called including this call
        const response = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));
        if (response.data.rows.length === undefined) {
          throw 'Got pending orders as undefined' + response;
        }

        this._allPendingOrders =  response.data.rows;
      },
      {
        max: 5, // maximum amount of tries
        timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
        backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      },
    );
  }

}