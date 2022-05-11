import { data } from "../../../test-data/test.data";
export class bodySamples {
     static charItem(
         charContainter: any
     ) {
        return {
            name: charContainter.name,
            value: charContainter.value,
        };
    }

    static getOffering(productOfferingId: any, categoryList?: any, prodSpecCharValueUse?: any) {
        let offering;
        if (productOfferingId) {
            offering = {
                id: productOfferingId,
            };
        } else if (categoryList) {
            offering = {
                category: categoryList,
                prodSpecCharValueUse: prodSpecCharValueUse
                    ? prodSpecCharValueUse
                    : undefined,
            };
        }
        return offering;
    }

    getProductQual(
        productOfferingId: any,
        commitmentId: any,
        categoryList?: any,
        prodSpecCharValueUse?: any,
    ) {
        let qual = [];
        if (
            categoryList !== undefined &&
            categoryList !== 'undefined' &&
            categoryList !== null
        ) {
            qual.push({
                id: '1',
                productOffering: bodySamples.getOffering(
                    null,
                    categoryList,
                    prodSpecCharValueUse,
                ),
            });
        }
        if (
            productOfferingId !== undefined &&
            productOfferingId !== 'undefined' &&
            productOfferingId !== null
        ) {
            qual.push({
                id: qual.length == 1 ? '2' : '1',
                productOffering: bodySamples.getOffering(productOfferingId, null, null),
                qualificationItemRelationship: [
                    {
                        type: 'bundledProductOffering',
                    },
                ],
            });
        }
        if (
            commitmentId !== undefined &&
            commitmentId !== 'undefined' &&
            commitmentId !== null
        ) {
            qual.push({
                id: qual.length == 2 ? '3' : '2',
                productOffering: bodySamples.getOffering(commitmentId, null, null),
                qualificationItemRelationship: [
                    {
                        type: 'withItem',
                        id: '1',
                    },
                ],
            });
        }
        return qual;
    }


    getCategoryItem(categoryId: any) {
        return {
            id: categoryId,
        };
    }


    getProductQualification(
        customerCategory: any,
        distributionChannel: any,
        externalLocationId: any,
        productOfferingId?: any,
        categoryList?: any,
        charItems?: any,
        commitmentId?: any,
        shoppingCartId?: any,
    ) {
        const isDistChanExtId = !Object.values(
            data.distributionChannel,
        ).includes(distributionChannel);
        const id = shoppingCartId ? {id: shoppingCartId} : undefined;
        return {
            relatedParty: [
                {
                    role: 'customer',
                    characteristic: [
                        {
                            name: 'category',
                            value: customerCategory,
                        },
                    ],
                },
            ],
            channel: {
                id: distributionChannel,
                '@referenceType': isDistChanExtId ? 'External_ID' : undefined,
            },
            place: {
                id: externalLocationId,
                role: 'service address',
            },
            productOfferingQualificationItem: this.getProductQual(
                productOfferingId,
                commitmentId,
                categoryList,
                charItems,
            ),
            shoppingCart : id
        };
    }
}