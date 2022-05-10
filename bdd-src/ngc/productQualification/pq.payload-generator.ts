import {bodySamples} from "./pq.body-samples";

const bodySample = new bodySamples();

export class PayloadGenerator {
    customerCategory: any;
    distributionChannel: any;
    externalLocationId: any;
    categoryList: any;
    productOfferingId?: any;
    charList?: any;
    commitmentId?: any;
    shoppingCartId?: any;

    constructor(
        customerCategory: any,
        distributionChannel: any,
        externalLocationId: any,
        categoryList: any,
        productOfferingId?: any,
        charList?: any,
        commitmentId?: any,
        shoppingCartId?: any,
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

    generateCategoryItemList(categoryList: any): any {
        let categoryItemList: any = [];
        if (categoryList == null || categoryList == undefined) {
            return null;
        }
        categoryList.forEach((categoryId: any) => {
            let categoryItem: any = bodySample.getCategoryItem(categoryId);
            categoryItemList.push(categoryItem);
        });
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


