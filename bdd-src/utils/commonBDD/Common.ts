import {skipScenario, featureContext, test, AssertionModes} from '@cloudeou/telus-bdd';
import {RandomValueGenerator} from '../common/RandomValueGenerator';
import {bodyParser} from "../../ngc/shopping-cart-tmf/shopping-cart-tmf.body-parser";
import PreconditionContext from "../../../bdd/contexts/ngc/PreconditionContext";
import { Identificators } from "../../../bdd/contexts/Identificators";
import {AxiosResponse} from "axios";
import {priceSchema} from './JoiSchemas/priceSchema';
import {priceAlterationSchema} from './JoiSchemas/priceAlterationSchema';
import {testData} from "../../../test-data/test.data";
import * as _ from 'lodash';


let preconditionContext = (): PreconditionContext =>
    featureContext().getContextById(Identificators.preConditionContext);


export class Common {
    static getOffersFromTable(table: any, shoppingCartContext: any) {
        let productOfferingList: Array<any> = [];
        console.log("inside getOffersFromTable");
        console.log(table);
        table.forEach(function (row: any) {
            let offerId = row.OfferId;
            if (offerId === "any") {
                productOfferingList.push(shoppingCartContext().getAvailableOffers()[0]);
            } else {
                productOfferingList.push(offerId);
            }
        });
        return productOfferingList;
    }
    static checkValidResponse(response: AxiosResponse, statusCode?: any) {
        test('Response should not be empty', response, AssertionModes.strict ).isnot(null,'Response is empty');
        test('Response field should be present',  response.data, AssertionModes.strict).isnot(undefined,'Response is not present');
        test('Response should contain body', response.data, AssertionModes.strict).isnot(undefined,'Response is not contain body');
        //test('Actual result', response,AssertionModes.strict).isnot(null,'Response should contain body')
        if (statusCode !== undefined) {
            test('Status code',
              response.status, AssertionModes.strict).is(statusCode, `statusCode should be statusCode`)
        }
        return true;
    }

    static getAttrsListFromTable(table: any): any {
        let attrssList: any = [];
        table.forEach((row: any) => {
            let attr = row.AttributeName;
            attrssList.push(attr);
        });
        return attrssList;
    }

    static checkIfCategoryContainAllProps(offer:any): any {
        let isCatContain: boolean = true;
        offer.category.forEach((c: any) => {
            c['id'] && c['href'] && c['name'] && c['@referredType']
                ? (isCatContain = true)
                : (isCatContain = false);
        });
        return isCatContain;
    }
    // static getBootstrapIfExists(defaultValue: any) {
    //     return defaultValue[0] === '@'
    //         ? preconditionContext().getBootstrapData(defaultValue.slice(1))
    //         : defaultValue;
    // }
    static IsItemQualified(qItem: any, body: any) {

        let flag = false;

        body.serviceQualificationItem.forEach((item: any) => {
            if (
                item.serviceSpecification.name.toLowerCase() === qItem.toLowerCase()
            ) {
                test('Item should be qualified',
                    item.qualificationResult,
                    AssertionModes.strict)
                    .is(
                    'qualified',
                        'Item is not qualified');

                flag = true;
            }
        });

        return flag;
    }

    static getCommitmentPeriodChars(commitment: string, periodType: string) {
        const today = new Date();
        const startDate = new Date(today);
        const endDate = new Date(today.setMonth(today.getMonth() + 3));
        let dateChars = [
            { Name: "9149604606813116277", Value: startDate, Item: commitment }, // start date char
            { Name: "9149604821113116295", Value: endDate, Item: commitment }, // end date char
        ];
        switch (periodType) {
            case "trial":
                dateChars.pop();
                return dateChars;
            case "regular":
                return dateChars;
            case "earlyRenewal":
                dateChars[0].Value = new Date(
                  startDate.setMonth(startDate.getMonth() - 3)
                );
                dateChars[1].Value = new Date(today.setMonth(today.getMonth() + 1));
                return dateChars;
        }
    }

    static createCharMapFromTable(table: any) {
        let charMap = new Map<string, any[]>();
        table.forEach(async (row: any) => {
            let email = RandomValueGenerator.generateRandomAlphaNumeric(15);
            let randomText = RandomValueGenerator.generateRandomAlphabetic(10);

            let charList: any = [];
            charList = charMap.get(row.Item);

            let rowVal = String(row.Value).toLowerCase();
            let val: any = '';
            switch (rowVal) {
                case 'randomemail':
                    val = email + '@telus.net';
                    break;
                case 'username':
                    val = email;
                    break;
                case 'resourceid':
                    val = `resourceid${randomText}`;
                    break;
                default:
                    val = row.Value;
                    break;
            }

            let char = {
                name: row.Name,
                value: val,
                itemNumber:
                  row.ItemNumber === undefined ||
                  row.ItemNumber === 'undefined' ||
                  String(row.ItemNumber) === ''
                    ? 'none'
                    : row.ItemNumber,
            };
            if (charList !== undefined && charList !== null) {
                charList.push(char);
                charMap.set(row.Item, charList);
            } else {
                charList = [];
                charList.push(char);
                charMap.set(row.Item, charList);
            }
        });

        return charMap;
    }

    static mergeMaps(map1: Map<any, any>, map2: Map<any, any>): Map<any, any> {
        for (const [key, value] of Object.entries(map2)) {
            map1.set(key, value);
        }
        return map1;
    }

    static resolveAddressId(EAID: string, addressId: string) {
        return EAID && EAID != "None" ? EAID : addressId;
    }

    static createExistingChildOffersMap(response: any) {
        let existingChildOffersMap = new Map();
        response.cartItem.forEach((tloItem: any) => {
            const tloId = tloItem.productOffering.id;
            existingChildOffersMap.set(tloId, new Map());
            const uniqueSloIds = tloItem.cartItem
              .map((sloItem: any) => sloItem.productOffering.id)
              .filter((sloId: any, index: any, self: any) => self.indexOf(sloId) == index);
            uniqueSloIds.forEach((sloId: any) => {
                const sloIdCount = tloItem.cartItem.filter(
                  (item: any) => item.productOffering.id == sloId,
                ).length;
                existingChildOffersMap.get(tloId).set(sloId, sloIdCount);
            });
        });

        return existingChildOffersMap;
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
        test('flag to be truthy', flag, AssertionModes.strict).is(true,'flag should be truthy')
        //expect(flag, errorMessage).toBeTruthy();
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
        test('flag to be truthy', flag, AssertionModes.strict).is(true,'flag should be truthy')
        //expect(flag, errorMessage).toBeTruthy();
    }

    static checkIfHasShippmentOrder(response: any) {
        let flag = false;
        for (let i = 0; i < response.cartItem.length; i++) {
            if (
              String(response.cartItem[i].product.name).toLowerCase() === 'shipment'
            ) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    static getCategoriesFromTable(table: any) {
        let categoryList: any[] = [];
        table.forEach((row: any) => {
            const category = Common.getBootstrapIfExists(row.CategoryId);
            categoryList.push(category);
        });
        return categoryList;
    }

    static getBootstrapIfExists(defaultValue: any) {
        return defaultValue[0] === '@'
          ? preconditionContext().getBootstrapData(defaultValue.slice(1))
          : defaultValue;
    }

    static getPromotionMapFromTable(table: any): Map<string, string> {
        let promotionMap = new Map<string, string>();
        table.forEach(({DiscountId, OfferId}: {DiscountId: any, OfferId: any}) => {
            promotionMap.set(DiscountId, OfferId);
        });
        return promotionMap;
    }

    static getCharListFromValidationTable(table: any) {
        let charList: any[] = [];
        table.forEach((row: any) => {
            let char = row.Name;
            charList.push(char);
        });
        return charList;
    }

    static validateCartItemChars(cartItems: any[], charMap: any) {
        for (let cartItemId of charMap.keys()) {
            let cartItemToCheck = cartItems.find(
              (item) => item.productOffering.id == cartItemId,
            );
            test('expected shopping cart to contain the item',cartItemToCheck,AssertionModes.strict)
              .isnot(undefined,`Error response is received due to cart item ${cartItemId}, expected shopping cart to contain the item, but does not.`)


            if (cartItemToCheck) {
                const {name, value} = {...charMap.get(cartItemId)}['0'];
                let isCharUpdated = false;
                let actualValue;
                cartItemToCheck.product.characteristic.forEach((char: any) => {
                    if (char.name == name) {
                        actualValue = char.value;
                        isCharUpdated = char.value == value;
                    }
                });
                test(`expected item ${cartItemId} to contain it with value ${value}`,isCharUpdated,AssertionModes.strict)
                  .isnot(undefined,`Error response is received due to char ${name}, expected item ${cartItemId} to contain it with value ${value}, got value ${actualValue} instead.`)
            }
        }
    }

    static validateCartItemPrice(cartItem: any) {
        const {error, value} = priceSchema.validate(cartItem.itemPrice);
        if (error) {
            return {
                valid: false,
                error,
            };
        }
        return {
            valid: true,
            error: null,
        };
    }

    static validateCartItemPriceAlteration(cartItem:any) {
        const {error, value} = priceAlterationSchema.validate(
          cartItem.itemPrice.priceAlteration,
        );
        if (error) {
            return {
                valid: false,
                error,
            };
        }
        return {
            valid: true,
            error: null,
        };
    }

    // UPD: parse parameters table
    static getParamsListFromTable(table: any) {
        let paramsList: Array<any> = [];
        table.forEach((row: any) => {
            let param = Common.getBootstrapIfExists(row.ParameterName);
            paramsList.push(param);
        });
        return paramsList;
    }

    static getChildOfferMapFromTable(table: any, topOffer?: string) {
        let offerMap = new Map<string, Array<string>>();
        table.forEach((row: any) => {
            let offerList: any[] = [];
            offerList = offerMap.get(row.Parent)!;
            let offer = {
                OfferId: String(row.OfferId) === 'any' ? topOffer : row.OfferId,
                Parent: row.Parent,
            };
            if (offerList !== undefined && offerList !== null) {
                offerList.push(offer.OfferId);
                offerMap.set(offer.Parent, offerList);
            } else {
                offerList = [];
                offerList.push(offer.OfferId);
                offerMap.set(offer.Parent, offerList);
            }
        });
        return offerMap;
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
          .is(true,errorMessage)
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
                if (categories.includes(testData.categories.optikTVHome)) {
                    if (!counter.has(testData.categories.optikTVHome)) {
                        counter.set(testData.categories.optikTVHome, 1);
                    } else {
                        counter.set(
                          testData.categories.optikTVHome,
                          counter.get(testData.categories.optikTVHome) + 1,
                        );
                    }
                    if (
                      String(cartItem.action) === 'Add' ||
                      String(cartItem.action) === '-'
                    ) {
                        addForTV = addForTV + 1;
                    }
                } else if (categories.includes(testData.categories.telusConnectivity)) {
                    if (!counter.has(testData.categories.telusConnectivity)) {
                        counter.set(testData.categories.telusConnectivity, 1);
                    } else {
                        counter.set(
                          testData.categories.telusConnectivity,
                          counter.get(testData.categories.telusConnectivity) + 1,
                        );
                    }
                    if (
                      String(cartItem.action) === 'Add' ||
                      String(cartItem.action) === '-'
                    ) {
                        addFortelusConnectivity = addFortelusConnectivity + 1;
                    }
                } else if (categories.includes(testData.categories.voicePlans)) {
                    if (!counter.has(testData.categories.voicePlans)) {
                        counter.set(testData.categories.voicePlans, 1);
                    } else {
                        counter.set(
                          testData.categories.voicePlans,
                          counter.get(testData.categories.voicePlans) + 1,
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
                            testData.characteristics.proInstall,
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
            if (counter.get(testData.categories.optikTVHome) === 1) {
                workOrderCount = workOrderCount + 1;
            }
        }
        if (addForPhone === 1) {
            if (counter.get(testData.categories.voicePlans) === 1) {
                workOrderCount = workOrderCount + 1;
            }
        }
        if (addFortelusConnectivity === 1) {
            if (counter.get(testData.categories.telusConnectivity) === 1) {
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

    static getWorkOrdersCount(response: any) {
        let expectedWorkOrderCount = { count: 0, action: "" };
        response.cartItem.forEach((cartItem: any) => {
            if (cartItem.product.name === "Work Offer") {
                // console.log('WORK OFFER WAS FOUND');
                //console.log(JSON.stringify(cartItem));
                expectedWorkOrderCount.count = cartItem.cartItem.length;
                expectedWorkOrderCount.action = cartItem.action;
            }
        });
        return expectedWorkOrderCount;
    }

    static validateCustomRuleParameters(errorItem: any) {
        // const { error, value } = customRuleParametersSchema.validate(
        //   errorItem.customRuleParameters,
        // );
        const { error } = errorItem.customRuleParameters;
        if (error) {
            return {
                valid: false,
                error,
            };
        }
        return {
            valid: true,
            error: null,
        };
    }

}