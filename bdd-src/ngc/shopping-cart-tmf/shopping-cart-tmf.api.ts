import { envConfig } from "../../env-config";
import { OauthToken } from "../oauth-token";
import { IkongApi, KongHeaders } from "../IkongApi";
import { axiosInstance } from "../../axios-instance";
import { AxiosResponse } from "axios";
import ncConstants from "../../utils/nc-constants";
import { bodyParser } from "./shopping-cart-tmf.body-parser";
import { BodySamples } from "./shopping-cart-tmf.body-samples";
import { BodyGenerator } from "./shopping-cart-tmf.body-generator";

export enum SCActions {
  create = "Create",
  update = "Update",
  delete = "Delete",
  get = "Get",
  validate = "Validate",
  submit = "Submit",
}

export type SCParams = {
  ecid?: number;
  lpdsid?: number;
  customerCategory: string;
  distributionChannel: string;
  prevResponse?: any;
  offersToAdd?: Map<string, string>;
  childOfferMap?: Map<Map<string, string[]>, string>;
  charMap?: Map<string, Array<{}>>;
  promotionMap?: Map<Map<string, any[]>, string>;
};

export class ShoppingCartApi {
  private _oauthToken: any;
  private _body: { [key: string]: any } = {};
  private _SCid: string = "";

  public get SCid(): string {
    return this._SCid;
  }

  public get body(): { [key: string]: any } {
    return this._body;
  }

  constructor(scId: string = "") {
    this._SCid = scId;
    this._oauthToken = new OauthToken(
      envConfig.shoppingCart.clientId,
      envConfig.shoppingCart.clientSecret
    );
  }

  private generateBody(
    action: string,
    scParams: SCParams
  ): { [key: string]: any } {
    const isDistChanExtId = !Object.values(
      ncConstants.distributionChannel
    ).includes(scParams.distributionChannel);
    if (action == SCActions.submit || action == SCActions.validate) {
      return BodySamples.validateOrSubmitBody(
        scParams.customerCategory,
        scParams.distributionChannel
      );
    } else {
      const body = new BodyGenerator(
        <number>scParams.ecid,
        <number>scParams.lpdsid,
        <SCActions>action,
        scParams.customerCategory,
        scParams.distributionChannel,
        scParams.prevResponse,
        scParams.offersToAdd,
        scParams.childOfferMap,
        scParams.charMap
      );
      return body.generateBody();
    }
  }

  public async createShoppingCart(scParams: SCParams): Promise<AxiosResponse> {
    const body = this.generateBody(SCActions.create, scParams);
    console.log(`${SCActions.create} shopping cart`);
    console.log(JSON.stringify(body));
    try {
      const headers = await this.generateKongHeaders();
      const response = await axiosInstance({
        method: "POST",
        url: envConfig.shoppingCart.baseUrl,
        data: body,
        headers,
      });
      this._SCid = response.data.id;
      return response;
    } catch (error) {
      console.log(`Error while ${SCActions.create} of SC: ${error}`);
      throw error;
    }
  }

  public async updateShoppingCart(scParams: SCParams): Promise<AxiosResponse> {
    const body = this.generateBody(SCActions.update, scParams);
    console.dir(scParams.charMap);
    console.log(`${SCActions.update} shopping cart`);
    console.log(JSON.stringify(body));
    try {
      const headers = await this.generateKongHeaders();
      const response = await axiosInstance({
        method: "PUT",
        url: `${envConfig.shoppingCart.baseUrl}/${this._SCid}`,
        data: body,
        headers,
      });
      return response;
    } catch (error: any) {
      console.log(`Error while ${SCActions.create} of SC: ${error}`);
      throw error;
    }
  }

  public async getShoppingCart(): Promise<AxiosResponse> {
    console.log(`${SCActions.get} shopping cart`);
    try {
      const headers = await this.generateKongHeaders();
      const response = await axiosInstance({
        method: "GET",
        url: `${envConfig.shoppingCart.baseUrl}/${this._SCid}`,
        headers,
      });
      return response;
    } catch (error: any) {
      console.log(`Error while ${SCActions.get} of SC: ${error}`);
      throw error;
    }
  }

  public async deleteShoppingCart(): Promise<AxiosResponse> {
    console.log(`${SCActions.delete} shopping cart`);
    try {
      const headers = await this.generateKongHeaders();
      const response = await axiosInstance({
        method: "DELETE",
        url: `${envConfig.shoppingCart.baseUrl}/${this._SCid}`,
        headers,
      });
      return response;
    } catch (error: any) {
      console.log(`Error while ${SCActions.delete} of SC: ${error}`);
      throw error;
    }
  }

  public async validateShoppingCart(
    scParams: SCParams
  ): Promise<AxiosResponse> {
    const body = this.generateBody(SCActions.validate, scParams);
    console.log(`${SCActions.validate} shopping cart`);
    console.log(body);
    try {
      const headers = await this.generateKongHeaders();
      const response = await axiosInstance({
        method: "POST",
        url: `${envConfig.shoppingCart.baseUrl}/${this._SCid}/validate`,
        data: body,
        headers,
      });
      return response;
    } catch (error: any) {
      console.log(`Error while ${SCActions.validate} of SC: ${error}`);
      throw error;
    }
  }

  public async submitShoppingCart(scParams: SCParams): Promise<AxiosResponse> {
    const body = this.generateBody(SCActions.submit, scParams);
    console.log(`${SCActions.submit} shopping cart`);
    console.log(body);
    try {
      const headers = await this.generateKongHeaders();
      const response = await axiosInstance({
        method: "POST",
        url: `${envConfig.shoppingCart.baseUrl}/${this._SCid}/checkout`,
        data: body,
        headers,
      });
      return response;
    } catch (error) {
      console.log(`Error while ${SCActions.submit} of SC: ${error}`);
      throw error;
    }
  }

  public createChildOffersMap(SCresponse: {
    [key: string]: any;
  }): Map<string, Map<string, string[]>> {
    let existingChildOffersMap = new Map();
    SCresponse.cartItem.forEach((tloItem: any) => {
      const tloId = tloItem.productOffering.id;
      existingChildOffersMap.set(tloId, new Map());
      const uniqueSloIds = tloItem.cartItem
        .map((sloItem: any) => sloItem.productOffering.id)
        .filter(
          (sloId: any, index: any, self: any) => self.indexOf(sloId) == index
        );
      uniqueSloIds.forEach((sloId: any) => {
        const sloIdCount = tloItem.cartItem.filter(
          (item: any) => item.productOffering.id == sloId
        ).length;
        existingChildOffersMap.get(tloId).set(sloId, sloIdCount);
      });
    });

    return existingChildOffersMap;
  }

  public validateOffersInResponse(
    offersMap: Map<string, string>,
    response: { [key: string]: any }
  ): Boolean {
    let offersPresent = [];
    let offersDeleted = [];
    for (let [key, value] of offersMap) {
      if (String(value) === "Add") offersPresent.push(String(key));
      else if (String(value) === "Delete") offersDeleted.push(String(key));
    }
    return (
      this.validateOffersPresent(offersPresent, response) &&
      this.validateOffersDeleted(offersDeleted, response)
    );
  }

  private validateOffersPresent(
    offers: string[],
    response: { [key: string]: any }
  ): Boolean {
    let flag = true;
    let errorMessage = "";
    if (offers !== null && offers !== undefined && offers.length > 0) {
      offers.forEach((offer) => {
        if (bodyParser.getItemIdByProductOffering(response, offer) === null) {
          flag = false;
          errorMessage = errorMessage + offer + " not present\n";
          console.log(errorMessage);
        }
      });
    }
    return flag;
  }

  private validateOffersDeleted(
    offers: string[],
    response: { [key: string]: any }
  ): Boolean {
    let flag = true;
    let n: any;
    let errorMessage = "";
    if (offers !== null && offers !== undefined && offers.length > 0) {
      offers.forEach((offer) => {
        if (bodyParser.getItemIdByProductOffering(response, offer) !== null) {
          n = bodyParser.getItemByProductOffering(response, offer);
          if (
            String(n.action).toLowerCase() !== "cancel" &&
            String(n.action).toLowerCase() !== "delete"
          ) {
            flag = false;
            errorMessage = errorMessage + offer + " present\n";
            console.log(errorMessage);
          }
        }
      });
    }
    return flag;
  }

  public validateChildOffersInResponse(
    offersMap: Map<Map<string, string[]>, string>,
    response: { [key: string]: any }
  ): Boolean {
    let childOffersPresent = <Map<string, string[]>>(<unknown>null);
    let childOffersDeleted = <Map<string, string[]>>(<unknown>null);
    for (let [key, value] of offersMap) {
      if (String(value) === "Add") childOffersPresent = key;
      else if (String(value) === "Delete") childOffersDeleted = key;
    }
    return (
      this.validateChildOffersPresent(childOffersPresent, response) &&
      this.validateChildOffersDeleted(childOffersDeleted, response)
    );
  }

  private validateChildOffersPresent(
    childOfferMap: Map<string, string[]>,
    response: { [key: string]: any }
  ): Boolean {
    let flag = true;
    let errorMessage = "";
    if (childOfferMap !== null && childOfferMap !== undefined) {
      // childOfferMapList.forEach(childOfferMap => {
      for (let offer of childOfferMap.keys()) {
        if (bodyParser.getItemIdByProductOffering(response, offer) === null) {
          flag = false;
          errorMessage = errorMessage + offer + " not present\n";
        }
        let childs = bodyParser.getChildsByProductOfferingFromCart(
          response,
          offer
        );

        for (let childOffer of <Array<string>>childOfferMap.get(offer)) {
          if (
            bodyParser.getItemIdByProductOffering(response, childOffer) === null
          ) {
            flag = false;
            errorMessage = errorMessage + childOffer + " not present\n";
          }
          if (!childs.includes(childOffer)) {
            flag = false;
            errorMessage =
              errorMessage +
              childOffer +
              " not child of offer in the Response\n";
            console.log(errorMessage);
          }
        }
      }
      // });
    }
    return flag;
  }

  private validateChildOffersDeleted(
    childOfferMap: Map<string, string[]>,
    response: { [key: string]: any }
  ): Boolean {
    let flag = true;
    let n: any;
    let errorMessage = "";
    if (childOfferMap !== null && childOfferMap !== undefined) {
      for (let offer of childOfferMap.keys()) {
        if (
          bodyParser.getChildItemByProductOffering(response, offer) === null
        ) {
          flag = false;
          errorMessage = errorMessage + offer + " not present\n";
        }
        let childs = bodyParser.getChildsByProductOfferingFromCart(
          response,
          offer
        );
        for (let childOffer of <Array<string>>childOfferMap.get(offer)) {
          if (
            bodyParser.getChildItemByProductOffering(response, childOffer) !==
            null
          ) {
            n = bodyParser.getChildItemByProductOffering(response, childOffer);
            if (
              String(n.action).toLowerCase() !== "cancel" &&
              String(n.action).toLowerCase() !== "delete"
            ) {
              flag = false;
              errorMessage = errorMessage + childOffer + " present\n";
              console.log(errorMessage);
            }
          }
        }
      }
    }
    return flag;
  }

  private async generateKongHeaders(): Promise<KongHeaders> {
    const token = await this._oauthToken.getToken(envConfig.shoppingCart.scope);
    console.log("token", token);
    return {
      Authorization: `Bearer ${token}`,
      env: envConfig.envName,
    };
  }
}
