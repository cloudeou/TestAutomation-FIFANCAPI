import {envConfig} from "../env-config";
import {StringUtils} from "../utils/common/StringUtils";
import {axiosInstance} from "../axios-instance";
import {FileSystem} from "../utils/common/FileSystem";
import retry from "retry-as-promised";

export class TelusApiUtils {



    async processHoldOrderTask(taskObjectId: string) {

        console.log( `Using netcracker api to complete holorder task ${taskObjectId}`);

        let api =
            envConfig.holdOrderTaskCompletion.base + envConfig.holdOrderTaskCompletion.endpoint;
        const keywordToReplace = envConfig.holdOrderTaskCompletion.keywordsToReplace;
        console.log(`Replacing ${keywordToReplace} in api with ${taskObjectId}`);
        api = StringUtils.replaceString(api, keywordToReplace, taskObjectId);
        console.debug(`api after replacing keywords: ${api}`);
        console.debug(`Hitting as below details: api: ${api}`);

        try {
            const headers = await this.generateTAP360Headers();
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

    async processReleaseActivation(workOrderId: string) {
        console.log(
            `Using netcracker api to send release activation event for work order ${workOrderId}`,
        );
        // Disable TLS/SSL unauthorized verification; i.e. ignore ssl certificates
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        const api = envConfig.releaseActivation.base + envConfig.releaseActivation.endpoint;
        const contentType = {
            "Content-Type": envConfig.releaseActivation.contentType,
        };
        console.log(`api-url: ${api}
        headers: ${JSON.stringify(contentType)}`);

        const keywordToReplace = envConfig.releaseActivation.keywordsToReplace[0];
        console.log(
            `keywords to replace in body: ${JSON.stringify(keywordToReplace)}`,
        );
       
      
        console.debug(`Hitting as below details:
        api: ${api}
        contentType: ${JSON.stringify(contentType)}
        `);

        try {
            const headers = await this.generateTAP360Headers();
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
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        const api = envConfig.workOrderCompletion.base + envConfig.workOrderCompletion.endpoint;
        const contentType = {
            "Content-Type": envConfig.workOrderCompletion.contentType,
        };


        const headers = await this.generateTAP360Headers();
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
}