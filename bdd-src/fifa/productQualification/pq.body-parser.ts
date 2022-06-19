import {AssertionModes, test} from "@cloudeou/telus-bdd";

export class bodyParser {

    static getActualOffers(response: any, topOffer: any) {
        let actualOffers: any;
        if (topOffer !== null && topOffer !== '' && topOffer !== undefined) {
            actualOffers = bodyParser.getChildsByProductOffering(response, topOffer);
        } else {
            actualOffers = bodyParser.getProductOfferings(response);
        }
        return actualOffers;
    }
    static getProductOfferings(response: any) {
        const offers: any = [];
        if (response == null) {
            return '';
        }
        response.productOfferingQualificationItem.forEach((item: any) => {
            offers.push(item.productOffering.id);
        });
        return offers;
    }
    static getChildsByProductOffering(response: any, productOfferingId: string):Array<any> | null {
        const childs:Array<any> = [];
        if (response == null) {
            return null;
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
    static validateAcutalOffersContainOffers(
        actualOffers: any[],
        productOfferingList: any[],
    ) {
        productOfferingList.forEach((offer) => {
            test(
                'Offers in response',
                actualOffers.includes(offer),
                AssertionModes.strict,
            ).is(true,'Response is not contain offers');
        });
    }
    static getProductOfferingObjects(response: any) {
        const offers: any = [];
        if (response == null) {
            return '';
        }
        response.productOfferingQualificationItem.forEach((item: any) => {
            offers.push(item.productOffering);
        });
        return offers;
    }

}