import {axiosInstance} from "../../axios-instance";
import {envConfig} from "../../env-config";
import {bodySamples} from "./sq.body-samples";
import {KongHeaders} from "../IkongApi";
import {OauthToken} from "../oauth-token";

export class ServiceQualificationApi {
    private _oauthToken: any;
    constructor() {
        this._oauthToken = new OauthToken(
            envConfig.serviceQualification.clientId,
            envConfig.serviceQualification.clientSecret
        );
    }

    private async generateKongHeaders(): Promise<KongHeaders> {
        const token = await this._oauthToken.getToken(envConfig.serviceQualification.scope);
        return {
            Authorization: `Bearer ${token}`,
            env: envConfig.envName,
        };
    }
    public async requestServiceQualification(externalLocationId: string) {
        try {
            const headers = await this.generateKongHeaders();
            const response = await axiosInstance({
                method: 'POST',
                url: envConfig.serviceQualification.baseUrl,
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