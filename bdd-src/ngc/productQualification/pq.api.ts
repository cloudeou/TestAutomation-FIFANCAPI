import {PayloadGenerator} from "./pq.payload-generator";
import {KongHeaders} from "../IkongApi";
import {envConfig} from "../../env-config";
import {OauthToken} from "../oauth-token";
import {axiosInstance} from "../../axios-instance";
import {AxiosResponse} from "axios";
import {bodySamples} from "../serviceQualification/sq.body-samples";

type PQparams = {
    customerCategory: any | null,
    distributionChannel: any | null,
    externalLocationId: any | null,
    categoryList: any | null,
    productOfferingId?: any | null,
    charList?: any | null,
    commitmentId?: any | null,
    shoppingCartId?: any | null,
};

export class ProductQualificationApi {
    private _body: { [key: string]: any } = {};
    private _oauthToken: any;
    private _SCid: string = "";

    constructor() {
        this._oauthToken = new OauthToken(
            envConfig.productQualification.clientId,
            envConfig.productQualification.clientSecret
        );
    }
    public get body(): { [key: string]: any } {
        return this._body;
    }

    private generateBody (
        pqParams: PQparams
    ): { [key: string]: any } {
        const body = new PayloadGenerator(
            pqParams.customerCategory,
            pqParams.distributionChannel,
            pqParams.externalLocationId,
            pqParams.categoryList,
            pqParams.productOfferingId,
            pqParams.charList,
            pqParams.commitmentId,
            pqParams.shoppingCartId
        );
        return body.generateBody();
    }


    public async productQualification(scParams: PQparams): Promise<AxiosResponse> {
        const body = this.generateBody(scParams);
        console.log(JSON.stringify(body));
        try {
            const headers = await this.generateKongHeaders();
            const response: any = await axiosInstance({
                method: "POST",
                url: envConfig.productQualification.baseUrl,
                data: body,
                headers,
            });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private async generateKongHeaders(): Promise<KongHeaders> {
        const token = await this._oauthToken.getToken(envConfig.productQualification.scope);
        console.log("return token")
        return {
            Authorization: `Bearer ${token}`,
            env: envConfig.envName
        };
    }

}

