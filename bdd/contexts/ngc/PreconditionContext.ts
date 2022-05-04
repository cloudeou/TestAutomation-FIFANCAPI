import { Identificators } from '../Identificators';
import { btapi } from '../../../src/bt-api/btapi';


export class PreconditionContext {
  public identificator = Identificators.preConditionContext;
  private _addressType: string = '';
  private _technologyType: string = '';
  private _distributionChannel: string = '';
  private _distributionChannelExternalId: string = '';
  private _customerCategory: string = '';
  private _allAddreses: undefined | string[] = undefined;
  private _addressId: string = '';
  private _externalCustomerId: any;
  private _customerObjectId: string = '';
  private _streetNumberId: bigint = BigInt(1);
  private _oltName: string = '';
  private _deviceType: string = '';
  private _scenarioType: string = '';
  private _errors = [];
  private _market: string = '';
  private _odb: any;
  private _dpu: any;
  private _bootstrapData: Object = {};
  private _customerEmail: string = '';
  private _emailId: string = '';

  public getCustomerEmail() {
    return this._customerEmail;
  }

  public setCustomerEmail(value: string) {
    this._customerEmail = value;
  }

  public getEmailId() {
    return this._emailId;
  }

  public setEmailId(value: string) {
    this._emailId = value;
  }

  public getMarket() {
    return this._market;
  }

  public setMarket(value: string) {
    this._market = value;
  }

  public getErrors() {
    return this._errors;
  }
  public setErrors(error: string) {
    this._errors.push(error);
  }

  public getStreetNumberId() {
    return this._streetNumberId;
  }

  public getOltName() {
    return this._oltName;
  }

  public setStreetNumberId(value: bigint) {
    this._streetNumberId = value;
  }
  public setOltName(value: string) {
    this._oltName = value;
  }
  // public setAllAddressesFromEnv() {
  //   try {
  //     const tempAddresses: string[] = JSON.parse(process.env.addresses);
  //     this._allAddreses = tempAddresses;
  //   } catch (error) {
  //     this._allAddreses = [];
  //   }
  // }

  public getAddressFromEnvPreset() {
    if (!this._allAddreses) {
      try {
        const tempAddresses: string[][] = JSON.parse(process.env.addresses!);
        this._allAddreses = tempAddresses.pop();
        process.env.addresses = JSON.stringify(tempAddresses);
      } catch (error) {
        this._allAddreses = [];
      }
    }
    return this._allAddreses?.shift();
  }

  public setBootstrapData() {
    try {
      const tempData: Object[] = JSON.parse(process.env.bootstrapParams!);
      this._bootstrapData = tempData.pop()!;
      process.env.bootstrapParams = JSON.stringify(tempData);
    } catch (error) {
      throw Error('No Bootstrap Data found in env!');
    }
  }
  public getBootstrapData(key: string) {
    const value = this._bootstrapData?[key];
    if (value !== undefined) {
      return value;
    } else {
      throw Error(`No value found in getBootstrapData method by key ${key}`);
    }
  }
  public getAddressType() {
    return this._addressType;
  }
  public setAddressType(value: string) {
    this._addressType = value;
  }

  public getTechnologyType() {
    return this._technologyType;
  }
  public setTechnologyType(value: string) {
    this._technologyType = value;
  }

  public getDistributionChannel() {
    if (this._distributionChannel == null) {
      this._distributionChannel = btapi.data._distributionChannel.CSR;
    }
    return this._distributionChannel;
  }
  public setDistributionChannel(value: string) {
    value = value.toUpperCase();
    this._distributionChannel = btapi.data._distributionChannel[value] ?? value;
  }

  public getDistributionChannelExternalId() {
    return this._distributionChannelExternalId;
  }

  public setDistributionChannelExternalId(value: string) {
    this._distributionChannelExternalId = value;
  }

  public setDeviceType(value: string) {
    this._deviceType = value;
  }

  public setScenarioType(value: string) {
    this._scenarioType = value;
  }

  public getDeviceType() {
    return this._deviceType;
  }

  public setOdb(value: any) {
    this._odb = value;
  }

  public getOdb() {
    return this._odb;
  }

  public setDpu(value: any) {
    this._dpu = value;
  }

  public getDpu() {
    return this._dpu;
  }

  public getScenarioType() {
    return this._scenarioType;
  }

  public getCustomerCategory() {
    if (this._customerCategory == null) {
      this._customerCategory = btapi.data._customerCategory.CONSUMER;
    }
    return this._customerCategory;
  }
  public setCustomerCategory(value: string) {
    value = value.toUpperCase();
    switch (value) {
      case 'RESIDENTIAL':
        this._customerCategory = btapi.data._customerCategory.CONSUMER;
        break;
      case 'CUSTOMER':
        this._customerCategory = btapi.data._customerCategory.CONSUMER;
        break;
      case 'COMMERCIAL':
        this._customerCategory = btapi.data._customerCategory.BUSINESS;
        break;
      case 'BUSINESS':
        this._customerCategory = btapi.data._customerCategory.BUSINESS;
        break;
      default:
        throw new Error(
          'Choose customer category either as RESIDENTIAL or COMMERCIAL',
        );
        break;
    }
  }

  public getAddressId() {
    return this._addressId;
  }
  public setAddressId(value: string) {
    this._addressId = value;
  }

  public getExternalCustomerId() {
    return this._externalCustomerId;
  }
  public setExternalCustomerId(value: number) {
    this._externalCustomerId = value;
  }

  public getCustomerObjectId() {
    return this._customerObjectId;
  }
  public setCustomerObjectId(value: string) {
    this._customerObjectId = value;
  }
}
