import { OauthToken } from "../oauth-token";
import { envConfig } from "../../env-config";
import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axios-instance";
import {generateKongHeaders} from "../IkongApi"



export class ProductInventoryApi {
    private _oauthToken: any;

    constructor() {
        this._oauthToken = new OauthToken(
            envConfig.productInventory.clientId,
            envConfig.productInventory.clientSecret
        );
    }

    public async requestProductInventory(uri?: any, body?: any, queryParams?: any): Promise<AxiosResponse> {
        
        try {
            body = body || null;
            queryParams = queryParams || null;
            const token = await this._oauthToken.getToken(envConfig.productInventory.scope);
            console.log("token", token);
            const headers =  await generateKongHeaders(token);
            const response = await axiosInstance({
                method: "GET",
                url: queryParams == null ? envConfig.productInventory.baseUrl + uri : envConfig.productInventory.baseUrl + uri + queryParams,
                headers,
            });
            console.log(JSON.stringify(response));
            return response;
        } catch (error) {
            console.log(`Error while send  Product Inventory request: ${error}`);
            throw error;
        }
    }
    
    
}