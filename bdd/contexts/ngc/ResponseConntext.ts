import { Identificators } from "../Identificators";
import { APIs } from "../../steps/apis.enum";

export default class ResponseContext {
    public identificator = Identificators.ResponseContext;
    private _PCresponse: any;
    private _PCresponseBody: any;
    private _PCstatusCode: number = NaN;
    private createCustomerResponse: { [key: string]: any } = {};

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

    public setResponse(apiName: APIs, response: any) {
        switch (apiName) {
            case APIs.pc: {
                this._PCresponse = response;
                this._PCresponseBody = response.data;
                this._PCstatusCode = response.status;
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
    public getCreateCustomerResponse() {
        return this.createCustomerResponse;
      }
    public setCreateCustomerResponse(value: object) {
        this.createCustomerResponse = value;
      }
}
