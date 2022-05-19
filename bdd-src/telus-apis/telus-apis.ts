import {envConfig} from "../env-config";
import {StringUtils} from "../utils/common/StringUtils";
import {axiosInstance} from "../axios-instance";
import {FileSystem} from "../utils/common/FileSystem";
import retry from "retry-as-promised";
import { DateUtils } from "../utils/common/DateUtils"
import { OauthToken } from "../ngc/oauth-token";
import {generateKongHeaders} from "../ngc/IkongApi"



export class TelusApiUtils {

    private _oauthToken: any;

    constructor() {
        this._oauthToken = new OauthToken(
            envConfig.dbApi.clientId,
            envConfig.dbApi.clientSecret
        );
    }
    

    async processHoldOrderTask(taskObjectId: string) {

        console.log( `Using netcracker api to complete holorder task ${taskObjectId}`);

        let api =
        envConfig.ikongUrl + envConfig.holdOrderTaskCompletion.endpoint;
        const keywordToReplace = envConfig.holdOrderTaskCompletion.keywordsToReplace;
        console.log(`Replacing ${keywordToReplace} in api with ${taskObjectId}`);
        api = StringUtils.replaceString(api, keywordToReplace, taskObjectId);
        console.debug(`api after replacing keywords: ${api}`);
        console.debug(`Hitting as below details: api: ${api}`);

        const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
        console.log("token", token);
        try {
            const headers = await generateKongHeaders(token);
            const response: any = await axiosInstance({
                method: "GET",
                url: api,
                headers,
            });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }


    async processManualTask(taskObjectId: string) {
        // Disable TLS/SSL unauthorized verification; i.e. ignore ssl certificates
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        let api = envConfig.ikongUrl + envConfig.processManualTaskCompletion.endpoint;
        const keywordToReplace = '#TASK_OBJECT_ID#';
        api = StringUtils.replaceString(api, keywordToReplace, taskObjectId);

        const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
        console.log("token", token);
        const headers = await generateKongHeaders(token);

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


    async processReleaseActivation(workOrderId: string) {
        console.log(
            `Using netcracker api to send release activation event for work order ${workOrderId}`,
        );
        // Disable TLS/SSL unauthorized verification; i.e. ignore ssl certificates
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        const api = envConfig.ikongUrl + envConfig.releaseActivation.endpoint;
        const contentType = {
            "Content-Type": envConfig.releaseActivation.contentType,
        };
        console.log(`api-url: ${api}
        headers: ${JSON.stringify(contentType)}`);

        const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
        console.log("token", token);
       
      
        console.debug(`Hitting as below details:
        api: ${api}
        contentType: ${JSON.stringify(contentType)}
        `);

        try {
            const headers = await generateKongHeaders(token);
            const response: any = await axiosInstance({
                method: "POST",
                url: api,
                headers,
                data: {workOrderId}
            });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async processWorkOrder(workOrderId: string) {
        // Disable TLS/SSL unauthorized verification; i.e. ignore ssl certificates
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        const api = envConfig.ikongUrl + envConfig.workOrderCompletion.endpoint;
        const contentType = {
            "Content-Type": envConfig.workOrderCompletion.contentType,
        };

        const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
        console.log("token", token);
        const headers = await generateKongHeaders(token);
        const body = JSON.stringify({workOrderId})

        let response: any;

        await retry(
          async function (options) {

              try {
                  const resp: any = await axiosInstance({
                      method: "POST",
                      url: api,
                      headers: {...headers, ...contentType},
                      data: body
                  });

                  if (resp.status === 200) {
                      response = resp;
                  } else {
                      throw new Error("Response not received");
                  }
              }
              catch (error) {
                  throw (
                    "Api: " +
                    api +
                    "\nContentType: " +
                    contentType +
                    "\nrawBody: " +
                    body +
                    "\nERROR: " +
                    error
                  );
              }
          },
          {
              max: 5, // maximum amount of tries
              timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
              backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
          }
        );

        console.log(`processworkorder is ${response.data}`)

        return response;


    }

    async processShipmentOrder(orderNumber: string, purchaseOrderNumber: string) {
        console.log(
            `Using netcracker api to complete shipment order for order ${orderNumber},  purchase-order-number ${purchaseOrderNumber}`,
        );
        // Disable TLS/SSL unauthorized verification; i.e. ignore ssl certificates
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        const trackingNumber = "539459352A";
        const shipper = "CANADA POST";
        const expectedDeliveryDate = DateUtils.dateMMDDYYYY(
            DateUtils.tomorrowDate(),
            "/"
        );

        const api =
        envConfig.ikongUrl + envConfig.shipmentOrderCompletion.endpoint;
        
        const contentType = {
            "Content-Type": envConfig.shipmentOrderCompletion.contentType,
        };
        console.debug(`api-url: ${api}
          headers: ${JSON.stringify(contentType)}`);

        let body = {
            orderNumber,
            trackingNumber,
            expectedDeliveryDate,
            purchaseOrderNumber,
            shipper
        }
        console.log('body: ' + body);

        const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
        console.log("token", token);
        
        console.debug(`Hitting as below details:
            api: ${api}
            contentType: ${JSON.stringify(contentType)}`);
    try {
        const headers = await generateKongHeaders(token);
        const response: any = await axiosInstance({
            method: "POST",
            url: api,
            headers,
            data: body
        });
        return response;
    } catch (error) {
        console.log(error);
        throw error;
        }   
    }

    public wait(ms: any) {
        let startPoint: any;
        let endPoint: any;
        startPoint = new Date();
        do {
          endPoint = new Date();
        } while (endPoint - startPoint < ms);
      }
}