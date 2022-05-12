import {bodyParser} from "./promotion.body-parser";

export class bodySamples {
   static getPriceAlterations(scResponse, offerId, discountDetail, action) {
        let priceAlteration = [];
        discountDetail.forEach((discount) => {
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
    static appPromotionCarts(discountDetail, cartItemId, action, offerId?, response?) {
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
}