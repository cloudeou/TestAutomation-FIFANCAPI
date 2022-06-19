import {bodyParser} from "./promotion.body-parser";
import {bodySamples} from "./promotion.body-samples";

export class payloadGenerator {
    shoppingCartId?: any;
    scResponse?: any;
    customerCategory?: any;
    distributionChannel?: any;
    externalLocationId?: any;
    promotionMap?: any;
    childOfferMap?: Map<string, string[]> | null;
    deleteChlidOfferMap?: Map<string, string[]> | null;
    addPromotionMap?: Map<string, any[]> | null;
    deletePromotionMap?: Map<string, any[]> | null;
    constructor(
        customerCategory?: any,
        distributionChannel?: any,
        externalLocationId?: any,
        scResponse?: any,
        promotionMap?: any,
        shoppingCartId?: any
       ) {
        this.customerCategory = customerCategory;
        this.distributionChannel = distributionChannel;
        this.externalLocationId = externalLocationId;
        this.shoppingCartId = shoppingCartId;
        this.addPromotionMap = null;
        this.deletePromotionMap = null;
        this.scResponse = scResponse;
        this.childOfferMap = null;
        this.deleteChlidOfferMap = null;

        this.addPromotionMap = null;
        this.deletePromotionMap = null;
        if (promotionMap !== null && promotionMap != undefined) {
            for (let [key, value] of promotionMap) {
                if (String(value) === 'Add') {
                    this.addPromotionMap = key;
                } else if (String(value) === 'Remove') {
                    this.deletePromotionMap = key;
                }
            }
        }
    }
    public applyPromotion(): string {
        return `/marketsales/fifaShoppingCart/v2/shoppingcart/` + this.shoppingCartId
    }


    generateAddPromotionBody() {
        let cartItem = [];
        for (let [offerId, discountDetail] of this.addPromotionMap!) {
            let cartItemId = bodyParser.getItemIdByProductOffering(
                this.scResponse,
                offerId,
            );
            cartItem.push(
                bodySamples.appPromotionCarts(
                    discountDetail,
                    cartItemId,
                    'Add',
                ),
            );
        }

        return cartItem.length === 0 ? null : cartItem;
    }

    generateDeletePromotionBody() {
        if (this.deletePromotionMap === null) {
            return null;
        }
        let cartItem = [];
        for (let [offerId, discountDetail] of this.deletePromotionMap!) {
            let cartItemId = bodyParser.getItemIdByProductOffering(
                this.scResponse,
                offerId,
            );
            cartItem.push(
                bodySamples.appPromotionCarts(
                    discountDetail,
                    cartItemId,
                    'Delete',
                    offerId,
                    this.scResponse,
                ),
            );
        }
        return cartItem.length === 0 ? null : cartItem;
    }

    genetateBody() : any{
        let body: any;
        let addPromotionBody: any = this.generateAddPromotionBody();
        let deletePromotionBody: any = this.generateDeletePromotionBody();
        if (
            (addPromotionBody !== null && addPromotionBody != undefined) ||
            (deletePromotionBody !== null && deletePromotionBody != undefined)
        ) {
            if (addPromotionBody !== null && addPromotionBody != undefined) {
                body = bodySamples.getAppPromotion(
                    this.externalLocationId,
                    this.distributionChannel,
                    this.customerCategory,
                    addPromotionBody,
                );
            }
            if (
                deletePromotionBody !== null &&
                deletePromotionBody != undefined
            ) {
                if (body !== undefined && body !== null) {
                    body.cartItem = body.cartItem.concat(deletePromotionBody);
                } else {
                    body = bodySamples.getAppPromotion(
                        this.externalLocationId,
                        this.distributionChannel,
                        this.customerCategory,
                        deletePromotionBody,
                    );
                }
            }
        }
        return body;
    }

}
