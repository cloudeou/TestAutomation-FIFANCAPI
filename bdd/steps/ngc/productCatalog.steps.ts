import { ProductCatalogApi } from "../../../bdd-src/ngc/productCatalog/pc.api";
import { Common } from "../../../bdd-src/utils/commonBDD/Common";
import ProductCatalogContext from "../../contexts/ngc/ProductCatalogContext";
import ResponseContext from "../../contexts/ngc/ResponseConntext"
import { Identificators } from "../../contexts/Identificators";
import { AssertionModes, featureContext, test } from "@cloudeou/telus-bdd";

type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

export const productCatalogSteps = ({ when, and, then}: { [key: string]: step }) => {
    const productCatalogContext = (): ProductCatalogContext =>
        featureContext().getContextById(Identificators.ProductCatalogContext);
    const ResponseContext = (): ResponseContext =>
        featureContext().getContextById(Identificators.ResponseContext);

    const fifaNcApi = new ProductCatalogApi();

    and('user set list of offers:', (table) => {
        console.log('inside select step')
        let productOfferingList: Array<String> = Common.getOffersFromTable(
            table,
            productCatalogContext,
        );
        console.log(productOfferingList);
        console.log('set context');
        productCatalogContext().setRequestedItems(productOfferingList);
        console.log(productCatalogContext().getRequestedItems())
    })

    when('user try to retrieve offer details', async ()=>{
        let offerList: Array<String> = productCatalogContext().getRequestedItems();
        console.log(`inside first validate`);
        console.log('context');
        console.log(offerList);
        try{
            const pcResponse = await fifaNcApi.requestProductCatalog(offerList);
            console.log(JSON.stringify(pcResponse));
            Common.checkValidResponse(pcResponse, 200);
            const response = JSON.parse(pcResponse.data);
            test('Validate response',response,AssertionModes.strict).isnot([], 'Error has occured due to PC API call received an empty array.');
            response.forEach((detItem: any) => {
                test('Response must to be defined',
                    detItem.id,
                    AssertionModes.strict
                ).isnot(undefined, 'Error has occured due to offer details item id is not defined.');
            });
            ResponseContext().PCresponse(response);
        }
        catch(error: any) {
            test('Error Message', error, AssertionModes.strict).isnot(undefined, `Error response is received: \n ${JSON.stringify(error)}`);
            console.log('ERROR:',error);
        }
    })

    then('list of offer details should be returned', () => {
        const PCreponse: Array<any> = Array.from(
            <any>ResponseContext().PCresponseBody(),
        );
        const requestedItems: Array<String> = productCatalogContext().getRequestedItems();
        console.log(requestedItems);
        const responseItemIds: Array<String> = [];
        PCreponse.forEach((detItem) => {
            test('PC items should be in response',
                requestedItems.includes(detItem.id),
                AssertionModes.strict,
            ).is(true, `PC Item ${detItem.id} had not been requested but was received in response.`);
            responseItemIds.push(detItem.id);
            productCatalogContext().setResponsedItem(detItem.id, detItem);
        });
        requestedItems.forEach((id) => {
            test(
                'requestedItems should contain id',
                responseItemIds.includes(id),
               AssertionModes.strict,
            ).is(true, `PC item ${id} had been requested, but was not received in response.`);
        });
        test(
            'Response contain length',
            responseItemIds.length,
            AssertionModes.strict,
        ).is(requestedItems.length,`Expected to receive ${requestedItems.length} in response, but got ${responseItemIds.length}.`);
    })
    and('user validate attachment attributes:', (table) => {
        let response: any;
        let attrToCheck: Array<any>;
        response = ResponseContext().PCresponse();
        attrToCheck = Common.getAttrsListFromTable(table);
        response.forEach((offer: any) => {
            attrToCheck.forEach((attr) => {
                const attrInAttach = offer.attachment.find((a: any) => a.name === attr);
                test('attrInAttach is defined',
                    attrInAttach,
                    AssertionModes.strict,
                ).isnot(undefined,`Error response is received due to attachment attribute ${attr}, expected to be defined at offer ${offer.id}`);
                test('attrInAttach.content is defined',
                    attrInAttach.content,
                    AssertionModes.strict,
                ).isnot(undefined,`Error response is received due to attachment attribute ${attrInAttach.name}, it's content is ${attrInAttach.content}, expected to be defined`);
                test('attrInAttach.content not null',
                    attrInAttach.content,
                    AssertionModes.strict,
                ).isnot(null,`Error response is received due to attachment attribute ${attrInAttach.name}, it's content is ${attrInAttach.content}, expected not to be null`);
            });
        });
    });

    and('user validate at least one attachment has attributes:', (table) => {
        let response: any;
        let attrToCheck: Array<any>;
        response = ResponseContext().PCresponse();
        attrToCheck = Common.getAttrsListFromTable(table);
        attrToCheck.forEach((attrName) => {
            let isAttrDefined = response.find((offer: any) =>
                offer.attachment.find((attr: any) => attr.name === attrName),
            );
            test('isAttrDefined is defined',
                isAttrDefined,
                AssertionModes.strict,
            ).isnot(undefined,`Error response is received due to attachment attribute ${attrName}, expected to be defined at least in one offer`);
        });
    });

    and('user validate offers attributes:', (table) => {
        let response: any;
        let attrToCheck: Array<any>;
        let propsInCat: boolean;

        response = ResponseContext().PCresponse();
        attrToCheck = Common.getAttrsListFromTable(table);
        response.forEach((offer: any) => {
            attrToCheck.forEach((attr) => {
                test('Attribute of offer is defined',
                    offer[attr],
                    AssertionModes.strict,
                ).isnot(undefined,`Error response is received due to offer attribute ${offer[attr]}, but expected ${attr} to be defined`);
                test('Attribute of offer is not null',
                    offer[attr],
                    AssertionModes.strict,
                ).isnot(null,`Error response is received due to offer attribute ${offer[attr]}, but expected ${attr} not to be null`);
                if (attr === 'category') {
                    test('Length of attribute more then 1',
                        (offer[attr].length > 1),
                        AssertionModes.strict,
                    ).is(true,`Error response is received due to offer attribute ${offer[attr]}, expected ${offer[attr]} contain at least one element`);
                    propsInCat = Common.checkIfCategoryContainAllProps(offer);
                    test('Category contain all props',
                        propsInCat,
                        AssertionModes.strict,
                    ).is(true,`Error response is received due to offer attribute category, expected it contain all props`);
                }
            });
        });
    });
}