import ProductCatalogContext from "../../contexts/ngc/ProductCatalogContext";
import ResponseContext from "../../contexts/ngc/ResponseConntext";
import ProductQualificationContext from "../../contexts/ngc/ProductQualificationContext";
import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import {Identificators} from "../../contexts/Identificators";
import {Common} from "../../../bdd-src/utils/commonBDD/Common";
import PreconditionContext from "../../contexts/ngc/PreconditionContext";
import {ProductCatalogApi} from "../../../bdd-src/ngc/productCatalog/pc.api";
import {ProductQualificationApi} from "../../../bdd-src/ngc/productQualification/pq.api";
import {bodyParser} from "../../../bdd-src/ngc/productQualification/pq.body-parser";


type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

export const productQualificationSteps = ({ when, and, then}: { [key: string]: step }) => {

    const productCatalogContext = (): ProductCatalogContext =>
        featureContext().getContextById(Identificators.ProductCatalogContext);
    const ResponseContext = (): ResponseContext =>
        featureContext().getContextById(Identificators.ResponseContext);
    const ProductQualificationContext = (): ProductQualificationContext =>
        featureContext().getContextById(Identificators.ProductQualificationContext);
    const PreconditionContext = (): PreconditionContext =>
        featureContext().getContextById(Identificators.preConditionContext);
    const fifaNcApi = new ProductQualificationApi();
    // todo: re-comment after add shopping cart api
    // const shoppingCartContext = (): ShoppingCartContext =>
    //     featureContext().getContextById(Identificators.shoppingCartContext);

    and(/^user filter by the following product offering id: (.*)$/, (offerId) => {
        console.log('hihihi');
        ProductQualificationContext().setproductOfferingId(offerId);
    });

    and(
        /^user try to get list of the qualified offers by the following commitment id: (.*)$/,
        (commitmentId: string) => {
            console.log('hihihi');
            ProductQualificationContext().setCommitmentId(commitmentId);
        },
    );

    when('user try to get qualified product offering list', async () => {
        let externalLocationId = PreconditionContext().getAddressId();
        let distributionChannel = PreconditionContext().getDistributionChannel();
        let distributionChannelExternalId = PreconditionContext().getDistributionChannelExternalId();
        let customerCategory = PreconditionContext().getCustomerCategory();
        let productOfferingId = ProductQualificationContext().getproductOfferingId();
        let categoryList = ProductQualificationContext().getCategoryList();
        let charList = ProductQualificationContext().getCharList();
        let commitmentId = ProductQualificationContext().getCommitmentId();

        let distChannelOption = Common.resolveAddressId(
            distributionChannelExternalId,
            distributionChannel,
        );
        ProductQualificationContext().reset();
        // externalLocationId, null, selectedOffers, null, null);
        try {
            const pqResponse: { [key: string]: any } = await fifaNcApi.productQualification({
                categoryList,
                charList,
                commitmentId,
                customerCategory,
                distributionChannel,
                externalLocationId,
                productOfferingId,
            });

            Common.checkValidResponse(pqResponse, 200);
            const response = pqResponse.data;
            const responseText = JSON.stringify(response, null, '\t');
            test(
                'Response should contain productOfferingQualificationItem',
                response.productOfferingQualificationItem,
                AssertionModes.strict
            ).isnot(undefined, 'Response should not contain productOfferingQualificationItem');
            ResponseContext().PQresponse(response);
            if (productOfferingId !== null && productOfferingId !== undefined) {
                console.debug('Prod Offer ID' + productOfferingId);
            }
            let topOffer = bodyParser.getProductOfferings(response)[0];
            // todo: re-comment after add shopping cart api
            // shoppingCartContext().setTopOffer(topOffer);
        }
        catch (error){
            throw error;
        }

    });

    // then(
    //     /^list of the following product offerings should be available:$/,
    //     (table) => {
    //         let response: any;
    //         response = ResponseContext().PQresponse();
    //         console.log(
    //             'Returned offerings:' +
    //             response.productOfferingQualificationItem.length,
    //         );
    //         // todo: re-comment after add shopping cart api
    //         // let topOffer = shoppingCartContext().getTopOffer();
    //         let actualOffers: any;
    //         try {
    //             actualOffers = bodyParser.getActualOffers(response, topOffer);
    //         } catch (err) {
    //             actualOffers = bodyParser.getProductOfferings(response);
    //         }
    //         // todo: re-comment after add shopping cart api
    //         // shoppingCartContext().setAvailableOffers(actualOffers);
    //         // let productOfferingList = Common.getOffersFromTable(
    //         //     table,
    //         //     shoppingCartContext,
    //         // );
    //         bodyParser.validateAcutalOffersContainOffers(
    //             actualOffers,
    //             productOfferingList,
    //         );
    //     },
    // );
    and(/^validate product offering parameters should contain:$/, (table) => {
        let response: any;
        let productOfferings: any; //Array<any> | string; return type of getProductOfferings???
        let paramsToCheck: Array<any>;
        let descriptionIsPresent: boolean = false;
        response = ResponseContext().PQresponse();
        productOfferings = bodyParser.getProductOfferingObjects(response);
        paramsToCheck = Common.getParamsListFromTable(table);
        productOfferings.forEach((productOffering: any) => {
            paramsToCheck.forEach((param: any) => {
                if (param === 'description') {
                    if (productOffering.description) descriptionIsPresent = true;
                } else {
                    test('Response must contain parameter',
                        productOffering[param],
                        AssertionModes.strict,
                    ).isnot(undefined, 'Error response is received due to productOffring parameter, but expected param to be defined')
                    test('Response must contain not null parameter',
                        productOffering[param],
                        AssertionModes.strict,
                    ).isnot(null,'Response contain null parameter');
                }
            });
        });
        if (paramsToCheck.includes('description')) {
            test('test productOffring description',
                descriptionIsPresent,
                AssertionModes.strict,
            ).is(true,`Error response is received due to productOffring description to be defined at least one productOffering`);
        }

        // and('validate product offering price', () => {
        //     let response: any;
        //     let productOfferings: any;
        //     response = ResponseContext().PQresponse();
        //     productOfferings = bodyParser.getProductOfferingObjects(response);
        //     productOfferings.forEach((productOffering) => {
        //         let priceIsValid = Common.validateProductOfferingPrice(productOffering);
        //         expect(
        //             priceIsValid.valid,
        //             `Error response is received due to productOffering: ${priceIsValid.error}`,
        //         ).toBeTruthy();
        //     });
        // });
    });

}