import {bodyParser} from "./promotion.body-parser";

export class bodySamples {
   static getPriceAlterations(scResponse: any, offerId: any, discountDetail: any, action: any): any {
        let priceAlteration: any = [];
        discountDetail.forEach((discount: any) => {
            priceAlteration.push({
                id: bodyParser.getDiscountIdForProductOffer(
                    scResponse,
                    offerId,
                    discount.discountId,
                ),
                catalogId: discount.discountId,
                reasonCodeId: discount.reasonCd,
                action: !!action ? action : 'Add',
            });
        });
        return priceAlteration;
    }
    static appPromotionCarts(discountDetail: any, cartItemId: any, action: any, offerId?: any, response?: any) {
        return {
            action: action,
            id: cartItemId,
            itemPrice: [
                {
                    priceType: 'Recurrent',
                    price: {
                        dutyFreeAmount: {
                            value: null,
                        },
                    },
                    priceAlteration: this.getPriceAlterations(
                        response,
                        offerId,
                        discountDetail,
                        action,
                    ),
                },
            ],
        };
    }
    getAppPromotion(locationId: any, channel: any, customerCategory: any, cartItems: any) {
        return {
            place: [
                {
                    id: locationId,
                    role: 'service address',
                },
            ],
            channel: {
                id: channel,
            },
            relatedParty: [
                {
                    _comment: "add 'id' attribute in case ECID is known",
                    role: 'customer',
                    characteristic: [
                        {
                            name: 'category',
                            value: customerCategory,
                        },
                    ],
                },
            ],
            cartItem: cartItems,
        };
    }
    appPromotionCarts(discountDetail: any, cartItemId: any, action: any, offerId?: any, response?: any) {
        return {
            action: action,
            id: cartItemId,
            itemPrice: [
                {
                    priceType: 'Recurrent',
                    price: {
                        dutyFreeAmount: {
                            value: null,
                        },
                    },
                    priceAlteration: this.getPriceAlterations(
                        response,
                        offerId,
                        discountDetail,
                        action,
                    ),
                },
            ],
        };
    }
    getPriceAlterations(scResponse: any, offerId: any, discountDetail: any, action: any) {
        let priceAlteration: any = [];
        discountDetail.forEach((discount: any) => {
            priceAlteration.push({
                id: bodyParser.getDiscountIdForProductOffer(
                    scResponse,
                    offerId,
                    discount.discountId,
                ),
                catalogId: discount.discountId,
                reasonCodeId: discount.reasonCd,
                action: !!action ? action : 'Add',
            });
        });
        return priceAlteration;
    }


    static getAppPromotion(locationId:any, channel:any, customerCategory:any, cartItems:any) {
        return {
            place: [
                {
                    id: locationId,
                    role: 'service address',
                },
            ],
            channel: {
                id: channel,
            },
            relatedParty: [
                {
                    _comment: "add 'id' attribute in case ECID is known",
                    role: 'customer',
                    characteristic: [
                        {
                            name: 'category',
                            value: customerCategory,
                        },
                    ],
                },
            ],
            cartItem: cartItems,
        };
    }
}