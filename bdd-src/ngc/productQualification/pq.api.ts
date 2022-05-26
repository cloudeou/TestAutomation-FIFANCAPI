import {PayloadGenerator} from "./pq.payload-generator";
import {envConfig} from "../../env-config";
import {OauthToken} from "../oauth-token";
import {axiosInstance} from "../../axios-instance";
import {AxiosResponse} from "axios";
import {bodySamples} from "../serviceQualification/sq.body-samples";
import {generateKongHeaders} from "../IkongApi"


type PQparams = {
    customerCategory: string | null,
    distributionChannel: string | null,
    externalLocationId: string | number | null,
    categoryList: Array<string> | null,
    productOfferingId?: string | null,
    charList?: any | null,
    commitmentId?: string | null,
    shoppingCartId?: string | null,
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
        console.log('body for PQ',JSON.stringify(body));
        const token = await this._oauthToken.getToken(envConfig.productQualification.scope);
        console.log("return token")
        try {
            const headers = await generateKongHeaders(token);
            const response: any = await axiosInstance({
                method: "POST",
                url: envConfig.ikongUrl + envConfig.productQualification.baseUrl,
                data: body,
                headers,
            });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

