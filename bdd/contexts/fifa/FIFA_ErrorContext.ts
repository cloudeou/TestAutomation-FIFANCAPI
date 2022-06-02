import { Identificators } from "../Identificators";

export default class FIFA_ErrorContext {
  public identificator = Identificators.FIFA_ErrorContext;
  private _error: any = "";
  private _status: string = "";

  public get error(): any {
    return this._error;
  }

  public set error(error: any) {
    this._error = error;
  }

  public get status(): string {
    return this._status;
  }

  public set status(status: string) {
    this._status = status;
  }
}
