import { Identificators } from "../Identificators";
import { APIs } from "../../steps/apis.enum";

export default class ResponseContext {
    public identificator = Identificators.ResponseContext;
    private _PCresponse: any;
    private _PCresponseBody: any;
    private _PCstatusCode: number = NaN;

    private _SCresponse: any;
    private _SCresponseBody: any;
    private _SCstatusCode: number = NaN;

    private _PQresponse: any;
    private _PQresponseBody: any;
    private _PQstatusCode: number = NaN;

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

    public get PQresponse(): any {
        return this._PCresponse;
    }

    public set PQresponse(response: any) {
        this._PCresponse = response;
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

    public get SCresponse(): any {
        return this._SCresponse;
    }

    public set SCresponse(response: any) {
        this._SCresponse = response;
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
                break;
            case APIs.pq: {
                this._PQresponse = response;
                this._PQresponseBody = response.data;
                this._PQstatusCode = response.status;
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
}
