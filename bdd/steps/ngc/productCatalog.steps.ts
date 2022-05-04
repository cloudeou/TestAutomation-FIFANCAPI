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
        console.log('tryuiopp')
        let productOfferingList: Array<String> = Common.getOffersFromTable(
            table,
            productCatalogContext,
        );
        productCatalogContext().setRequestedItems(productOfferingList);
    })

    when('user try to retrieve offer details', async ()=>{
        let offerList: Array<String> = productCatalogContext().getRequestedItems();
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
            //todo .toContain()
            test('PC items should be in response',
                requestedItems.includes(detItem.id),
                AssertionModes.strict,
            ).is(true, `PC Item ${detItem.id} had not been requested but was received in response.`);
            responseItemIds.push(detItem.id);
            productCatalogContext().setResponsedItem(detItem.id, detItem);
        });
        requestedItems.forEach((id) => {
            //todo .toContain()
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
}