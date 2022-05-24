import {AssertionModes, featureContext , test} from "@cloudeou/telus-bdd";
import { Identificators } from '../../contexts/Identificators';
import PreconditionContext  from '../../contexts/ngc/PreconditionContext';
import ResponseContext from '../../contexts/ngc/ResponseConntext';
import ShoppingCartContext from '../../contexts/ngc/ShoppingCartContext';
import ErrorContext from "../../contexts/ngc/ErrorContext";
import { ErrorStatus } from "../../../bdd-src/utils/error-status";
import { Common } from "../../../bdd-src/utils/commonBDD/Common";
import { ShoppingCartApi } from "../../../bdd-src/ngc/shopping-cart/shopping-cart.api";
import {replacerFunc} from "../../../bdd-src/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import { APIs } from "../apis.enum";
type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;

export const createShoppingCartSteps = ({
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
    shoppingCartContext().offersToAdd = {offerList: productOfferingList, action:'Add'};
    shoppingCartContext().addingOffer = true;
  });

  and(/^user select commitments in (.*) period:$/, (type, table) => {
    const commitmentsList = Common.getOffersFromTable(
      table,
      shoppingCartContext,
    );
    shoppingCartContext().offersToAdd = { offerList: commitmentsList, action: 'Add'};
    shoppingCartContext().addingOffer = true;
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
    const oldCharMap = shoppingCartContext().charMap;
    const newCharMap = Common.mergeMaps(oldCharMap!, comCharMap);
    shoppingCartContext().charMap = newCharMap;
  });

  and('user delete offers:', function (table) {
    let productOfferingList: any = Common.getOffersFromTable(
      table,
      shoppingCartContext,
    );
    shoppingCartContext().offersToAdd = { offerList: productOfferingList, action: 'Delete'};
    shoppingCartContext().addingOffer = true;
  });

  and('user set the chars for item:', async (table) => {
    let charMap = await Common.createCharMapFromTable(table);
    shoppingCartContext().charMap = charMap;
    shoppingCartContext().addingCharMap = true;
  });

  then('user try to delete Shopping Cart context', async () => {
    shoppingCartContext().shoppingCartId = null;
    responseContext().setShoppingCartResponse(null);
    responseContext().setshopppingCartResonseText(null);
    shoppingCartContext().existingChildOffers = null;
    shoppingCartContext().offersToAdd = null;
    shoppingCartContext().charMap = null;
    shoppingCartContext().childOfferMap = null;
    shoppingCartContext().addingOffer = false;
    shoppingCartContext().addingChild = false;
    shoppingCartContext().addingCharMap = false;
  });

  when('user try to create Shopping Cart', async () => {
    shoppingCartContext().shoppingCartApiInstance = shoppingCartApi;
    let externalLocationId = preconditionContext().getAddressId();
    let distributionChannel = preconditionContext().getDistributionChannel();
    let distributionChannelExternalId = preconditionContext().getDistributionChannelExternalId();
    let customerCategory = preconditionContext().getCustomerCategory();
    let selectedOffers = null;

    let distChannelOption = Common.resolveAddressId(
      distributionChannelExternalId,
      distributionChannel,
    );

    if (shoppingCartContext().addingOffer) {
      selectedOffers = shoppingCartContext().offersToAdd;
    } else {
      shoppingCartContext().offersToAdd = null;
    }
    let charMap = null;
    if (shoppingCartContext().addingCharMap) {
      charMap = shoppingCartContext().charMap;
    } else {
      shoppingCartContext().charMap = null;
    }
    shoppingCartContext().childOfferMap = null;
    console.log('EID ' + preconditionContext().getExternalCustomerId());
    let customerAccountECID = preconditionContext().getExternalCustomerId();

    shoppingCartContext().addingOffer = false;
    shoppingCartContext().addingChild = false;
    shoppingCartContext().addingCharMap = false;


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
      shoppingCartApi.shoppingCartId = shoppingCartId;
      shoppingCartContext().shoppingCartId = shoppingCartId;
      responseContext().setResponse("SC",response);
      responseContext().setShoppingCartResponse(response.data);
      console.log('  responseContext().setShoppingCartResponse(response.data);');
      responseContext().setshopppingCartResonseText(responseText);
      console.log(' responseContext().setshopppingCartResonseText(responseText);');
      let existingChildOfferMap = Common.createExistingChildOffersMap(
        response.data,
      );
      console.log(' let existingChildOfferMap = Common.createExistingChildOffersMap(');
      shoppingCartContext().existingChildOffers = existingChildOfferMap;
      console.log('  shoppingCartContext().setExistingChildOffers(existingChildOfferMap);');


    }
    catch (error: any) {
      console.log(error)
      errorContext().error = error;
      errorContext().status = ErrorStatus.failed;
      responseContext().SCstatusCode = error.response.status;
      responseContext().setShoppingCartResponse(error.response.data);
    }
  })



  then('validate shopping cart is created successfully', async () => {
    let response = responseContext().getResponse(<APIs>"SC");
    let salesOrderRecurrentPrice =
      response?.responseBody.cartTotalPrice[0].price.dutyFreeAmount.value;
    let salesOrderOneTimePrice =
      response?.responseBody.cartTotalPrice[1].price.dutyFreeAmount.value;
    let SORecurrentPriceAlteration = response?.responseBody.cartTotalPrice[0].priceAlteration;
    let SOOneTimePriceAlteration = response?.responseBody.cartTotalPrice[1].priceAlteration;
    shoppingCartContext().originalSalesOrderRecurrentPrice = salesOrderRecurrentPrice;
    shoppingCartContext().originalSalesOrderOneTimePrice = salesOrderOneTimePrice;
    shoppingCartContext().SORecurrentPriceAlterationList = SORecurrentPriceAlteration;
    shoppingCartContext().SOOneTimePriceAlterationList = SOOneTimePriceAlteration;

    const offers = shoppingCartContext().offersToAdd;
    const offerList = [];
    const offersDeleted = [];
    for (let [key, value] of offers) {
      if (String(value) === 'Add') {
        offerList.push(String(key));
      } else if (String(value) === 'Delete') {
        offersDeleted.push(String(key));
      }
    }
    test('SC should have OPEN status',response?.responseBody?.status, AssertionModes.strict)
      .is('OPEN','SC should have OPEN status\n' + response?.responseText)

    Common.validateAllOffersPresentInResponse(response?.responseBody, offerList);
    Common.validateAllOffersNotPresentInResponse(response?.responseBody, offersDeleted);

    if (Common.checkIfHasShippmentOrder(response?.responseBody)) {
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
      shoppingCartContext().charMap = charMap;

      let externalLocationId = preconditionContext().getAddressId();
      let distributionChannel = preconditionContext().getDistributionChannel();
      let customerCategory = preconditionContext().getCustomerCategory();
      let selectedOffers = shoppingCartContext().offersToAdd;
      charMap = shoppingCartContext().charMap!;
      let customerAccountECID = preconditionContext().getExternalCustomerId();
      let response = responseContext().getResponse(<APIs>"SC");
      let responseText = JSON.stringify(response?.responseText);
      if (responseText.includes(customerAccountECID)) {
        customerAccountECID = null;
      }

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
        console.log(response);
         const responseText = JSON.stringify(response.data, replacerFunc(), '\t');

        // responseContext().setResponse("SC",response);
        responseContext().setShoppingCartResponse(response.data);
         responseContext().setshopppingCartResonseText(responseText);

      }
      catch (error) {
        test('Error response should not be received', true,AssertionModes.strict)
          .is(false,'Error response is received when try to update SC\n' + JSON.stringify(error, null, '\t'))
      }

    }
  });
};
