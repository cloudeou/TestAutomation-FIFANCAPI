import { envConfig } from "../../env-config";
import { OauthToken } from "../oauth-token";
import { IkongApi, KongHeaders } from "../IkongApi"
import { axiosInstance } from "../../axios-instance";
import { AxiosResponse } from "axios";
import {payloadGenerator} from "./pc.payload-generator";

export class ProductCatalogApi {
    private _oauthToken: any;

    private generateParams(offers: Array<String>): string {
            const params = new payloadGenerator(offers);
            return params.generateQueryParams();
    }

    public async requestProductCatalog(offers: Array<String>): Promise<AxiosResponse> {
        const params = this.generateParams(offers);
        console.log(JSON.stringify(`Params: ${params}`));
        try {
            const headers = await this.generateKongHeaders();
            const response = await axiosInstance({
                method: "GET",
                url: envConfig.productCatalog.baseUrl+params,
                headers,
            });
            console.log(JSON.stringify(response));
            return response;
        } catch (error) {
            console.log(`Error while send requestProductCatalog: ${error}`);
            throw error;
        }
    }
    private async generateKongHeaders(): Promise<KongHeaders> {
        const token = await this._oauthToken.getToken(envConfig.productCatalog.scope);
        console.log("token", token);
        return {
            Authorization: `Bearer ${token}`,
            env: envConfig.envName,
        };
    }
}