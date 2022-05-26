import { Identificators } from "../Identificators";

export default class ResponseContext {
    public identificator = Identificators.ResponseContext;

    private _PCresponse: any;

    private _shoppingCartResponseBody: any | null = null;
    private _shoppingCartResponseText: string | null = null;
    private _SCstatusCode: number = NaN;

    private _createCustomerResponse: { [key: string]: any } = {};

    private _PQresponse: any;

    private _productInventoryResponse: any;

    public get PCresponse(): any {
        return this._PCresponse;
    }

    public set PCresponse(response: any) {
        this._PCresponse = response;
    }

    public get PQresponse(): any {
        return this._PQresponse;
    }

    public set PQresponse(response: any) {
        this._PQresponse = response;
    }

    public set SCstatusCode(code: number) {
        this._SCstatusCode = code;
    }

    public get shoppingCartResponse() {
        return this._shoppingCartResponseBody;
    }

    public set shoppingCartResponse(value: any | null) {
        this._shoppingCartResponseBody = value;
    }

    public get shoppingCartResponseText() {
        return this._shoppingCartResponseText;
    }

    public set shopppingCartResonseText(value: string | null) {
        this._shoppingCartResponseText = value;
    }

    public get createCustomerResponse() {
        return this._createCustomerResponse;
    }

    public set createCustomerResponse(value: object) {
        this._createCustomerResponse = value;
    }

    public get productInventoryResponse() {
        return this._productInventoryResponse;
    }
    public set productInventoryResponse(value: object) {
        this._productInventoryResponse = value;
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
