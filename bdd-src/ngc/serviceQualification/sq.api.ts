import {axiosInstance} from "../../axios-instance";
import {envConfig} from "../../env-config";
import {bodySamples} from "./sq.body-samples";
import {OauthToken} from "../oauth-token";
import {generateKongHeaders} from "../IkongApi"

export class ServiceQualificationApi {
    private _oauthToken: any;
    constructor() {
        this._oauthToken = new OauthToken(
            envConfig.serviceQualification.clientId,
            envConfig.serviceQualification.clientSecret
        );
    }

    public async requestServiceQualification(externalLocationId: string) {
        try {
            const token = await this._oauthToken.getToken(envConfig.serviceQualification.scope);
            const headers = await generateKongHeaders(token);
            const response = await axiosInstance({
                method: 'POST',
                url: envConfig.ikongUrl + envConfig.serviceQualification.baseUrl,
                headers,
                data: bodySamples.getServiceQualification(externalLocationId),
            })
            return response;
        }
        catch (error){
            console.log(`Error while send requestServiceQualification: ${error}`);
            throw error;
        }
    }


}