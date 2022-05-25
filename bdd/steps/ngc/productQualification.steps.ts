import ProductCatalogContext from "../../contexts/ngc/ProductCatalogContext";
import ResponseContext from "../../contexts/ngc/ResponseConntext";
import ProductQualificationContext from "../../contexts/ngc/ProductQualificationContext";
import ShoppingCartContext from "../../contexts/ngc/ShoppingCartContext";
import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import {Identificators} from "../../contexts/Identificators";
import {Common} from "../../../bdd-src/utils/commonBDD/Common";
import PreconditionContext from "../../contexts/ngc/PreconditionContext";
import {ProductQualificationApi} from "../../../bdd-src/ngc/productQualification/pq.api";
import {bodyParser} from "../../../bdd-src/ngc/productQualification/pq.body-parser";
import {AxiosResponse} from "axios";


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
    const shoppingCartContext = (): ShoppingCartContext =>
        featureContext().getContextById(Identificators.shoppingCartContext);

    and(/^user filter by the following product offering id: (.*)$/, (offerId) => {
        console.log('hihihi');
        ProductQualificationContext().productOfferingId = offerId;
    });

    and(
        /^user try to get list of the qualified offers by the following commitment id: (.*)$/,
        (commitmentId: string) => {
            console.log('hihihi');
            ProductQualificationContext().commitmentId = commitmentId;
        },
    );

    when('user try to get qualified product offering list', async () => {
        let externalLocationId = PreconditionContext().addressId;
        let distributionChannel = PreconditionContext().distributionChannel;
        let distributionChannelExternalId = PreconditionContext().distributionChannelExternalId;
        let customerCategory = PreconditionContext().customerCategory;
        let productOfferingId = ProductQualificationContext().productOfferingId;
        let categoryList = ProductQualificationContext().categoryList;
        let charList = ProductQualificationContext().charList;
        let commitmentId = ProductQualificationContext().commitmentId;

        let distChannelOption = Common.resolveAddressId(
            distributionChannelExternalId,
            distributionChannel,
        );
        ProductQualificationContext().reset();
        // externalLocationId, null, selectedOffers, null, null);
        try {
            const pqResponse: AxiosResponse = await fifaNcApi.productQualification({
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
            ResponseContext().productQualifcationResponse = response;
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

    then(
        /^list of the following product offerings should be available:$/,
        (table) => {
            let response = ResponseContext().productQualifcationResponse;
            console.log(
                'Returned offerings:' +
                response.productOfferingQualificationItem.length,
            );

            let topOffer = shoppingCartContext().topOffer;
            let actualOffers: any;
            try {
                actualOffers = bodyParser.getActualOffers(response, topOffer);
            } catch (err) {
                actualOffers = bodyParser.getProductOfferings(response);
            }
            shoppingCartContext().availableOffers = actualOffers;
            let productOfferingList = Common.getOffersFromTable(
                table,
                shoppingCartContext,
            );
            bodyParser.validateAcutalOffersContainOffers(
                actualOffers,
                productOfferingList,
            );
        },
    );

    and(
      /^validate product offering characteristics should contain:$/,
      (table) => {
          let response= ResponseContext().productQualifcationResponse
          let productOfferings: any; //Array<any> | string; return type of getProductOfferings???
          let charsToCheck: Array<any>;
          productOfferings = bodyParser.getProductOfferingObjects(response);
          charsToCheck = Common.getCharListFromValidationTable(table);
          productOfferings.forEach((productOffering: any) => {
              charsToCheck.forEach((char) => {
                  const charInItem = productOffering.prodSpecCharValueUse.find(
                    (c: any) => c.name === char,
                  );

                  test('but expected ${charInItem.name} to be defined',charInItem.value, AssertionModes.strict)
                    .isnot(undefined,`Error response is received due to productOffering char ${charInItem.name} is ${charInItem.value}, but expected ${charInItem.name} to be defined`)
                  test('expected ${charInItem.name} not to be null',charInItem.value, AssertionModes.strict)
                    .isnot(null,`Error response is received due to productOffering char ${charInItem.name} is ${charInItem.value}, but expected ${charInItem.name} not to be null`)
              });
          });
      },
    );

    and(/^validate all product offerings have categories:$/, (table) => {
      let response = ResponseContext().productQualifcationResponse;
      let productOfferings: any;
      let categoryIds: Array<any>;
      productOfferings = bodyParser.getProductOfferingObjects(response);
      categoryIds = Common.getCategoriesFromTable(table);
      productOfferings.forEach((productOffering: any) => {
        categoryIds.forEach((id) => {

          test(`expected all product offerings to contain category ${id}`, JSON.stringify(productOffering.category)===JSON.stringify({ id }), AssertionModes.strict)
            .is(true,`Error response is received due to productOffering, expected all product offerings to contain category ${id}, but offering ${productOffering.id} doesn't contain it.`)
         /* expect(
            productOffering.category,
            `Error response is received due to productOffering, expected all product offerings to contain category ${id}, but offering ${productOffering.id} doesn't contain it.`,
          ).toContainEqual({ id });*/
        });
      });
    });

  and(/^validate at least one product offering has categories:$/, (table) => {
    let response = ResponseContext().productQualifcationResponse;
    let productOfferings: any;
    let categoryIds: Array<any>;
    productOfferings = bodyParser.getProductOfferingObjects(response);
    categoryIds = Common.getCategoriesFromTable(table);
    categoryIds.forEach((id) => {
      let atLeastOneHasCat = false;
      productOfferings.forEach((productOffering: any) => {
        if (productOffering.category.find((c: any) => c.id == id))
          atLeastOneHasCat = true;
      });
      test(`expected at least one product offering to contain category ${id}`, atLeastOneHasCat, AssertionModes.strict)
        .is(true,`Error response is received due to productOffering, expected at least one product offering to contain category ${id}, but none of offerings contains it`)
    });
  });

    and('user filter by the following categories:', (table) => {
        ProductQualificationContext().categoryList = Common.getCategoriesFromTable(table);
      });

    and(/^validate product offering parameters should contain:$/, (table) => {
        let response = ResponseContext().productQualifcationResponse;
        let productOfferings: any; //Array<any> | string; return type of getProductOfferings???
        let paramsToCheck: Array<any>;
        let descriptionIsPresent: boolean = false;
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
        //     response = ResponseContext()productQualifcationResponse;
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