import FIFA_ProductCatalogContext from "../../../contexts/fifa/FIFA_ProductCatalogContext";
import ResponseContext from "../../../contexts/fifa/FIFA_ResponseConntext";
import FIFA_ProductQualificationContext from "../../../contexts/fifa/FIFA_ProductQualificationContext";
import FIFA_ShoppingCartContext from "../../../contexts/fifa/FIFA_ShoppingCartContext";
import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import {Identificators} from "../../../contexts/Identificators";
import {Common} from "../../../../bdd-src/fifa/utils/commonBDD/Common";
import FIFA_PreconditionContext from "../../../contexts/fifa/FIFA_PreconditionContext";
import {ProductQualificationApi} from "../../../../bdd-src/fifa/productQualification/pq.api";
import {bodyParser} from "../../../../bdd-src/fifa/productQualification/pq.body-parser";
import {AxiosResponse} from "axios";
import {replacerFunc} from "../../../../bdd-src/fifa/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";


type step = (
  stepMatcher: string | RegExp,
  callback: (args: any) => void
) => void;

export const FIFA_productQualificationSteps = ({when, and, then}: { [key: string]: step }) => {

  const ResponseContext = (): ResponseContext =>
    featureContext().getContextById(Identificators.FIFA_ResponseContext);
  const ProductQualificationContext = (): FIFA_ProductQualificationContext =>
    featureContext().getContextById(Identificators.FIFA_ProductQualificationContext);
  const PreconditionContext = (): FIFA_PreconditionContext =>
    featureContext().getContextById(Identificators.FIFA_preConditionContext);
  const fifaNcApi = new ProductQualificationApi();
  const shoppingCartContext = (): FIFA_ShoppingCartContext =>
    featureContext().getContextById(Identificators.FIFA_shoppingCartContext);

  and(/^user filter by the following product offering id: (.*)$/, (offerId) => {
    ProductQualificationContext().productOfferingId = offerId;
  });

  and(
    /^user try to get list of the qualified offers by the following commitment id: (.*)$/,
    (commitmentId: string) => {
      ProductQualificationContext().commitmentId = commitmentId;
    },
  );

  when('user try to get qualified product offering list', async () => {
    try {
      let externalLocationId = PreconditionContext().addressId;
      let distributionChannel = PreconditionContext().distributionChannel;
      let distributionChannelExternalId = PreconditionContext().distributionChannelExternalId;
      let customerCategory = PreconditionContext().customerCategory;
      let productOfferingId = ProductQualificationContext().productOfferingId;
      let categoryList = ProductQualificationContext().categoryList;
      let charList = ProductQualificationContext().charList;
      let commitmentId = ProductQualificationContext().commitmentId;
      let shoppingCartId = shoppingCartContext().shoppingCartId;

      let distChannelOption = Common.resolveAddressId(
        distributionChannelExternalId,
        distributionChannel,
      );
      ProductQualificationContext().reset();
      try {
        const pqResponse: AxiosResponse = await fifaNcApi.productQualification({
          categoryList,
          charList,
          commitmentId,
          customerCategory,
          distributionChannel: distChannelOption,
          externalLocationId,
          productOfferingId,
          shoppingCartId
        });

        Common.checkValidResponse(pqResponse, 200);
        const response = pqResponse.data;
        test(
          'Response should contain productOfferingQualificationItem',
          response.productOfferingQualificationItem,
          AssertionModes.strict
        ).isnot(undefined, 'Response should not contain productOfferingQualificationItem');

        ResponseContext().PQresponse = response;

        let topOffer = bodyParser.getProductOfferings(response)[0];
        shoppingCartContext().topOffer = topOffer;
      } catch (error) {
        console.log(error);
      }
    }

    catch (e) {
      console.log(e)
    }
  });

  then(
    'list of the following product offerings should be available:',
    (table) => {
      try {
        let response = ResponseContext().PQresponse;

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
      }
      catch (e) {
        console.log(e)
      }
    },
  );

  and(
    "validate product offering characteristics should contain:",
    (table) => {
      let response = ResponseContext().PQresponse
      let productOfferings: any;
      let charsToCheck: Array<any>;
      try{
        productOfferings = bodyParser.getProductOfferingObjects(response);
        charsToCheck = Common.getCharListFromValidationTable(table);
        productOfferings.forEach((productOffering: any) => {
          charsToCheck.forEach((char) => {
            const charInItem = productOffering.prodSpecCharValueUse.find(
                (c: any) => c.name === char,
            );
            test(`but expected ${charInItem.name} to be defined`, charInItem.value, AssertionModes.strict)
                .isnot(undefined, `Error response is received due to productOffering char ${charInItem.name} is ${charInItem.value}, but expected ${charInItem.name} to be defined`)
            test(`expected ${charInItem.name} not to be null`, charInItem.value, AssertionModes.strict)
                .isnot(null, `Error response is received due to productOffering char ${charInItem.name} is ${charInItem.value}, but expected ${charInItem.name} not to be null`)
          });
        });
      }
      catch (e){
        console.log(e);
      }

    },
  );

  and("validate all product offerings have categories:", (table) => {
    let response = ResponseContext().PQresponse;
    let productOfferings: any;
    let categoryIds: Array<any>;
    productOfferings = bodyParser.getProductOfferingObjects(response);
    categoryIds = Common.getCategoriesFromTable(table);
    productOfferings.forEach((productOffering: any) => {
      categoryIds.forEach((id) => {
        test(`expected all product offerings to contain category ${id}`, JSON.stringify(productOffering.category) === JSON.stringify({id}), AssertionModes.strict)
          .is(true, `Error response is received due to productOffering, expected all product offerings to contain category ${id}, but offering ${productOffering.id} doesn't contain it.`)
      });
    });
  });

  and('validate at least one product offering has categories:', (table) => {
    let response = ResponseContext().PQresponse;
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
        .is(true, `Error response is received due to productOffering, expected at least one product offering to contain category ${id}, but none of offerings contains it`)
    });
  });

  when('user try to get qualified product offering list with shopping cart', async () => {
    let externalLocationId = PreconditionContext().addressId;
    let distributionChannel = PreconditionContext().distributionChannel;
    let customerCategory = PreconditionContext().customerCategory;
    let productOfferingId = ProductQualificationContext().productOfferingId;
    let categoryList = ProductQualificationContext().categoryList;
    let charList = ProductQualificationContext().charList;
    let commitmentId = ProductQualificationContext().commitmentId;
    let shoppingCartId = shoppingCartContext().shoppingCartId;


    ProductQualificationContext().reset();

    try {
      const pqResponse: AxiosResponse = await fifaNcApi.productQualification({
        categoryList,
        charList,
        commitmentId,
        customerCategory,
        distributionChannel,
        externalLocationId,
        productOfferingId,
        shoppingCartId
      });


      Common.checkValidResponse(pqResponse, 200);
      let response = pqResponse.data;
      const responseText = JSON.stringify(response, replacerFunc(), '\t');
      test('Response should contain productOfferingQualificationItem\n', response.productOfferingQualificationItem, AssertionModes.strict)
        .isnot(undefined,'Response should contain productOfferingQualificationItem\n' +
          responseText)

      ResponseContext().PQresponse = response;
      if (productOfferingId !== null && productOfferingId !== undefined) {
        console.debug('Prod Offer ID' + productOfferingId);
      }
      let topOffer = bodyParser.getProductOfferings(response)[0];
      shoppingCartContext().topOffer = topOffer;
    }
    catch (e) {
      test('Error response is not received',true,AssertionModes.strict)
        .is(false,'Error response is received\n' + JSON.stringify(e, replacerFunc(), '\t'))
    }
  });

  and('user filter by the following categories:', (table) => {
    try {
      ProductQualificationContext().categoryList = Common.getCategoriesFromTable(table);
    }

    catch (e) {
      console.log(e)
    }
  });

  and('validate product offering parameters should contain:', (table) => {
    let response = ResponseContext().PQresponse;
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
          ).isnot(null, 'Response contain null parameter');
        }
      });
    });
    if (paramsToCheck.includes('description')) {
      test('test productOffring description',
        descriptionIsPresent,
        AssertionModes.strict,
      ).is(true, `Error response is received due to productOffring description to be defined at least one productOffering`);
    }
  });

  and('validate product offering price', () => {
    let response: any;
    let productOfferings: any;
    response = ResponseContext().PQresponse;

    productOfferings = bodyParser.getProductOfferingObjects(response);
    productOfferings.forEach((productOffering: any) => {
      let priceIsValid = Common.validateProductOfferingPrice(productOffering);
      test('Response is received due to productOffering',
        priceIsValid.valid,
        AssertionModes.strict).is(true, `Error response is received due to productOffering: ${priceIsValid.error}`)
    });
  });

  and('validate product offering price alteration', () => {
    let response: any;
    let productOfferings: any;
    response = ResponseContext().PQresponse;

    productOfferings = bodyParser.getProductOfferingObjects(response);
    productOfferings.forEach((productOffering: any) => {
      let priceAlterationIsValid = Common.validateProductOfferingPriceAlteration(
        productOffering,
      );
      test('Response is received due to productOffering alteration',
        priceAlterationIsValid.valid,
        AssertionModes.strict).is(true, `Error response is received due to productOffering: ${priceAlterationIsValid.error}`)
    });
  });

  and('user filter by the following product characteristics:', (table) => {
    ProductQualificationContext().charList = Common.getCharListFromTable(table)
  });

}