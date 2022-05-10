import { skipScenario, featureContext, test, AssertionModes } from '@cloudeou/telus-bdd';
import PreconditionContext from "../../../bdd/contexts/ngc/PreconditionContext";
import { Identificators } from "../../../bdd/contexts/Identificators";
import {RandomValueGenerator} from "../common/RandomValueGenerator";

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
    static checkValidResponse(success: any, statusCode?: any) {
        test('Response should not be empty', success, AssertionModes.strict ).isnot(null,'Response is empty');
        test('Response field should be present',  success.res, AssertionModes.strict).isnot(null,'Response is not present');
        test('Response should contain body', success.data, AssertionModes.strict).isnot(null,'Response is not contain body');
        //test('Actual result', success,AssertionModes.strict).isnot(null,'Response should contain body')
        if (statusCode !== undefined) {
            test('Status code',
                success.status, AssertionModes.strict).is(statusCode, `statusCode should be statusCode`)
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
    // static getBootstrapIfExists(defaultValue: any) {
    //     return defaultValue[0] === '@'
    //         ? preconditionContext().getBootstrapData(defaultValue.slice(1))
    //         : defaultValue;
    // }
    static IsItemQualified(qItem: any, body: any) {
        console.log("inside IsItemQualified")
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
    static resolveAddressId(EAID: any, addressId: any) {
        console.log('inside resolveAddressId')
        return EAID && EAID != 'None' ? EAID : addressId;
    }
    static getParamsListFromTable(table: any) {
        let paramsList: any = [];
        table.forEach((row: any) => {
            paramsList.push(row);
        });
        return paramsList;
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
    static mergeMaps(map1: Map<any, any>, map2: Map<any, any>): Map<any, any> {
        for (const [key, value] of Object.entries(map2)) {
            map1.set(key, value);
        }
        return map1;
    }
}