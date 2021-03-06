import { envConfig } from "../env-config";
import { OauthToken } from "../oauth-token";
import { axiosInstance } from "../axios-instance";
import { AxiosResponse } from "axios";
import {payloadGenerator} from "./pc.payload-generator";
import {generateKongHeaders} from "../IkongApi"

export class ProductCatalogApi {
    private _oauthToken: any;

    constructor() {
        this._oauthToken = new OauthToken(
            envConfig.productCatalog.clientId,
            envConfig.productCatalog.clientSecret
        );
    }
   
    
    private generateParams(offers: Array<String>): string {
            const params = new payloadGenerator(offers);
            return params.generateQueryParams();
    }

    public async requestProductCatalog(offers: Array<String>): Promise<AxiosResponse> {
        const params = this.generateParams(offers);

        const token = await this._oauthToken.getToken(envConfig.productCatalog.scope);

        try {
            const headers = await generateKongHeaders(token);
            const response = await axiosInstance({
                method: "GET",
                url: envConfig.ikongUrl + envConfig.productCatalog.baseUrl + params,
                headers,
            });

            return response;
        } catch (error) {
            console.log(`Error while send requestProductCatalog: ${error}`);
            throw error;
        }
    }
    

}