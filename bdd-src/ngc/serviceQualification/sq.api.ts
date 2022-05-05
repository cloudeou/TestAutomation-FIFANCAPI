import {axiosInstance} from "../../axios-instance";
import {envConfig} from "../../env-config";
import {bodySamples} from "./sq.body-samples";

export class ServiceQualificationApi {

    private async generateHeader(headers?: any) {
        return {
                'Content-Type': 'application/json',
                ...headers,
        }
    }
    public async requestServiceQualification(externalLocationId: string) {
        try {
            const headers = await this.generateHeader();
            const response = await axiosInstance({
                method: 'POST',
                url: envConfig.serviceQualification.baseUrl,
                headers,
                data: bodySamples.getServiceQualification(externalLocationId),
            })
            console.log(JSON.stringify(response));
            return response;
        }
        catch (error){
            console.log(`Error while send requestServiceQualification: ${error}`);
            throw error;
        }
    }
}