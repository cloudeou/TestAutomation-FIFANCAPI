import { Identificators } from "./Identificators";

export default class CustomerContext {
  public identificator = Identificators.CustomerContext;
  private _ecid: number = NaN;
  private _lpdsid: number = NaN;
  private _address_id: string = "";
  private _is_gr: boolean = false;
  private _servicesCost: number = 0;
  private _id: string = "";
  private _object_id: string = "";

  public get ecid(): number {
    return this._ecid;
  }
  public set ecid(ecid: number) {
    this._ecid = ecid;
  }
  public get lpdsid(): number {
    return this._lpdsid;
  }
  public set lpdsid(lpdsid: number) {
    this._lpdsid = lpdsid;
  }
  public get address_id(): string {
    return this._address_id;
  }
  public set address_id(id: string) {
    this._address_id = id;
  }
  public get is_gr(): boolean {
    return this._is_gr;
  }
  public set is_gr(id: boolean) {
    this._is_gr = id;
  }
  public get servicesCost(): number {
    return this._servicesCost;
  }
  public set servicesCost(amt: number) {
    this._servicesCost = amt;
  }
  public get id(): string {
    return this._id;
  }
  public set id(id: string) {
    this._id = id;
  }
  public get objectId(): string {
    return this._object_id;
  }
  public set objectId(id: string) {
    this._object_id = id;
  }
}
