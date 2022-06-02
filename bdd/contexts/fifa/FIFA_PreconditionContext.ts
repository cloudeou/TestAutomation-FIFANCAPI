import {Identificators} from "../Identificators";
import {data} from "../../../bdd-src/fifa/test-data/data";


export default class FIFA_PreconditionContext {
  public identificator = Identificators.FIFA_preConditionContext;
  private _streetNumberId!: bigint;
  private _addressType: string = '';
  private _addressId: string = '';
  private _technologyType: string = '';
  private _deviceType: string = '';
  private _scenarioType: string = '';
  private _oltName: string = '';
  private _distributionChannel: string = '';
  private _distributionChannelExternalId: string = '';
  private _customerCategory: string = '';
  private _market: string = '';
  private _odb: any;
  private _dpu: any;
  private _externalCustomerId: any;
  private _customerObjectId: string | null = null;
  private _customerEmail: string = '';
  private _errors: string[] = [];
  private _bootstrapData: Object = {};
  private _emailId: string = '';


  public set streetNumberId(value: bigint) {
    this._streetNumberId = value;
  }

  public set addressType(value: string) {
    this._addressType = value;
  }

  public set addressId(value: string) {
    this._addressId = value;
  }

  public get addressId() {
    return this._addressId;
  }

  public set technologyType(value: string) {
    this._technologyType = value;
  }

  public set deviceType(value: string) {
    this._deviceType = value;
  }

  public set scenarioType(value: string) {
    this._scenarioType = value;
  }

  public set oltName(value: string) {
    this._oltName = value;
  }

  public set distributionChannel(value: string) {
    value = value.toUpperCase();
    this._distributionChannel = data.distributionChannel[value as keyof typeof data.distributionChannel] ?? value;
  }

  public get distributionChannel() {
    if (this._distributionChannel == null) {
      this._distributionChannel = data.distributionChannel.CSR;
    }
    return this._distributionChannel;
  }

  public set distributionChannelExternalId(value: string) {
    this._distributionChannelExternalId = value;
  }

  public get distributionChannelExternalId() {
    return this._distributionChannelExternalId;
  }

  public set customerCategory(value: string) {
    value = value.toUpperCase();
    switch (value) {
      case 'RESIDENTIAL':
        this._customerCategory = data.customerCategory.CONSUMER;
        break;
      case 'CUSTOMER':
        this._customerCategory = data.customerCategory.CONSUMER;
        break;
      case 'COMMERCIAL':
        this._customerCategory = data.customerCategory.BUSINESS;
        break;
      case 'BUSINESS':
        this._customerCategory = data.customerCategory.BUSINESS;
        break;
      default:
        throw new Error(
          'Choose customer category either as RESIDENTIAL or COMMERCIAL',
        );
        break;
    }
  }

  public get customerCategory() {
    if (this._customerCategory == null) {
      this._customerCategory = data.customerCategory.CONSUMER;
    }
    return this._customerCategory;
  }

  public set market(value: string) {
    this._market = value;
  }

  public set odb(value: string) {
    this._odb = value;
  }

  public set dpu(value: string) {
    this._dpu = value;
  }

  public set externalCustomerId(value: number | null) {
    this._externalCustomerId = value;
  }

  public get externalCustomerId() {
    return this._externalCustomerId;
  }

  public set customerObjectId(value: string | null) {
    this._customerObjectId = value;
  }

  public get customerObjectId() {
    return this._customerObjectId;
  }

  public get customerEmail() {
    return this._customerEmail;
  }

  public set customerEmail(value: string) {
    this._customerEmail = value;
  }

  public set errors(error: string) {
    this._errors.push(error);
  }

  public get emailId() {
    return this._emailId;
  }

  public set emailId(value: string) {
    this._emailId = value;
  }

  public getBootstrapData(key: string) {
    const value = (this._bootstrapData as any)[key];

    if (value !== undefined) {
      return value;
    } else {
      throw Error(`No value found in getBootstrapData method by key ${key}`);
    }
  }

}
