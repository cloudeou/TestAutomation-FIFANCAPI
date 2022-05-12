import {AssertionModes, test} from "@cloudeou/telus-bdd";

export class bodyParser {
    static getDiscountIdForProductOffer(
        response,
        productOfferingId,
        promotionCode,
    ) {
        if (response == null) {
            return '';
        }
        let id = null,
            temp;
        for (let i = 0; i < response.cartItem.length; i++) {
            if (response.cartItem[i].productOffering.id == productOfferingId) {
                temp = response.cartItem[i].itemPrice[0].priceAlteration;
                for (let j = 0; j < temp.length; j++) {
                    if (temp[j].catalogId === promotionCode) {
                        id = temp[j].id;
                        break;
                    }
                }
                if (id !== null) break;
            }
        }
        test(
            'Item should contain price',
            id, AssertionModes.strict).not(null,'No price for this item or item not found');
        return id;
    }
    static getItemByProductOffering(response, productOfferingId) {
        if (response == null) {
            return '';
        }
        let itemResult = '';
        response.cartItem.forEach((item) => {
            if (item.productOffering.id == productOfferingId) {
                itemResult = item;
            }
        });
        return itemResult;
    }
    static validatePromotionsInResponse(promotions, response) {
        let flag = false;
        let errorMessage = '';
        if (promotions !== null && promotions !== undefined) {
            // childOfferMapList.forEach(childOfferMap => {
            for (let offer of promotions.keys()) {
                let cart: any;
                cart = this.getItemByProductOffering(response, offer);
                if (cart === null) {
                    errorMessage = errorMessage + offer + ' not present\n';
                    break;
                }
                let cartOffers = [];
                let promotionOffers = [];

                for (let itemPrice of cart.itemPrice) {
                    for (let alteration of itemPrice.priceAlteration) {
                        cartOffers.push({
                            discountId: alteration.catalogId,
                            reasonCd: alteration.reasonCodeId,
                        });
                    }
                }
                for (let discount of promotions.get(offer)) {
                    promotionOffers.push({
                        discountId: discount.discountId,
                        reasonCd: discount.reasonCd,
                    });
                }
                for (let i = 0; i < promotionOffers.length; i++) {
                    if (
                        !JSON.stringify(cartOffers).includes(
                            JSON.stringify(promotionOffers[i]),
                        )
                    ) {
                        errorMessage =
                            errorMessage +
                            'Promotion: ' +
                            JSON.stringify(promotionOffers[i]) +
                            ' not found for product: ' +
                            String(offer) +
                            '\n';
                    }
                }
            }
        } else {
            errorMessage = errorMessage + 'No promotion passed or promotion is null';
        }
        test(
            'No error message',
            errorMessage === '',
            AssertionModes.strict).is(true, "Catch error message");
    }

    static validatePromotionsNotInResponse(promotions, response) {
        console.log("RESPONSE");
        console.log(JSON.stringify(response));
        var flag = true;
        let errorMessage = '';
        if (promotions !== null && promotions !== undefined) {
            // childOfferMapList.forEach(childOfferMap => {
            for (let offer of promotions.keys()) {
                let cart: any;
                cart = bodyParser.getItemByProductOffering(response, offer);
                if (cart === null) {
                    errorMessage = errorMessage + offer + ' not present\n';
                    break;
                }
                for (let discount of promotions.get(offer)) {
                    for (let itemPrice of cart.itemPrice) {
                        for (let alteration of itemPrice.priceAlteration) {
                            if (
                                alteration.catalogId === discount.discountId &&
                                alteration.reasonCodeId === discount.reasonCd
                            ) {
                                flag = flag ? false : flag;
                                errorMessage =
                                    errorMessage +
                                    'Discount: ' +
                                    JSON.stringify(discount) +
                                    ' not removed\n';
                                break;
                            }
                        }
                    }
                }
            }
        }
        test(
            'No error message',
            errorMessage === '',
            AssertionModes.strict).is(true, "Catch error message");
    }
}