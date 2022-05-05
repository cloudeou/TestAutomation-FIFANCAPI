import {skipScenario, featureContext, test, AssertionModes} from '@cloudeou/telus-bdd';
import {RandomValueGenerator} from '../common/RandomValueGenerator';
import {bodyParser} from "../../ngc/shopping-cart-tmf/shopping-cart-tmf.body-parser";

export class Common {
    static getOffersFromTable(table: any, shoppingCartContext: any) {
        let productOfferingList: Array<any> = [];
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
    static checkValidResponse(success: any, statusCode?: any) {
        test('Actual result', success, AssertionModes.strict ).isnot(null,'Response should not be empty');
        test('Actual result',  success.response, AssertionModes.strict).isnot(null,'Response field should be present');
        test('Actual result', success.response.body, AssertionModes.strict).isnot(null,'Response should contain body');
        test('Actual result', success.response.body,AssertionModes.strict).isnot(null,'Response should contain body')
        if (statusCode !== undefined) {
            test(`statusCode should be ${statusCode + JSON.stringify(success, null, '\t')}`,
                success.response.statusCode, AssertionModes.strict ).is(statusCode, `statusCode should be ${statusCode + JSON.stringify(success, null, '\t')}`)
        }
        return true;
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
}