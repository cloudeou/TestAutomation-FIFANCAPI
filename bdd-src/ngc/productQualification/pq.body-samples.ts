import { data } from "../../../test-data/data";
export class bodySamples {
     static charItem(
         charContainter: any
     ) {
        return {
            name: charContainter.name,
            value: charContainter.value,
        };
    }

    static getOffering(productOfferingId: string| null, categoryList?: string | null, prodSpecCharValueUse?: string | null) {
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
        productOfferingId?: string | null,
        commitmentId?: string | null,
        categoryList?: any,
        prodSpecCharValueUse?: string,
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


    getCategoryItem(categoryId: string) {
        return {
            id: categoryId,
        };
    }


    getProductQualification(
        customerCategory: string | null,
        distributionChannel: string | null,
        externalLocationId: string | number | null,
        productOfferingId?: string | null | undefined,
        categoryList?: any,
        charItems?: any,
        commitmentId?: string | null | undefined,
        shoppingCartId?: string | null | undefined,
    ) {
        let isDistChanExtId: any;
        if (distributionChannel != null) {
            isDistChanExtId = !Object.values(
                data.distributionChannel,
            ).includes(distributionChannel);
        }
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