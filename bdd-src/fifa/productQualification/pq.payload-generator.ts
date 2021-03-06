import {bodySamples} from "./pq.body-samples";

const bodySample = new bodySamples();

export class PayloadGenerator {
    customerCategory: string | null;
    distributionChannel: string | null;
    externalLocationId: string| number | null;
    categoryList: Array<string> | null;
    productOfferingId?: string | null;
    charList?: any;
    commitmentId?: string | null;
    shoppingCartId?: string | null;

    constructor(
        customerCategory: string | null,
        distributionChannel: string | null,
        externalLocationId: string | number | null,
        categoryList: Array<string> | null,
        productOfferingId?: string | null | undefined,
        charList?: string | null,
        commitmentId?: string | null | undefined,
        shoppingCartId?: string | null | undefined,
    ) {
        this.productOfferingId = productOfferingId;
        this.charList = charList;
        this.categoryList = categoryList;
        this.customerCategory = customerCategory;
        this.distributionChannel = distributionChannel;
        this.externalLocationId = externalLocationId;
        this.commitmentId = commitmentId;
        this.shoppingCartId = shoppingCartId;
    }

    generateCategoryItemList(categoryList: Array<string> | null): Array<string> {
        let categoryItemList: Array<string> = [];
        if (categoryList) {
            categoryList.forEach((categoryId: string) => {
                let categoryItem: any = bodySample.getCategoryItem(categoryId);
                categoryItemList.push(categoryItem);
            });
        }
        return categoryItemList;
    }


    generateBody(): { [key: string]: any } {

        let body;
        let charItems = this.generateCharsItem(this.charList);

        body = bodySample.getProductQualification(
            this.customerCategory,
            this.distributionChannel,
            this.externalLocationId,
            this.productOfferingId,
            this.generateCategoryItemList(this.categoryList),
            charItems,
            this.commitmentId,
            this.shoppingCartId
        );
        return body;

    }

    generateCharsItem(charList: any): any {

        let charItems: any = [];
        if (charList == null || charList == undefined) {
            return null;
        }
        charList.forEach((charContainer: any) => {
            let charItem: any = bodySamples.charItem(charContainer);
            charItems.push(charItem);
        });
        return charItems;
    }
}



