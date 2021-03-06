import { envConfig } from "../env-config";
import { OauthToken } from "../oauth-token";
import { axiosInstance } from "../axios-instance";
import { AxiosResponse } from "axios";
import { bodyParser } from "./shopping-cart.body-parser";
import { BodySamples } from "./shopping-cart.body-samples";
import { BodyGenerator } from "./shopping-cart.body-generator";
import {generateKongHeaders} from "../IkongApi"

export enum ShoppingCartActions {
  create = "Create",
  update = "Update",
  delete = "Delete",
  get = "Get",
  validate = "Validate",
  submit = "Submit",
}

export type SCParams = {
  ecid?: number | null;
  lpdsid?: string;
  customerCategory: string;
  distributionChannel: string;
  prevResponse?: any;
  offersToAdd?: Map<string, string> | null;
  childOfferMap?: Map<Map<string, string[]>, string> | null;
  charMap?: Map<string, Array<{}>> | null;
  promotionMap?: Map<Map<string, any[]>, string> | null;
};

export class ShoppingCartApi {
  private _oauthToken: any;
  private _body: { [key: string]: any } = {};
  private _shoppingCartId: string = "";

  public set shoppingCartId(shoppingCartId: string) {
    this._shoppingCartId = shoppingCartId;
  }

  public get body(): { [key: string]: any } {
    return this._body;
  }

  constructor(scId: string = "") {
    this._shoppingCartId = scId;
    this._oauthToken = new OauthToken(
      envConfig.shoppingCart.clientId,
      envConfig.shoppingCart.clientSecret
    );
  }

  private generateBody(
    action: string,
    scParams: SCParams
  ): { [key: string]: any } {

    if (action == ShoppingCartActions.submit || action == ShoppingCartActions.validate) {
      return BodySamples.validateOrSubmitBody(
        scParams.customerCategory,
        scParams.distributionChannel
      );
    } else {
      const body = new BodyGenerator(
        <number>scParams.ecid,
        scParams.customerCategory,
        scParams.distributionChannel,
        scParams.lpdsid,
        scParams.prevResponse,
        scParams.offersToAdd,
        scParams.childOfferMap,
        scParams.charMap,
        null,
        undefined,
        <ShoppingCartActions>action,

      );
      return body.generateBody()!;
    }
  }

  public async createShoppingCart(scParams: SCParams): Promise<AxiosResponse> {
    const body = this.generateBody(ShoppingCartActions.create, scParams);
    console.log(`create shopping cart`);
    try {
      const token = await this._oauthToken.getToken(envConfig.shoppingCart.scope);
      const headers = await generateKongHeaders(token);
      const response = await axiosInstance({
        method: "POST",
        url: envConfig.ikongUrl + envConfig.shoppingCart.baseUrl,
        data: body,
        headers,
      });
      this._shoppingCartId = response.data.id;
      return response;
    } catch (error) {
      console.log(`Error while create of SC: ${error}`);
      throw error;
    }
  }

  public async updateShoppingCart(scParams: SCParams): Promise<AxiosResponse> {
    const body = this.generateBody(ShoppingCartActions.update, scParams);
    console.log(`update shopping cart`);
    console.log(JSON.stringify(body));
    try {
      const token = await this._oauthToken.getToken(envConfig.shoppingCart.scope);
      const headers = await generateKongHeaders(token);
      const response = await axiosInstance({
        method: "PUT",
        url: `${envConfig.ikongUrl}${envConfig.shoppingCart.baseUrl}/${this._shoppingCartId}`,
        data: body,
        headers,
      });
      return response;
    } catch (error: any) {
      console.log(`Error while update of SC: ${error}`);
      throw error;
    }
  }

  public async getShoppingCart(): Promise<AxiosResponse> {
    console.log(`get shopping cart`);
    try {
      const token = await this._oauthToken.getToken(envConfig.shoppingCart.scope);
      const headers = await generateKongHeaders(token);
      const response = await axiosInstance({
        method: "GET",
        url: `${envConfig.ikongUrl}${envConfig.shoppingCart.baseUrl}/${this._shoppingCartId}`,
        headers,
      });
      return response;
    } catch (error: any) {
      console.log(`Error while get of SC: ${error}`);
      throw error;
    }
  }

  public async deleteShoppingCart(): Promise<AxiosResponse> {
    console.log(`delete shopping cart`);
    try {
      const token = await this._oauthToken.getToken(envConfig.shoppingCart.scope);
      const headers = await generateKongHeaders(token);
      const response = await axiosInstance({
        method: "DELETE",
        url: `${envConfig.ikongUrl}${envConfig.shoppingCart.baseUrl}/${this._shoppingCartId}`,
        headers,
      });
      return response;
    } catch (error: any) {
      console.log(`Error while delete of SC: ${error}`);
      throw error;
    }
  }

  public async validateShoppingCart(
    scParams: SCParams
  ): Promise<AxiosResponse> {
    const body = this.generateBody(ShoppingCartActions.validate, scParams);
    console.log(`validate shopping cart`);
    console.log(body);
    try {
      const token = await this._oauthToken.getToken(envConfig.shoppingCart.scope);
      const headers = await generateKongHeaders(token);
      const response = await axiosInstance({
        method: "POST",
        url: `${envConfig.ikongUrl}${envConfig.shoppingCart.baseUrl}/${this._shoppingCartId}/validate`,
        data: body,
        headers,
      });
      return response;
    } catch (error: any) {
      console.log(`Error while validate of SC: ${error}`);
      throw error;
    }
  }

  public async submitShoppingCart(scParams: SCParams): Promise<AxiosResponse> {
    const body = this.generateBody(ShoppingCartActions.submit, scParams);
    console.log(`submit shopping cart`);
    console.log(body);
    try {
      const token = await this._oauthToken.getToken(envConfig.shoppingCart.scope);
      const headers = await generateKongHeaders(token);
      const response = await axiosInstance({
        method: "POST",
        url: `${envConfig.ikongUrl}${envConfig.shoppingCart.baseUrl}/${this._shoppingCartId}/checkout`,
        data: body,
        headers,
      });
      return response;
    } catch (error) {
      console.log(`Error while submit of SC: ${error}`);
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

}
