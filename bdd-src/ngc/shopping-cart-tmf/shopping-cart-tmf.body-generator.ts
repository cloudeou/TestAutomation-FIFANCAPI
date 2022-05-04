import { BodySamples } from "./shopping-cart-tmf.body-samples";
import { bodyParser } from "./shopping-cart-tmf.body-parser";
import { envConfig } from "../../env-config/index";
import { SCActions } from "./shopping-cart-tmf.api";

const bodySample = new BodySamples();
export class BodyGenerator {
  selectedOffers: string[];
  deleteOffers: string[];
  childOfferMap?: Map<string, string[]>;
  deleteChlidOfferMap?: Map<string, string[]>;
  addPromotionMap?: Map<string, any[]>;
  deletePromotionMap?: Map<string, any[]>;
  charMap: Map<string, { [key: string]: any }[]>;
  ecid: number;
  customerCategory: string;
  lpdsid: number;
  distributionChannel: string;
  scResponse: any;
  action: SCActions;
  envcfg: any;
  constructor(
    ecid: number,
    lpdsid: number,
    action: SCActions,
    customerCategory?: string,
    distributionChannel?: string,
    scResponse?: any,
    selectedOffers?: Map<string, string>,
    childOfferMap?: Map<Map<string, string[]>, string>,
    charMap?: Map<string, Array<{}>>,
    promotionMap?: Map<Map<string, any[]>, string>
  ) {
    this.selectedOffers = [];
    this.deleteOffers = [];
    if (selectedOffers !== null && selectedOffers != undefined) {
      for (let [key, value] of selectedOffers) {
        if (String(value) === "Add") {
          this.selectedOffers.push(String(key));
        } else if (String(value) === "Delete") {
          this.deleteOffers.push(String(key));
        }
      }
    }
    if (childOfferMap !== null && childOfferMap != undefined) {
      for (let [key, value] of childOfferMap) {
        if (String(value) === "Add") {
          this.childOfferMap = key;
        } else if (String(value) === "Delete") {
          this.deleteChlidOfferMap = key;
        }
      }
    }
    if (promotionMap !== null && promotionMap != undefined) {
      for (let [key, value] of promotionMap) {
        if (String(value) === "Add") {
          this.addPromotionMap = key;
        } else if (String(value) === "Remove") {
          this.deletePromotionMap = key;
        }
      }
    }

    this.charMap = <Map<string, Array<[]>>>charMap;
    this.ecid = ecid;
    this.customerCategory = <string>customerCategory;
    this.distributionChannel = <string>distributionChannel;
    this.lpdsid = lpdsid;
    this.scResponse = scResponse;
    this.action = action;
    this.envcfg = envConfig;
  }

  generateBody(): { [key: string]: any } {
    let body;
    let cartItems: Array<any> = [];
    let selectedOfferBody = this.generateSelectedOffersBody();
    let deleteOfferBody = this.generateDeleteOffersBody();
    let childOfferBody = this.generateChildOffersBody();
    let deleteChildOfferBody = this.generateChildOffersDeleteBody();
    let addPromotionBody = this.generateAddPromotionBody();
    let deletePromotionBody = this.generateDeletePromotionBody();

    let offerBody = this.generateOffersBody();
    if (selectedOfferBody != null) {
      cartItems = cartItems.concat(selectedOfferBody);
    }
    if (deleteOfferBody != null) {
      cartItems = cartItems.concat(deleteOfferBody);
    }
    if (childOfferBody !== null && childOfferBody != undefined) {
      cartItems = cartItems.concat(childOfferBody);
    }
    if (deleteChildOfferBody !== null && deleteChildOfferBody != undefined) {
      cartItems = cartItems.concat(deleteChildOfferBody);
    }
    if (
      offerBody !== null &&
      offerBody != undefined &&
      offerBody[0] != undefined &&
      offerBody.length !== 0
    ) {
      cartItems = cartItems.concat(offerBody);
    }
    if (
      (addPromotionBody !== null && addPromotionBody != undefined) ||
      (deletePromotionBody !== null && deletePromotionBody != undefined)
    ) {
      if (addPromotionBody !== null && addPromotionBody != undefined) {
        body = bodySample.getAppPromotion(
          this.lpdsid,
          this.distributionChannel,
          this.customerCategory,
          addPromotionBody
        );
      }
      if (deletePromotionBody !== null && deletePromotionBody != undefined) {
        if (body != undefined && body !== null) {
          body.cartItem = body.cartItem.concat(deletePromotionBody);
        } else {
          body = bodySample.getAppPromotion(
            this.lpdsid,
            this.distributionChannel,
            this.customerCategory,
            deletePromotionBody
          );
        }
      }
    } else {
      body = bodySample.mainBody(
        this.ecid,
        this.customerCategory,
        this.distributionChannel,
        this.lpdsid,
        cartItems,
        this.charMap
          ? this.generateCharsItem(
              <{ [key: string]: any }[]>this.charMap.get("SalesOrder")
            )
          : undefined
      );
    }
    return <{ [key: string]: any }>body;
  }

  generateOffersBody() {
    let cartItems = [];
    if (this.charMap == null) {
      return null;
    }
    let allParentOffers: string[] = [];
    let allChildOffers: string[] = [];
    let allSelectedChildOffers: string[] = [];
    if (!this.scResponse || !this.scResponse.cartItem) {
      return null;
    }
    //Store all parent offers and
    //Store all child offers from response
    this.scResponse.cartItem.forEach((item: any) => {
      allParentOffers.push(item.productOffering.id);
      item.cartItem.forEach((childItem: any) => {
        allChildOffers.push(childItem.productOffering.id);
      });
    });

    //Collect all child offers being added in the scenario
    if (this.childOfferMap) {
      for (let item of Array.from(this.childOfferMap.keys())) {
        this.childOfferMap.get(item)?.forEach((val) => {
          allSelectedChildOffers.push(val);
        });
      }
    }

    let cartMap = new Map();
    let cartChilds: string[] = [];
    this.scResponse.cartItem.forEach((item: any) => {
      item.cartItem.forEach((childItem: any) => {
        cartChilds.push(childItem.productOffering.id);
      });
      cartMap.set(
        item.productOffering.id,
        cartChilds.length ? cartChilds : undefined
      );
      cartChilds = [];
    });

    let cartItem;
    for (let offer of Array.from(this.charMap.keys())) {
      //If current scenario don't add any offer or childOffer
      //add characterstics to the offer/childOffer added in last scenarios
      if (
        (this.selectedOffers === null ||
          this.selectedOffers.includes(offer) === false) &&
        (allSelectedChildOffers.length == 0 ||
          allSelectedChildOffers.includes(offer) === false)
      ) {
        //console.log('Offer:' + offer, allParentOffers, allChildOffers)
        if (allParentOffers.includes(offer)) {
          //If the offer is top offer do it as top offer
          cartItem = bodySample.topOfferItem(
            offer,
            bodyParser.getItemIdByProductOffering(this.scResponse, offer),
            "Add",
            this.charMap
              ? this.generateCharsItem(
                  <{ [key: string]: any }[]>this.charMap.get(offer)
                )
              : undefined
          );
        } else if (allChildOffers.includes(offer)) {
          let productOfferingId;
          for (let parent of Array.from(cartMap.keys())) {
            if (cartMap.get(parent) !== null) {
              if (cartMap.get(parent).includes(offer)) {
                productOfferingId = parent;
              }
            }
          }
          //If the offer is child offer do it as child offer
          cartItem = bodySample.childOfferItem(
            offer,
            bodyParser.getItemIdByProductOffering(
              this.scResponse,
              productOfferingId
            ),
            productOfferingId,
            bodyParser.getItemIdByProductOffering(this.scResponse, offer),
            undefined,
            this.generateCharsItem(
              <{ [key: string]: any }[]>this.charMap.get(offer)
            )
          );
        } else if (offer == "SalesOrder") {
          return;
        } else {
          throw new Error(
            "Offer " + offer + " don't belong to Top or child offers"
          );
        }
        cartItems.push(cartItem);
      }
    }
    return cartItems;
  }

  generateAddPromotionBody() {
    if (!this.addPromotionMap) {
      return null;
    }
    let cartItem = [];
    if (this.addPromotionMap) {
      for (let [offerId, discountDetail] of this.addPromotionMap) {
        let cartItemId = bodyParser.getItemIdByProductOffering(
          this.scResponse,
          offerId
        );
        cartItem.push(
          bodySample.appPromotionCarts(
            discountDetail,
            // discountDetail[0].discountId,
            // discountDetail[0].reasonCd,
            cartItemId,
            "Add"
          )
        );
      }
    }

    return cartItem;
  }

  generateDeletePromotionBody() {
    if (!this.deletePromotionMap) {
      return null;
    }
    let cartItem = [];
    if (this.deletePromotionMap) {
      for (let [offerId, discountDetail] of this.deletePromotionMap) {
        let cartItemId = bodyParser.getItemIdByProductOffering(
          this.scResponse,
          offerId
        );
        cartItem.push(
          bodySample.appPromotionCarts(
            discountDetail,
            cartItemId,
            "Delete",
            offerId,
            this.scResponse
          )
        );
      }
    }
    return cartItem;
  }

  generateSelectedOffersBody() {
    let cartItems: { [key: string]: any }[] = [];
    let cartItem;
    if (!this.selectedOffers || this.selectedOffers == undefined) {
      return null;
    }
    this.selectedOffers.forEach((offer) => {
      let charMap: { [key: string]: any }[] = [];
      if (this.charMap !== null && this.charMap != undefined) {
        charMap = this.generateCharsItem(
          <{ [key: string]: any }[]>this.charMap.get(offer)
        );
      }
      cartItem = bodySample.topOfferItem(
        offer,
        bodyParser.getItemIdByProductOffering(this.scResponse, offer),
        "Add",
        charMap.length ? charMap : undefined
      );
      cartItems.push(cartItem);
    });
    return cartItems;
  }

  generateDeleteOffersBody() {
    let cartItems: { [key: string]: any }[] = [];
    let cartItem;
    if (!this.deleteOffers || this.deleteOffers == undefined) {
      return null;
    }
    this.deleteOffers.forEach((offer) => {
      let charMap: { [key: string]: any }[] = [];
      if (this.charMap !== null && this.charMap != undefined) {
        charMap = this.generateCharsItem(
          <{ [key: string]: any }[]>this.charMap.get(offer)
        );
      }
      cartItem = bodySample.topOfferItem(
        offer,
        bodyParser.getItemIdByProductOffering(this.scResponse, offer),
        "Delete",
        charMap.length ? charMap : undefined
      );
      cartItems.push(cartItem);
    });
    return cartItems;
  }

  generateChildOffersBody() {
    let cartItems = [];
    if (!this.childOfferMap || this.childOfferMap == undefined) {
      return null;
    }
    console.dir(this.childOfferMap);
    for (let [productOfferingId, childOfferList] of this.childOfferMap) {
      for (let i = 0; i < childOfferList.length; i++) {
        let childOffer = childOfferList[i];
        let cartItem;
        let charItemsT = null;
        if (this.charMap !== null && this.charMap) {
          charItemsT = this.charMap.get(childOffer);
        }
        console.log("Chars for one child item:" + charItemsT);
        let charItems = [];
        for (let j = 0; !!charItemsT && j < charItemsT.length; j++) {
          let c = charItemsT[j];
          if (i === Number(c.itemNumber) - 1) {
            charItems.push({ name: c.name, value: c.value });
          }
          if (String(c.itemNumber).toLowerCase() == "none") {
            charItems.push({ name: c.name, value: c.value });
          }
        }
        cartItem = bodySample.childOfferItem(
          childOffer,
          bodyParser.getItemIdByProductOffering(
            this.scResponse,
            productOfferingId
          ),
          productOfferingId,
          this.childOfferMap !== null && this.childOfferMap
            ? ""
            : bodyParser.getChildItemIdByProductOffering(
                this.scResponse,
                childOffer
              ),
          undefined,
          charItems
        );
        cartItems.push(cartItem);
        console.log(cartItem);
      }
    }
    return cartItems;
  }

  generateChildOffersDeleteBody() {
    let cartItems: { [key: string]: any }[] = [];
    if (this.deleteChlidOfferMap) {
      for (let [productOfferingId, childOfferList] of this
        .deleteChlidOfferMap) {
        childOfferList.forEach((childOffer) => {
          let cartItem;
          let charItems: { [key: string]: any }[] = [];

          let childItemInCart: any;
          childItemInCart = bodyParser.getChildItemByProductOffering(
            this.scResponse,
            childOffer
          );
          if (this.charMap != undefined) {
            charItems = this.generateCharsItem(
              <{ [key: string]: any }[]>this.charMap.get(childOffer)
            );
          }
          cartItem = bodySample.childOfferItem(
            childOffer,
            bodyParser.getItemIdByProductOffering(
              this.scResponse,
              productOfferingId
            ),
            productOfferingId,
            childItemInCart.id,
            "Delete",
            charItems.length ? charItems : undefined
          );
          cartItems.push(cartItem);
        });
      }
    }
    return cartItems;
  }

  generateCharsItem(charList: { [key: string]: any }[]) {
    let charItems: { [key: string]: any }[] = [];
    charList?.forEach((charContainer) => {
      let charItem = bodySample.charItem(charContainer);
      charItems.push(charItem);
    });
    return charItems;
  }

  generateCharItemUpdate(charList: { [key: string]: any }[]) {
    let charItems: { [key: string]: any }[] = [];
    if (charList) {
      charList.forEach((charContainter) => {
        let charItem = bodySample.charItem(charContainter);
        charItems.push(charItem);
      });
    }
    return charItems;
  }

  generateCategoryItemList(categoryList: string[]) {
    let categoryItemList: { [key: string]: any }[] = [];
    if (categoryList) {
      categoryList.forEach((categoryId) => {
        let categoryItem = bodySample.getCategoryItem(categoryId);
        categoryItemList.push(categoryItem);
      });
      return categoryItemList;
    }
  }
}
