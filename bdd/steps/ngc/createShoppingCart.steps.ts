import {AssertionModes, featureContext , test} from "@cloudeou/telus-bdd";
import { Identificators } from '../../contexts/Identificators';
import PreconditionContext  from '../../contexts/ngc/PreconditionContext';
import ResponseContext from '../../contexts/ngc/ResponseConntext';
import ShoppingCartContext from '../../contexts/ngc/ShoppingCartContext';
import ErrorContext from "../../contexts/ngc/ErrorContext";
import { ErrorStatus } from "../../../test-data/error-status";
import { Common } from "../../../bdd-src/utils/commonBDD/Common";
import {replacerFunc} from "../../../bdd-src/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import {ShoppingCartApi} from "../../../bdd-src/ngc/shoppingCart/shopping-cart.api";
import {bodyParser} from "../../../bdd-src/ngc/shoppingCart/shopping-cart.body-parser";

type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;

export const createShoppingCartSteps = ({
   given,
   and,
   when,
   then
}: {
  [key: string]: step;
}) => {
  let preconditionContext = (): PreconditionContext =>
    featureContext().getContextById(Identificators.preConditionContext);
  let responseContext = (): ResponseContext =>
    featureContext().getContextById(Identificators.ResponseContext);
  let shoppingCartContext = (): ShoppingCartContext =>
    featureContext().getContextById(Identificators.shoppingCartContext);
  const errorContext = (): ErrorContext =>
    featureContext().getContextById(Identificators.ErrorContext);
  const shoppingCartApi = new ShoppingCartApi();


  and('user select offers:', function (table) {
    let productOfferingList: any = Common.getOffersFromTable(
      table,
      shoppingCartContext,
    );
    shoppingCartContext().setOffersToAdd(productOfferingList, 'Add');
    shoppingCartContext().setAddingOffer();

  });

  and(/^user select commitments in (.*) period:$/, (type, table) => {
    const commitmentsList = Common.getOffersFromTable(
      table,
      shoppingCartContext,
    );
    shoppingCartContext().setOffersToAdd(commitmentsList, 'Add');
    shoppingCartContext().setAddingOffer();
    let commitmentCharsTable:
      Array<{
        Name: string,
        Value: Date,
        Item: string
      }> = [];
    commitmentsList.forEach((commitmentId) => {
      const periodCharsTable:  Array<{
        Name: string,
        Value: Date,
        Item: string
      }> = Common.getCommitmentPeriodChars(
        commitmentId,
        type,
      )!;
      commitmentCharsTable = [...commitmentCharsTable, ...periodCharsTable];
    });
    const comCharMap = Common.createCharMapFromTable(commitmentCharsTable);
    const oldCharMap = shoppingCartContext().getCharMap();
    const newCharMap = Common.mergeMaps(oldCharMap!, comCharMap);
    shoppingCartContext().setCharMap(newCharMap);
  });

  and('user delete offers:', function (table) {
    let productOfferingList: any = Common.getOffersFromTable(
      table,
      shoppingCartContext,
    );
    shoppingCartContext().setOffersToAdd(productOfferingList, 'Delete');
    shoppingCartContext().setAddingOffer();
  });

  and('user set the chars for item:', async (table) => {
    let charMap = await Common.createCharMapFromTable(table);
    shoppingCartContext().setCharMap(charMap);
    shoppingCartContext().setAddingCharMap();
  });


  when('user try to create Shopping Cart', async () => {
    let externalLocationId = preconditionContext().getAddressId();
    let distributionChannel = preconditionContext().getDistributionChannel();
    let distributionChannelExternalId = preconditionContext().getDistributionChannelExternalId();
    let customerCategory = preconditionContext().getCustomerCategory();
    let selectedOffers = null;

    let distChannelOption = Common.resolveAddressId(
      distributionChannelExternalId,
      distributionChannel,
    );

    if (shoppingCartContext().checkIfAddingOffer()) {
      selectedOffers = shoppingCartContext().getOffersToAdd();
    } else {
      shoppingCartContext().resetOffersToAdd();
    }
    let charMap = null;
    if (shoppingCartContext().checkIfAddingCharMap()) {
      charMap = shoppingCartContext().getCharMap();
    } else {
      shoppingCartContext().setCharMap(null);
    }
    shoppingCartContext().resetChildOffers();
    console.log('EID ' + preconditionContext().getExternalCustomerId());
    let customerAccountECID = preconditionContext().getExternalCustomerId();

    shoppingCartContext().clearAddingOffer();
    shoppingCartContext().clearAddingChild();
    shoppingCartContext().clearAddingCharMap();


    //console.log('BODY IN CREATE:\n' + JSON.stringify(body));


    try {
      const response = await shoppingCartApi.createShoppingCart({
        prevResponse: null,
        lpdsid: externalLocationId,
        customerCategory: customerCategory,
        distributionChannel: distChannelOption,
        charMap,
        childOfferMap: undefined,
        ecid: customerAccountECID,
        offersToAdd: selectedOffers,
        promotionMap: undefined
      })

      if (response.status != 201) {
        errorContext().error = `Unexpected http status code in create ShoppingCart: ${response.status}`;
        errorContext().status = ErrorStatus.skipped;
      }
      Common.checkValidResponse(response, 201);

      const body = response.data;

      const responseText = JSON.stringify(response, replacerFunc(), '\t');
      test('SC should have OPEN status', body.status, AssertionModes.strict )
        .is('OPEN','SC should have OPEN status\n' + responseText);

      test('Response should contain cartItem', body.cartItem, AssertionModes.strict)
        .isnot(undefined,'Response should contain cartItem\n' + responseText,)

      test('Expecting some offers to be returned',body.cartItem.length,AssertionModes.strict)
        .isnot(0,'Expecting some offers to be returned \n Body: ' + JSON.stringify(body))


      let shoppingCartId = body.id;
      console.log(shoppingCartId);
      shoppingCartContext().setShoppingCartId(shoppingCartId);
      responseContext().SCresponse = response.data;
      responseContext().SCresponseBody = responseText;
      let existingChildOfferMap = Common.createExistingChildOffersMap(
        response.data,
      );
      shoppingCartContext().setExistingChildOffers(existingChildOfferMap);
    }
    catch (error: any) {
      console.log('inside catch')
      console.log(error)
      errorContext().error = error;
      errorContext().status = ErrorStatus.failed;
      responseContext().SCstatusCode = error.response.status;
      responseContext().SCresponse = error.response.data;
      responseContext().SCresponseBody = error.response.data;
    }
  })
  //
  //
  //
  then('validate shopping cart is created successfully', async () => {
    console.log('validate shopping cart is created successfully');
    let response: any = responseContext().getSCresponse();
    console.log(JSON.stringify(response));
    let salesOrderRecurrentPrice =
      response.cartTotalPrice[0].price.dutyFreeAmount.value;
    console.log("salesOrderRecurrentPrice",salesOrderRecurrentPrice);
    let salesOrderOneTimePrice =
      response.cartTotalPrice[1].price.dutyFreeAmount.value;
    console.log("salesOrderOneTimePrice",salesOrderOneTimePrice);
    let SORecurrentPriceAlteration = response.cartTotalPrice[0].priceAlteration;
    console.log("SORecurrentPriceAlteration",SORecurrentPriceAlteration);
    let SOOneTimePriceAlteration = response.cartTotalPrice[1].priceAlteration;
    console.log("SOOneTimePriceAlteration",SOOneTimePriceAlteration);
    shoppingCartContext().setOriginalSalesOrderRecurrentPrice(
      salesOrderRecurrentPrice,
    );
    shoppingCartContext().setOriginalSalesOrderOneTimePrice(
      salesOrderOneTimePrice,
    );
    shoppingCartContext().setSORecurrentPriceAlterationList(
      SORecurrentPriceAlteration,
    );
    shoppingCartContext().setSOOneTimePriceAlterationList(
      SOOneTimePriceAlteration,
    );
    console.log("after");

    let responseText = responseContext().getSCresponseBody();
    console.log("get body");
    const offers = shoppingCartContext().getOffersToAdd();
    console.log("getOffersToAdd")
    const offerList = [];
    const offersDeleted = [];
    for (let [key, value] of offers) {
      if (String(value) === 'Add') {
        offerList.push(String(key));
      } else if (String(value) === 'Delete') {
        offersDeleted.push(String(key));
      }
    }
    let charMap = shoppingCartContext().getCharMap();

    test('SC should have OPEN status',response.status, AssertionModes.strict)
      .is('OPEN','SC should have OPEN status\n' + responseText)

    bodyParser.validateAllOffersPresentInResponse(response, offerList);
    bodyParser.validateAllOffersNotPresentInResponse(response, offersDeleted);
    //Common.validateTheCharMapInResponse(response, charMap);

    if (Common.checkIfHasShippmentOrder(response)) {
      console.log('inside if (Common.checkIfHasShippmentOrder(response))')
      let table = [
        {
          Name: '9147912230013832655',
          Value: 'T7A1T3',
          Item: '9147904372813829170',
        },
        {
          Name: '9148017499713860022',
          Value: 'AB',
          Item: '9147904372813829170',
        },
        {
          Name: '9148017331813859769',
          Value: 'DraytonValley',
          Item: '9147904372813829170',
        },
        {
          Name: '9147904820813829381',
          Value: 'Testing',
          Item: '9147904372813829170',
        },
        {
          Name: '9147983057213907287',
          Value: 'LastName',
          Item: '9147904372813829170',
        },
      ];
      let charMap = await Common.createCharMapFromTable(table);
      console.log("charMap",charMap)
      shoppingCartContext().setCharMap(charMap);
      console.log("set");

      let externalLocationId = preconditionContext().getAddressId();
        console.log("externalLocationId",externalLocationId)
      let distributionChannel = preconditionContext().getDistributionChannel();
      console.log("distributionChannel",distributionChannel)
      let customerCategory = preconditionContext().getCustomerCategory();
      console.log("customerCategory",customerCategory)
      let selectedOffers = shoppingCartContext().getOffersToAdd();
      console.log("selectedOffers",selectedOffers)
      charMap = shoppingCartContext().getCharMap()!;
      console.log("charMap",charMap)
      let customerAccountECID = preconditionContext().getExternalCustomerId();
      console.log("customerAccountECID",customerAccountECID)
      let childOfferMap = shoppingCartContext().getChildOfferMap();
      console.log("childOfferMap",childOfferMap)
      let response = responseContext().getSCresponse();
      console.log("response",response)
      let shoppingCartId = shoppingCartContext().getShoppingCartId();
      console.log("shoppingCartId",shoppingCartId)
      let responseText = JSON.stringify(response);
      console.log("responseText",responseText)
      if (responseText.includes(customerAccountECID)) {
        customerAccountECID = null;
      }
      console.log('after get');

      const requestBody = {
        prevResponse: null,
        lpdsid: externalLocationId,
        customerCategory: customerCategory,
        distributionChannel,
        charMap,
        childOfferMap: undefined,
        ecid: customerAccountECID,
        offersToAdd: selectedOffers,
        promotionMap: undefined

      }

      try {
        const response = await shoppingCartApi.updateShoppingCart(requestBody);

        Common.checkValidResponse(response, 200);
        const responseText = JSON.stringify(response.data, null, '\t');
        responseContext().SCresponse = response.data;
        responseContext().SCresponseBody = responseText;

      }
      catch (error) {
        test('Error response should not be received', true,AssertionModes.strict)
          .is(false,'Error response is received\n' + JSON.stringify(error, null, '\t'))
      }

    }
  });
};
