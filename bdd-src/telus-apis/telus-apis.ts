import {envConfig} from "../env-config";
import {StringUtils} from "../utils/common/StringUtils";
import {axiosInstance} from "../axios-instance";

export class TelusApiUtils {


    async processHoldOrderTask(taskObjectId: any) {
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
                headers,
            });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    private async generateTAP360Headers() {
        return {
            accept: "application/json",
            env: envConfig.envName
        };
    }
}