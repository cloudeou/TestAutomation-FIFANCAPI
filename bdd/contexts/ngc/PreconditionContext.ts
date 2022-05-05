import { Identificators } from "../Identificators";
import { data } from "../../../test-data/test.data";


export default class PreconditionContext {
    public identificator = Identificators.preConditionContext;
    private streetNumberId!: bigint;
    private addressType: string = '';
    private bootstrapData: { [key: string]: any } = {};
    private addressId: string = '';
    private technologyType: string = '';
    private deviceType: string = '';
    private scenarioType: string = '';
    private oltName: string ='';
    private distributionChannel: string = '';
    private distributionChannelExternalId: string = '';
    private customerCategory: string = '';
    private market: string = '';
    private odb: any;
    private dpu: any;
    private allAddreses: undefined | string[] = undefined;
    private externalCustomerId: any;
    private customerObjectId: string | null = null;


    public setStreetNumberId(value: bigint) {
        this.streetNumberId = value;
      }
    public getStreetNumberId() {
        return this.streetNumberId;
      }
    public setAddressType(value: string) {
        this.addressType = value;
      }
    public getAddressType() {
        return this.addressType;
      }
    // public setBootstrapData() {
    //     try {
    //       const tempData: Object[] = JSON.parse(process.env.bootstrapParams!);
    //       this.bootstrapData = tempData.pop()!;
    //       process.env.bootstrapParams = JSON.stringify(tempData);
    //     } catch (error) {
    //       throw Error('No Bootstrap Data found in env!');
    //     }
    //   }
    // public getBootstrapData(key: string) {
    //     const value = this.bootstrapData[key];
    //     if (value !== undefined) {
    //       return value;
    //     } else {
    //       throw Error(`No value found in getBootstrapData method by key ${key}`);
    //     }
    //   }
    public setAddressId(value: string) {
        this.addressId = value;
      }
    public getAddressId() {
        return this.addressId;
      }
    public setTechnologyType(value: string) {
        this.technologyType = value;
      }
    public getTechnologyType() {
        return this.technologyType;
      }
    public setDeviceType(value: string) {
        this.deviceType = value;
      }
    public getDeviceType() {
        return this.deviceType;
      }
    public setScenarioType(value: string) {
        this.scenarioType = value;
      }
    public getScenarioType() {
        return this.scenarioType;
      }
    public setOltName(value: string) {
        this.oltName = value;
      }
    public getOltName() {
        return this.oltName;
      }
    public setDistributionChannel(value: string) {
        value = value.toUpperCase();
        this.distributionChannel = data.distributionChannel[value as keyof typeof data.distributionChannel] ?? value;
      }
    public getDistributionChannel() {
        if (this.distributionChannel == null) {
          this.distributionChannel = data.distributionChannel.CSR;
        }
        return this.distributionChannel;
      }
    public setDistributionChannelExternalId(value: string) {
        this.distributionChannelExternalId = value;
      }
    public getDistributionChannelExternalId() {
        return this.distributionChannelExternalId;
      }
    public setCustomerCategory(value: string) {
        value = value.toUpperCase();
        switch (value) {
          case 'RESIDENTIAL':
            this.customerCategory = data.customerCategory.CONSUMER;
            break;
          case 'CUSTOMER':
            this.customerCategory = data.customerCategory.CONSUMER;
            break;
          case 'COMMERCIAL':
            this.customerCategory = data.customerCategory.BUSINESS;
            break;
          case 'BUSINESS':
            this.customerCategory = data.customerCategory.BUSINESS;
            break;
          default:
            throw new Error(
              'Choose customer category either as RESIDENTIAL or COMMERCIAL',
            );
            break;
        }
      }
    public getCustomerCategory() {
        if (this.customerCategory == null) {
          this.customerCategory = data.customerCategory.CONSUMER;
        }
        return this.customerCategory;
      }
    public setMarket(value: string) {
        this.market = value;
      }
    public getMarket() {
        return this.market;
      }
    public setOdb(value: string) {
        this.odb = value;
      }
    public getOdb() {
        return this.odb;
      }
    public setDpu(value: string) {
        this.dpu = value;
      }
    public getDpu() {
        return this.dpu;
      }    
    public getAddressFromEnvPreset() {
        if (!this.allAddreses) {
          try {
            const tempAddresses: string[][] = JSON.parse(process.env.addresses!);
            this.allAddreses = tempAddresses.pop();
            process.env.addresses = JSON.stringify(tempAddresses);
          } catch (error) {
            this.allAddreses = [];
          }
        }
        return this.allAddreses?.shift();
      }
    public setExternalCustomerId(value: number | null) {
        this.externalCustomerId = value;
      }
    public getExternalCustomerId() {
        return this.externalCustomerId;
      }
    public setCustomerObjectId(value: string | null) {
        this.customerObjectId = value;
      }
    public getCustomerObjectId() {
        return this.customerObjectId;
      }
}