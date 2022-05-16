import {envConfig} from "../env-config";
import {StringUtils} from "../utils/common/StringUtils";
import {axiosInstance} from "../axios-instance";

export class TelusApiUtils {


    async processHoldOrderTask(taskObjectId) {
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
                method: "PUT",
                url: api,
                headers,
            });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    private async generateTAP360Headers(): any {
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
}