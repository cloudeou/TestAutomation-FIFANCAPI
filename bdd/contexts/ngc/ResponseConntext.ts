import { Identificators } from "../Identificators";
import { APIs } from "../../steps/apis.enum";
import {replacerFunc} from "../../../bdd-src/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";

export default class ResponseContext {
    public identificator = Identificators.ResponseContext;
    private _PCresponse: any;
    private _PCresponseBody: any;
    private _PCstatusCode: number = NaN;

    private _shoppingCartResponseBody: any | null = null;
    private _shoppingCartResponseText: string | null = null;
    private _SCstatusCode: number = NaN;

    private createCustomerResponse: { [key: string]: any } = {};

    private _PQresponseBody: any;
    private _PQstatusCode: number = NaN;
    private _PQresponseText: string| null = null;

    public get PCresponse(): any {
        return this._PCresponse;
    }

    public set PCresponse(response: any) {
        this._PCresponse = response;
    }

    public get PCresponseBody(): any {
        return this._PCresponseBody;
    }

    public set PCresponseBody(responseBody: any) {
        this._PCresponseBody = responseBody;
    }

    public get PCstatusCode(): number {
        return this._PCstatusCode;
    }

    public get productQualifcationResponse(): any {
        return this._PQresponseBody;
    }

    public set productQualifcationResponse(response: any) {
        this._PQresponseBody = response;
    }

    public get PQresponseBody(): any {
        return this._PCresponseBody;
    }

    public set PQresponseBody(responseBody: any) {
        this._PCresponseBody = responseBody;
    }

    public get PQstatusCode(): number {
        return this._PCstatusCode;
    }

    public get SCstatusCode(): number {
        return this._SCstatusCode;
    }
    public set SCstatusCode(code: number) {
        this._SCstatusCode = code;
    }

    public getShoppingCartResponse() {
        return this._shoppingCartResponseBody;
    }

    public setShoppingCartResponse(value: JSON | null) {
        this._shoppingCartResponseBody = value;
    }

    public getshoppingCartResponseText() {
        return this._shoppingCartResponseText;
    }

    public setshopppingCartResonseText(value: string | null) {
        this._shoppingCartResponseText = value;
    }

    public getCreateCustomerResponse() {
        return this.createCustomerResponse;
    }

    public setCreateCustomerResponse(value: object) {
        this.createCustomerResponse = value;
    }

    /*public setResponse(apiName: string, response: any) {
       switch (apiName) {
           case APIs.pc: {
               this._PCresponse = response;
               this._PCresponseBody = response.data;
               this._PCstatusCode = response.status;
           }
           break;
           case APIs.sc: {
               this._SCresponse = response;
               this._SCresponseBody = response.data;
               this._SCstatusCode = response.status;
               this._SCresponseText = JSON.stringify(response, replacerFunc(), '\t');
           }
               break;
           case APIs.pq: {
               this._PQresponse = response;
               this._PQresponseBody = response.data;
               this._PQstatusCode = response.status;
               this._PQresponseText = JSON.stringify(response,replacerFunc, '\t')
           }
       }
   }*/

    /*public getResponse(apiName: APIs) {
        switch (apiName) {

            case APIs.pc:
                return {
                    response: this._PCresponse,
                    responseBody: this._PCresponseBody,
                    status: this._PCstatusCode,
                };
            case APIs.sc:
                return {
                    response: this._SCresponse,
                    responseBody: this._SCresponseBody,
                    status: this._SCstatusCode,
                    responseText: this._SCresponseText
                };
            case APIs.pq:
                return {
                    response: this._PQresponse,
                    responseBody: this._PQresponseBody,
                    status: this._PQstatusCode,
                    responseText: this._PQresponseText
                };
        }
    }*/
}
