import {AssertionModes, test} from "@cloudeou/telus-bdd";
import {data} from "../../../test-data/test.data";
import * as _ from 'lodash';
export class bodyParser {
    static getItemIdByProductOffering(response: any, productOfferingId: string) {
        if (response == null || response == undefined) {
            return "";
        }
        let itemId = "";
        response.cartItem.forEach((item: any) => {
            if (item.productOffering.id == productOfferingId) {
                itemId = item.id;
            }
        });
        return itemId;
    }

    static getChildItemByProductOffering(
        response: any,
        productOfferingId: string
    ) {
        if (response == null) {
            return null;
        }
        let itemResult = null;
        response.cartItem.forEach((item: any) => {
            if (item.productOffering.id == productOfferingId) {
                itemResult = item;
                return itemResult;
            }
            item.cartItem.forEach((childitem: any) => {
                if (childitem.productOffering.id == productOfferingId) {
                    itemResult = childitem;
                    return itemResult;
                }
            });
        });
        return itemResult;
    }

    static getChildItemIdByProductOffering(
        response: any,
        productOfferingId: string
    ) {
        if (response == null) {
            return "";
        }
        let itemResultId = "";
        response.cartItem.forEach((item: any) => {
            if (item.productOffering.id == productOfferingId) {
                itemResultId = item.id;
                return itemResultId;
            }
            item.cartItem.forEach((childitem: any) => {
                if (childitem.productOffering.id == productOfferingId) {
                    itemResultId = childitem.id;
                    return itemResultId;
                }
            });
        });
        return itemResultId;
    }

    static getItemByProductOffering(response: any, productOfferingId: string) {
        if (response == null) {
            return "";
        }
        let itemResult = "";
        response.cartItem.forEach((item: any) => {
            if (item.productOffering.id == productOfferingId) {
                itemResult = item;
            }
        });
        return itemResult;
    }

    static getPriceForProductOffer(response: any, productOfferingId: string) {
        if (response == null) {
            return "";
        }
        let price = null;
        for (let i = 0; i < response.cartItem.length; i++) {
            if (response.cartItem[i].productOffering.id == productOfferingId) {
                price = response.cartItem[i].itemPrice.price.dutyFreeAmount.value;
                break;
            }
        }
        if (price == null) {
            console.log("No price for this item or item not found");
        }
        return price;
    }

    // body.cartItem[2].itemPrice[1].priceAlteration[0].id
    static getDiscountIdForProductOffer(
        response: any,
        productOfferingId: string,
        promotionCode: string
    ) {
        if (response == null) {
            return "";
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
        if (id == null) {
            console.log("No price for this item or item not found");
        }
        return id;
    }

    static getDiscountValueForProductOffer(
        response: any,
        productOfferingId: string,
        promotionCode: string
        // promoType
    ) {
        if (response == null) {
            return "";
        }
        let price = null,
            temp;
        for (let i = 0; i < response.cartItem.length; i++) {
            if (response.cartItem[i].productOffering.id == productOfferingId) {
                for (let x = 0; x < response.cartItem[i].itemPrice.length; x++) {
                    temp = response.cartItem[i].itemPrice[x].priceAlteration;
                    for (let j = 0; j < temp.length; j++) {
                        if (temp[j].catalogId === promotionCode) {
                            price = temp[j].price.dutyFreeAmount.value;
                            break;
                        }
                    }
                }
                if (price !== null) break;
            }
        }
        if (price == null) {
            console.log("No price for this item or item not found");
        }
        return price;
    }

    static getDiscountValueById(
        response: any,
        productOfferingId: string,
        id: string
    ) {
        if (response == null) {
            return "";
        }
        let price = null,
            temp;
        for (let i = 0; i < response.cartItem.length; i++) {
            if (response.cartItem[i].productOffering.id == productOfferingId) {
                temp = response.cartItem[i].itemPrice[1].priceAlteration;
                for (let j = 0; j < temp.length; j++) {
                    if (temp[j].id === id) {
                        price = temp[j].price.dutyFreeAmount.value;
                        break;
                    }
                }
                if (price !== null) break;
            }
        }
        if (price == null) {
            console.log("No price for this item or item not found");
        }
        return price;
    }

    static getSCChars(resposnse: any) {
        return resposnse.characteristic;
    }

    static getCartItemObjects(response: any) {
        const {cartItem: items} = response;
        return items;
    }

    static getOfferingsFromCartItems(items: any) {
        let offerings = items.map((item: any) => item.productOffering);
        return offerings;
    }

    static getProductsFromCartItems(items: any) {
        let offerings = items.map((item: any) => item.product);
        return offerings;
    }

    static getProductOfferings(response: any) {
        var offers: string[] = [];
        if (response == null) {
            return "";
        }
        response.productOfferingQualificationItem.forEach((item: any) => {
            offers.push(item.productOffering.id);
        });
        return offers;
    }

    // UPD: get productOfferings as objects
    static getProductOfferingObjects(response: any) {
        var offers: string[] = [];
        if (response == null) {
            return "";
        }
        response.productOfferingQualificationItem.forEach((item: any) => {
            offers.push(item.productOffering);
        });
        return offers;
    }

    static getChildsByProductOffering(response: any, productOfferingId: string) {
        var childs: string[] = [];
        if (response == null) {
            return "";
        }
        response.productOfferingQualificationItem.forEach((item: any) => {
            if (item.productOffering.id == productOfferingId) {
                item.productOffering.bundledProductOffering.forEach((child: any) => {
                    childs.push(child.productOffering.id);
                });
            }
        });
        return childs;
    }

    static getChildsByProductOfferingFromCart(
        response: any,
        productOfferingId: string
    ) {
        var childs: string[] = [];
        if (response == null) {
            return "";
        }
        response.cartItem.forEach((item: any) => {
            if (item.productOffering.id == productOfferingId) {
                item.cartItem.forEach((child: any) => {
                    childs.push(child.productOffering.id);
                });
            }
        });
        return childs;
    }

    static getItemIdCharValue(
        response: any,
        productOfferingId: string,
        charName: string,
        itemNumber = 0,
        shift = 0
    ) {
        let matchesP = response.cartItem.filter(
            (item: any) => item.productOffering.id == productOfferingId
        );
        let matchesC: Array<any> = [];
        response.cartItem.forEach((item: any) => {
            let newMatches = item.cartItem.filter(
                (itemc: any) => itemc.productOffering.id == productOfferingId
            );
            matchesC = matchesC.concat(newMatches);
        });
        const matches = matchesP.concat(matchesC);
        if (itemNumber == 0) {
            const res = matches[itemNumber].product.characteristic.find(
                (char: any) => char.name == charName
            ).value;
            return res;
        } else {
            const res = matches[itemNumber - 1 + shift].product.characteristic.find(
                (char: any) => char.name == charName
            ).value;
            //console.log(res);
            return res;
        }
    }

    static validateAllOffersPresentInResponse(response: any, offers: any) {
        var flag = true;
        let errorMessage = '';
        if (offers !== null && offers !== undefined && offers.length > 0) {
            offers.forEach((offer: any) => {
                if (bodyParser.getItemIdByProductOffering(response, offer) === null) {
                    flag = false;
                    errorMessage = errorMessage + offer + ' not present\n';
                }
            });
        }
        test('All offers in response',
            flag,
            AssertionModes.strict).is(true, 'Response contains no offers');
    }

    static validateAllOffersNotPresentInResponse(response: any, offers: any) {
        var flag = true;
        let n: any;
        let errorMessage = '';
        if (offers !== null && offers !== undefined && offers.length > 0) {
            offers.forEach((offer: any) => {
                if (bodyParser.getItemIdByProductOffering(response, offer) !== null) {
                    n = bodyParser.getItemByProductOffering(response, offer);
                    if (
                        String(n.action).toLowerCase() !== 'cancel' &&
                        String(n.action).toLowerCase() !== 'delete'
                    ) {
                        flag = false;
                        errorMessage = errorMessage + offer + ' present\n';
                    }
                }
            });
        }
        test('All offers not in response', flag, AssertionModes.strict).is(true, 'Response contains offers')
    }

    static validateOfferMapInResponse(childOfferMap: any, response: any) {
        let flag = true;
        let errorMessage = '';
        if (childOfferMap !== null && childOfferMap !== undefined) {
            // childOfferMapList.forEach(childOfferMap => {
            for (let offer of childOfferMap.keys()) {
                if (bodyParser.getItemIdByProductOffering(response, offer) === null) {
                    flag = false;
                    errorMessage = errorMessage + offer + ' not present\n';
                }
                let childs = bodyParser.getChildsByProductOfferingFromCart(
                    response,
                    offer,
                );

                for (let childOffer of childOfferMap.get(offer)) {
                    if (
                        bodyParser.getItemIdByProductOffering(response, childOffer) === null
                    ) {
                        flag = false;
                        errorMessage = errorMessage + childOffer + ' not present\n';
                    }
                    if (!childs.includes(childOffer)) {
                        flag = false;
                        errorMessage =
                            errorMessage +
                            childOffer +
                            ' not child of offer in the Response\n';
                    }
                }
            }
            // });
        }
        test('validate Offer Map In Response test', flag, AssertionModes.strict)
            .isnot(false, errorMessage)
    }

    static validateOfferMapNotInResponse(childOfferMap: any, response: any) {
        let flag = true;
        let n: any;
        let errorMessage = '';
        if (childOfferMap !== null && childOfferMap !== undefined) {
            for (let offer of childOfferMap.keys()) {
                if (
                    bodyParser.getChildItemByProductOffering(response, offer) === null
                ) {
                    flag = false;
                    errorMessage = errorMessage + offer + ' not present\n';
                }
                let childs = bodyParser.getChildsByProductOfferingFromCart(
                    response,
                    offer,
                );
                for (let childOffer of childOfferMap.get(offer)) {
                    if (
                        bodyParser.getChildItemByProductOffering(response, childOffer) !==
                        null
                    ) {
                        n = bodyParser.getChildItemByProductOffering(response, childOffer);
                        if (
                            String(n.action).toLowerCase() !== 'cancel' &&
                            String(n.action).toLowerCase() !== 'delete'
                        ) {
                            flag = false;
                            errorMessage = errorMessage + childOffer + ' present\n';
                        }
                    }
                }
            }
        }
        test('validate OfferMap Not In Response test', flag, AssertionModes.strict)
            .is(true, errorMessage)
    }

    static validateCharMapInResponse(
        childOfferMap: any,
        charMap: any,
        response: any,
        existingChildOffersMap: any,
    ) {
        //console.log(charMap);
        let flag = true;
        let errorMessage = '';
        if (charMap !== null) {
            for (let item of charMap.keys()) {
                charMap.get(item).forEach((char: any) => {
                    if (item == 'SalesOrder') return;
                    const itemNumber =
                        char.itemNumber != 'none' ? Number(char.itemNumber) : 0;
                    let responseTemp = response;
                    let itemNumberShift = 0;
                    if (childOfferMap !== null) {
                        for (let [productOfferingId, childOfferList] of childOfferMap) {
                            // console.log(childOfferList);
                            // console.log(item);
                            if (childOfferList.includes(item)) {
                                responseTemp = bodyParser.getItemByProductOffering(
                                    response,
                                    productOfferingId,
                                );
                                itemNumberShift = existingChildOffersMap
                                    .get(productOfferingId)
                                    .get(item);
                            }
                        }
                    }
                    itemNumberShift = itemNumberShift ? itemNumberShift : 0;
                    let value = bodyParser
                        .getItemIdCharValue(
                            responseTemp,
                            item,
                            char.name,
                            itemNumber,
                            itemNumberShift,
                        )
                        .toString();
                    if (value !== char.value) {
                        flag = false;
                        errorMessage =
                            errorMessage +
                            item +
                            ' -> ' +
                            char.name +
                            ': ' +
                            value +
                            ' instead of ' +
                            char.value +
                            '\n';
                    }
                });
            }
        }
        test('validate CharMap In Response test', flag, AssertionModes.strict)
            .is(true, errorMessage)
    }

    static validateWorkOrdersCorrectness(response: any) {
        let workOrderCount = 0;
        let expectedWorkOrderCount = 0;
        let counter = new Map();
        let addForTV = 0;
        let addForPhone = 0;
        let addFortelusConnectivity = 0;
        // potentially add HSIA and HS

        response.cartItem.forEach((cartItem: any) => {
            let categories = _.map(cartItem.productOffering.category, 'id');
            //const prodNameV1 = cartItem.product.displayName;
            const prodNameV2 = cartItem.product.name;
            if (prodNameV2 !== 'Work Offer') {
                if (categories.includes(data.categories.optikTVHome)) {
                    if (!counter.has(data.categories.optikTVHome)) {
                        counter.set(data.categories.optikTVHome, 1);
                    } else {
                        counter.set(
                            data.categories.optikTVHome,
                            counter.get(data.categories.optikTVHome) + 1,
                        );
                    }
                    if (
                        String(cartItem.action) === 'Add' ||
                        String(cartItem.action) === '-'
                    ) {
                        addForTV = addForTV + 1;
                    }
                } else if (categories.includes(data.categories.telusConnectivity)) {
                    if (!counter.has(data.categories.telusConnectivity)) {
                        counter.set(data.categories.telusConnectivity, 1);
                    } else {
                        counter.set(
                            data.categories.telusConnectivity,
                            counter.get(data.categories.telusConnectivity) + 1,
                        );
                    }
                    if (
                        String(cartItem.action) === 'Add' ||
                        String(cartItem.action) === '-'
                    ) {
                        addFortelusConnectivity = addFortelusConnectivity + 1;
                    }
                } else if (categories.includes(data.categories.voicePlans)) {
                    if (!counter.has(data.categories.voicePlans)) {
                        counter.set(data.categories.voicePlans, 1);
                    } else {
                        counter.set(
                            data.categories.voicePlans,
                            counter.get(data.categories.voicePlans) + 1,
                        );
                    }
                    if (
                        String(cartItem.action) === 'Add' ||
                        String(cartItem.action) === '-' ||
                        String(cartItem.action) === 'Cancel'
                    ) {
                        addForPhone = addForPhone + 1;
                    }
                } else {
                    cartItem.product.characteristic.forEach((characteristic: any) => {
                        if (
                            String(characteristic.displayName) === 'Delivery Method' &&
                            _.includes(
                                data.characteristics.proInstall,
                                characteristic.value,
                            )
                        ) {
                            workOrderCount = workOrderCount + 1;
                        }
                    });
                }
            }
        });

        if (addForTV === 1) {
            if (counter.get(data.categories.optikTVHome) === 1) {
                workOrderCount = workOrderCount + 1;
            }
        }
        if (addForPhone === 1) {
            if (counter.get(data.categories.voicePlans) === 1) {
                workOrderCount = workOrderCount + 1;
            }
        }
        if (addFortelusConnectivity === 1) {
            if (counter.get(data.categories.telusConnectivity) === 1) {
                workOrderCount = workOrderCount + 1;
            }
        }
        response.cartItem.forEach((cartItem: any) => {
            if (cartItem.product.name === 'Work Offer') {
                expectedWorkOrderCount = cartItem.cartItem.length;
            }
        });

        if (workOrderCount === expectedWorkOrderCount) {
            return true;
        }
        return false;
    }

}
