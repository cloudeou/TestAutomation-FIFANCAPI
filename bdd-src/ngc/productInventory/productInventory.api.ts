import { OauthToken } from "../oauth-token";
import { envConfig } from "../../env-config";
import { IkongApi, KongHeaders } from "../IkongApi"
import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axios-instance";



export class ProductInventoryApi {
    private _oauthToken: any;

    constructor() {
        this._oauthToken = new OauthToken(
            envConfig.productInventory.clientId,
            envConfig.productInventory.clientSecret
        );
    }


    private async generateKongHeaders(): Promise<KongHeaders> {
        const token = await this._oauthToken.getToken(envConfig.productInventory.scope);
        console.log("token", token);
        return {
            Authorization: `Bearer ${token}`,
            env: envConfig.envName,
        };
    }
    public async requestProductInventory(uri?: any, body?: any, queryParams?: any): Promise<AxiosResponse> {
        
        try {
            const headers = await this.generateKongHeaders();
            const response = await axiosInstance({
                method: "GET",
                url: queryParams == null ? envConfig.productInventory.baseUrl + uri : envConfig.productInventory.baseUrl + uri + queryParams,
                headers,
            });
            console.log(JSON.stringify(response));
            return response;
        } catch (error) {
            console.log(`Error while send requestProductInventory: ${error}`);
            throw error;
        }
    }
    
    
}