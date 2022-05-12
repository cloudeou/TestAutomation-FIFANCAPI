import {OauthToken} from "../oauth-token";
import {envConfig} from "../../env-config";
import {PayloadGenerator} from "../productQualification/pq.payload-generator";
import {AxiosResponse} from "axios";
import {axiosInstance} from "../../axios-instance";
import {KongHeaders} from "../IkongApi";
import {payloadGenerator} from "../promotion/promotion.payload-generator";



type PromotionParams = {
    customerCategory: any | null,
    distributionChannel: any | null,
    externalLocationId: any | null,
    response: any | null,
    promotionMap: any | null,
    shoppingCartId: any
};

export class PromotionApi {
    private _oauthToken: any;
    private _body: { [key: string]: any } = {};

    constructor() {
        this._oauthToken = new OauthToken(
            envConfig.serviceQualification.clientId,
            envConfig.serviceQualification.clientSecret
        );
    }
    public get body(): { [key: string]: any } {
        return this._body;
    }

    private generateParams(shoppingCartId: string): string {
        const params = new payloadGenerator(shoppingCartId);
        return params.applyPromotion();
    }

    private generateBody (
        pparams: PromotionParams
    ): { [key: string]: any } {
        const body = new PayloadGenerator(
            pparams.customerCategory,
            pparams.distributionChannel,
            pparams.externalLocationId,
            pparams.response,
            pparams.promotionMap,
        );
        return body.generateBody();
    }

    public async requestPromotion(pparams: PromotionParams): Promise<AxiosResponse> {
        const body = this.generateBody(pparams);
        const params = this.generateParams(pparams.shoppingCartId)
        console.log(JSON.stringify(body));
        try {
            const headers = await this.generateKongHeaders();
            const response: any = await axiosInstance({
                method: "PUT",
                url: envConfig.promotion.baseUrl + params,
                data: body,
                headers,
            });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async getMapFromPromotionTable(table: any) {
        const promotionMap = new Map<string, any[]>();
        table.forEach((row: any) => {
            const tempRow = promotionMap.get(row.Parent);
            const char = {
                discountId: row.DiscountId,
                reasonCd: row.ReasonCd,
            };
            if (tempRow) {
                promotionMap.set(row.Parent, [...tempRow, char]);
            } else {
                promotionMap.set(row.Parent, [char]);
            }
        });
        return promotionMap;
    }

    private async generateKongHeaders(): Promise<KongHeaders> {
        const token = await this._oauthToken.getToken(envConfig.promotion.scope);
        console.log("return token")
        return {
            Authorization: `Bearer ${token}`,
            env: envConfig.envName
        };
    }
}