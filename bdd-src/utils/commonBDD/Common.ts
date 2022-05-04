import {skipScenario, featureContext, test, AssertionModes} from '@cloudeou/telus-bdd';

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
        test('Actual result', success, AssertionModes.strict ).isnot(null,'Response should not be empty');
        test('Actual result',  success.response, AssertionModes.strict).isnot(null,'Response field should be present');
        test('Actual result', success.response.body, AssertionModes.strict).isnot(null,'Response should contain body');
        test('Actual result', success.response.body,AssertionModes.strict).isnot(null,'Response should contain body')
        if (statusCode !== undefined) {
            test('Actual result',
                success.response.statusCode, AssertionModes.strict).is(statusCode, `statusCode should be ${statusCode + JSON.stringify(success, null, '\t')}`)
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
}