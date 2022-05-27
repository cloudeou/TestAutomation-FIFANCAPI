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


  and('test user select commitments in trial period:', (table) => {
    console.log("select commitments")
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
        "trial",
      )!;
      commitmentCharsTable = [...commitmentCharsTable, ...periodCharsTable];
    });

    const comCharMap = Common.createCharMapFromTable(commitmentCharsTable);
    const oldCharMap = shoppingCartContext().charMap;
    const newCharMap = Common.mergeMaps(oldCharMap!, comCharMap);
    shoppingCartContext().charMap = newCharMap;

  });

  and('test user select commitments in regular period:', (table) => {
    console.log("select commitments")
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
        "regular",
      )!;
      commitmentCharsTable = [...commitmentCharsTable, ...periodCharsTable];
    });

    const comCharMap = Common.createCharMapFromTable(commitmentCharsTable);
    const oldCharMap = shoppingCartContext().charMap;
    const newCharMap = Common.mergeMaps(oldCharMap!, comCharMap);
    shoppingCartContext().charMap = newCharMap;

  });

  and('test user select commitments in earlyRenewal period:', (table) => {
    console.log("select commitments")
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
        "earlyRenewal",
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
    responseContext().shoppingCartResponse = null;
    responseContext().shopppingCartResonseText = null;
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
    let externalLocationId = preconditionContext().addressId;
    let distributionChannel = preconditionContext().distributionChannel;
    let distributionChannelExternalId = preconditionContext().distributionChannelExternalId;
    let customerCategory = preconditionContext().customerCategory;
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
    console.log('EID ' + preconditionContext().externalCustomerId);
    let customerAccountECID = preconditionContext().externalCustomerId;

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
      responseContext().shoppingCartResponse = response.data;
      console.log('  responseContext().shoppingCartResponse = response.data);');
      responseContext().shopppingCartResonseText = responseText;
      console.log(' responseContext().shopppingCartResonseText = responseText);');
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
      responseContext().shoppingCartResponse = error.response.data;
    }
  })

  then('validate shopping cart is created successfully', async () => {
    let responseBody = responseContext().shoppingCartResponse!;
    let salesOrderRecurrentPrice = responseBody.cartTotalPrice[0].price.dutyFreeAmount.value;
    let salesOrderOneTimePrice = responseBody.cartTotalPrice[1].price.dutyFreeAmount.value;
    let SORecurrentPriceAlteration = responseBody.cartTotalPrice[0].priceAlteration;
    let SOOneTimePriceAlteration = responseBody.cartTotalPrice[1].priceAlteration;
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
    test('SC should have OPEN status',responseBody?.status, AssertionModes.strict)
      .is('OPEN','SC should have OPEN status\n' + responseBody?.responseText)

    Common.validateAllOffersPresentInResponse(responseBody, offerList);
    Common.validateAllOffersNotPresentInResponse(responseBody, offersDeleted);

    if (Common.checkIfHasShippmentOrder(responseBody)) {
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

      let externalLocationId = preconditionContext().addressId;
      let distributionChannel = preconditionContext().distributionChannel;
      let customerCategory = preconditionContext().customerCategory;
      let selectedOffers = shoppingCartContext().offersToAdd;
      charMap = shoppingCartContext().charMap!;
      let customerAccountECID = preconditionContext().externalCustomerId;
      let response = responseContext().shoppingCartResponse;
      let responseText = JSON.stringify(response?.responseText);
      if(customerAccountECID === null) {
        throw new Error('customerAccountECID is null while validate shopping cart is created successfully')
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

        // responseContext().setResponse("SC",responseBody);
        responseContext().shoppingCartResponse = response.data;
        responseContext().shopppingCartResonseText = responseText;

      }
      catch (error) {
        test('Error responseBody should not be received', true,AssertionModes.strict)
          .is(false,'Error responseBody is received when try to update SC\n' + JSON.stringify(error, null, '\t'))
      }

    }
  })
}