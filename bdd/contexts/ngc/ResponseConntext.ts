import { Identificators } from "../Identificators";
import { APIs } from "../../steps/apis.enum";

export default class ResponseContext {
    public identificator = Identificators.ResponseContext;
    private _PCresponse: any;
    private _PCresponseBody: any;
    private _PCstatusCode: number = NaN;
    private _shoppingCartResponse: JSON | null = null;
    private _shopppingCartResonseText: string | null = null;
    private _SCstatusCode: number = NaN;
    private _SCresponse: any;
    private _SCresponseBody: any;

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

    public setResponse(apiName: string, response: any) {
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
            }
        }
    }

    public getResponse(apiName: APIs) {
        switch (apiName) {
            case APIs.pc:
                return {
                    response: this._PCresponse,
                    responseBody: this._PCresponseBody,
                    status: this._PCstatusCode,
                };
        }
    }

    public getShoppingCartResponse() {
        return this._shoppingCartResponse;
    }

    public setShoppingCartResponse(value: JSON | null) {
        this._shoppingCartResponse = value;
    }

    public getshoppingCartResponseText() {
        return this._shopppingCartResonseText;
    }

    public setshopppingCartResonseText(value: string | null) {
        this._shopppingCartResonseText = value;
    }

    public get SCstatusCode(): number {
        return this._SCstatusCode!;
    }

    public set SCstatusCode(statusCode: number) {
        this._SCstatusCode = statusCode;
    }

    public get SCresponse(): any {
        return this._SCresponse;
    }

    public set SCresponse(response: any) {
        this._SCresponse = response;
    }

    public get SCresponseBody(): any {
        return this._SCresponseBody;
    }

    public set SCresponseBody(responseBody: any) {
        this._SCresponseBody = responseBody;
    }
}
