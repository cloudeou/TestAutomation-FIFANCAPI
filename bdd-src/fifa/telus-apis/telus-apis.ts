import {envConfig} from "../env-config";
import {StringUtils} from "../utils/common/StringUtils";
import {axiosInstance} from "../axios-instance";
import retry from "retry-as-promised";
import { DateUtils } from "../utils/common/DateUtils"
import {AxiosResponse} from "axios";
import {test, AssertionModes} from '@cloudeou/telus-bdd';
import { OauthToken } from "../oauth-token";
import {generateKongHeaders} from "../IkongApi";
import { RandomValueGenerator } from "../utils/common/RandomValueGenerator"

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

        console.log(`processworkorder is ${JSON.stringify(response.data)}`)

        return response;


    }

    async completeShipmentOrder(items: any) {
        
            console.log(
            `Using netcracker api to complete shipment order`,
        );

        const api =
        envConfig.ikongUrl + envConfig.shipmentOrderCompletion.endpoint;
        
        const contentType = {
            "Content-Type": envConfig.shipmentOrderCompletion.contentType,
        };
        console.debug(`api-url: ${api}
          headers: ${JSON.stringify(contentType)}`);

        let body = {
            "items": items
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
        // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
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

            const body = {
                "startDate": startDate,
                "locationId": locationId,
                "endDate": endDate
            }

            try {
                const response: AxiosResponse = await axiosInstance({
                    method: "POST",
                    url: api,
                    headers: {...headers, ...contentType},
                    data: body
                });

                console.debug(`response received: ${JSON.stringify(response)}`);

                test('processSearchAvailableAppointment response.status is 200', response.status, AssertionModes.strict).is(200,'processSearchAvailableAppointment response.status should be 200')
                startDate = DateUtils.formatDate(new Date(new Date(startDate).getFullYear(), new Date(startDate).getDate() + i + 1), '-');
                endDate = DateUtils.formatDate(new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0), '-')

            }
            catch (error) {
                console.log(error);
                throw error;
            }
        }
    }

    async setMigrationFlag(customerId: any) {
        console.log(
            `Using netcracker api to set migrated flag for customer: ${customerId}`,
        );

        let api =  envConfig.ikongUrl + envConfig.setMigrationFlag.endpoint;
        
        let contentType = {
            "Content-Type": "text/plain",
        };
        console.log(`api-url: ${api}`);

        const keywordToReplace = envConfig.setMigrationFlag.keywordsToReplace;
        console.log(`Replacing ${keywordToReplace} in api with ${customerId}`);

        api = StringUtils.replaceString(api, keywordToReplace, customerId);
        console.log(`api after replacing keywords: ${api}`);
        console.debug(`Hitting as below details: api: ${api}`);

        const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
        console.log("token", token);

        try {
            const headers = await generateKongHeaders(token);
            const response: any = await axiosInstance({
                method: "POST",
                url: api,
                headers: {...headers, ...contentType},
            });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
       
    }
    async sendingCallToLink(ecid: any, action: string) {

        const api =
        envConfig.ikongUrl + envConfig.sendAsyncCall.endpoint;
       
        console.log(`api-url: ${api}`);

        let body = {
            ecid,
            operationName: "externalVOIPDevice",
            action
        }


        const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
        console.log("token", token);

        console.log(`Hitting as below details:
        api: ${api}
        body: ${JSON.stringify(body)}`);

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

    async stepForAddingSTB(iptvServiceObjId: any) {
        console.log(
          `Using netcracker api to complete customer ID iptvServiceKey ${iptvServiceObjId}`,
        );
       
        let guid = RandomValueGenerator.getRandomInt(10000000, 99999999) + '-' + RandomValueGenerator.getRandomInt(1000, 9999) + '-' + RandomValueGenerator.getRandomInt(1000, 9999)
          + '-' + RandomValueGenerator.getRandomInt(1000, 9999) + '-' + RandomValueGenerator.getRandomInt(100000000000, 999999999999)
        console.log('guid ' + guid)

        let macAddress = RandomValueGenerator.getRandomInt(10, 99) + ':' + RandomValueGenerator.getRandomInt(10, 99) + ':' + RandomValueGenerator.getRandomInt(10, 99) + ':'
          + RandomValueGenerator.getRandomInt(10, 99) + ':' + RandomValueGenerator.getRandomInt(10, 99) + ':' + RandomValueGenerator.getRandomInt(10, 99)
        console.log('macAddress ' + macAddress)

        const api =
        envConfig.ikongUrl + envConfig.stepForAddingSTB.endpoint;
     
        console.log(`api-url: ${api}`);

        let body = {
            iptvServiceObjId,
            guid,
            macAddress
          }

        const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
        console.log("token", token);
        
        console.log(`Hitting as below details:
            api: ${api}
            body: ${JSON.stringify(body)}`);

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
}