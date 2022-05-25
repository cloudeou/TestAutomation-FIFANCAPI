import {envConfig} from "../env-config";
import {StringUtils} from "../utils/common/StringUtils";
import {axiosInstance} from "../axios-instance";
import retry from "retry-as-promised";
import { DateUtils } from "../utils/common/DateUtils"
import {AxiosResponse} from "axios";
import {test, AssertionModes} from '@cloudeou/telus-bdd'
import { OauthToken } from "../ngc/oauth-token";
import {generateKongHeaders} from "../ngc/IkongApi";

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

    async completeShipmentOrder(ecid: string, 
        shipmentOrderObjectId: string, 
        orderNumber: string, 
        sku: string,
        status?: string, 
        operationName?: string,
        notificationType?: string,
        ICCID?: string) {
        
            console.log(
            `Using netcracker api to complete shipment order for order ${orderNumber},  shipment-order-objectId ${shipmentOrderObjectId}`,
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
            "items": [
                {
                  ecid,
                  shipmentOrderObjectId,
                  orderNumber,
                  sku,
                  status,
                  trackingNumber,
                  expectedDeliveryDate,
                  shipper,
                  operationName,
                  notificationType,
                  ICCID
                }
              ]
        }
        console.log('body: ' + JSON.stringify(body));

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


    async processSearchAvailableAppointment(locationId: string, monthToCheck: any) {
        // Disable TLS/SSL unauthorized verification; i.e. ignore ssl certificates
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
        let now = new Date();
        let startDate = DateUtils.formatDate(new Date(now.getFullYear(), now.getMonth(), 1), '-');
        let endDate = DateUtils.formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0), '-');
        for (let i = 1; i <= monthToCheck; i++) {
            console.log('start', startDate);
            console.log('end', endDate);

            let api =
              envConfig.ikongUrl +
              envConfig.searchAvailableAppointments.endpoint;

            const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
            console.log("token", token);
            const headers = await generateKongHeaders(token);

            let contentType = {
                "Content-Type": envConfig.searchAvailableAppointments.contentType,
            };
            console.debug(`api-url: ${api}
       headers: ${JSON.stringify(contentType)}`);

            const body = JSON.stringify({
                "startDate": startDate,
                "locationId": locationId,
                "endDate": endDate
            })

            try {
                const response: AxiosResponse = await axiosInstance({
                    method: "POST",
                    url: api,
                    headers: {...headers, ...contentType},
                    data: body
                });

                console.debug(`response received: ${JSON.stringify(response)}`);

                test('processSearchAvailableAppointment response.status is 200', response.status, AssertionModes.strict).isnot(200,'processSearchAvailableAppointment response.status should be 200')
                startDate = DateUtils.formatDate(new Date(new Date(startDate).getFullYear(), new Date(startDate).getDate() + i + 1), '-');
                endDate = DateUtils.formatDate(new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0), '-')

            }
            catch (error) {
                console.log(error);
                throw error;
            }
        }
    }

    /*async sendingCallToLink(enterpriseCustomerID, actionValue) {

        // Disable TLS/SSL unauthorized verification; i.e. ignore ssl certificates
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        const api =
          cfg.sendAsyncCall.base + cfg.sendAsyncCall.endpoint;
        const contentType = {
            "Content-Type": cfg.sendAsyncCall.contentType,
        };
        logger.debug(`api-url: ${api}
           headers: ${JSON.stringify(contentType)}`);

        let rawBody = FileSystem.readFileSync(
          cfg.sendAsyncCall.fileForBody
        ).toString();

        let keywordToReplace = '#enterpriseCustomerID#';
        logger.debug(`Replacing ${keywordToReplace} in body with ${enterpriseCustomerID}`);
        rawBody = StringUtils.replaceString(rawBody, keywordToReplace, enterpriseCustomerID);

        keywordToReplace = '#actionValue#';
        logger.debug(`Replacing ${keywordToReplace} in body with ${actionValue}`);
        rawBody = StringUtils.replaceString(rawBody, keywordToReplace, actionValue);

        rawBody = rawBody.replace(/\r?\n|\r/g, ' ');
        logger.debug(`Hitting as below details:
        api: ${api}
        contentType: ${JSON.stringify(contentType)}
        rawBody: ${rawBody}`);
        console.log(`Hitting as below details:
        api: ${api}
        contentType: ${JSON.stringify(contentType)}
        rawBody: ${rawBody}`)

        // const response = await request("post", api).set(contentType).send(rawBody);
        const response = await this.postNgetResponse(api, contentType, rawBody);
        logger.debug(`response received: ${JSON.stringify(response)}`);
        logger.exitMethod(`response status: ${response.status}`);
        return response;
    }*/

    /*async stepForAddingSTB(cfg, iptvServiceKey) {
        logger.enterMethod(
          `Using netcracker api to complete customer ID iptvServiceKey ${iptvServiceKey}`,
        );
        // Disable TLS/SSL unauthorized verification; i.e. ignore ssl certificates
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        let GUID = btapi.getRandomInt(10000000, 99999999) + '-' + btapi.getRandomInt(1000, 9999) + '-' + btapi.getRandomInt(1000, 9999)
          + '-' + btapi.getRandomInt(1000, 9999) + '-' + btapi.getRandomInt(100000000000, 999999999999)
        console.log('GUID ' + GUID)

        let MACAddress = btapi.getRandomInt(10, 99) + ':' + btapi.getRandomInt(10, 99) + ':' + btapi.getRandomInt(10, 99) + ':'
          + btapi.getRandomInt(10, 99) + ':' + btapi.getRandomInt(10, 99) + ':' + btapi.getRandomInt(10, 99)
        console.log('MACAddress ' + MACAddress)

        const api =
          cfg.stepForAddingSTB.base + cfg.stepForAddingSTB.endpoint;
        const contentType = {
            "Content-Type": cfg.stepForAddingSTB.contentType,
        };
        logger.debug(`api-url: ${api}
         headers: ${JSON.stringify(contentType)}`);

        let rawBody = FileSystem.readFileSync(
          cfg.stepForAddingSTB.fileForBody
        ).toString();

        let keywordToReplace = '#iptvServiceKey#';
        logger.debug(`Replacing ${keywordToReplace} in body with ${iptvServiceKey}`);
        rawBody = StringUtils.replaceString(rawBody, keywordToReplace, iptvServiceKey);

        keywordToReplace = '#GUID#';
        logger.debug(`Replacing ${keywordToReplace} in body with ${GUID}`);
        rawBody = StringUtils.replaceString(rawBody, keywordToReplace, GUID);

        keywordToReplace = '#MACAddress#';
        logger.debug(`Replacing ${keywordToReplace} in body with ${MACAddress}`);
        rawBody = StringUtils.replaceString(rawBody, keywordToReplace, MACAddress);

        rawBody = rawBody.replace(/\r?\n|\r/g, ' ');
        logger.debug(
                    `Hitting as below details:
                    api: ${api}
                    contentType: ${JSON.stringify(contentType)}
                    rawBody: ${rawBody}`);
                            console.log(`Hitting as below details:
                    api: ${api}
                    contentType: ${JSON.stringify(contentType)}
                    rawBody: ${rawBody}`)

        // let response = await request
        // .post(api)
        // .auth("Administrator", "netcracker", {type: "basic"})
        // .set(contentType)
        // .send(rawBody)
        // .on("response", (res)=>{
        //     console.log(res.text);
        //     console.log(res.status);
        // })
        // logger.debug(`response received: ${JSON.stringify(response)}`);
        // logger.exitMethod(`response status: ${response.status}`);
        // console.log(`response status: ${response.status}`)
        // console.log('response: ' + JSON.stringify(response))
        // console.log('response: ' + response)

        try {
            return await request
              .post(api)
              .auth("Administrator", "netcracker", {type: "basic"}).set(contentType)
              .send(rawBody);
        }
        catch (error) {
            return error.response.text;
        }
    }*/
}