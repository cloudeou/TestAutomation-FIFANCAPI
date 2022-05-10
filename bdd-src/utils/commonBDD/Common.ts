import { skipScenario, featureContext, test, AssertionModes } from '@cloudeou/telus-bdd';
import PreconditionContext from "../../../bdd/contexts/ngc/PreconditionContext";
import { Identificators } from "../../../bdd/contexts/Identificators";

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

}