import {AssertionModes, test} from "@cloudeou/telus-bdd";

const { featureContext } = require("@telus-bdd/telus-bdd");
import { Identificators } from '../../contexts/Identificators';
import { PreconditionContext } from '../../contexts/ngc/PreconditionContext';
import ResponseContext from '../../contexts/ngc/ResponseConntext';
import ShoppingCartContext from '../../contexts/ngc/ShoppingCartContext';
import ErrorContext from "../../contexts/ngc/ErrorContext";
import { ErrorStatus } from "../../../bdd-src/utils/error-status";
import { Common } from "../../../bdd-src/utils/commonBDD/Common";
import { ShoppingCartApi } from "../../../bdd-src/ngc/shopping-cart-tmf/shopping-cart-tmf.api";
import { BodyGenerator } from "../../../bdd-src/ngc/shopping-cart-tmf/shopping-cart-tmf.body-generator"

import { Logger } from '../../../bdd-src/logger/Logger';
const logger = new Logger();

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

  then('user try to delete Shopping Cart context', async () => {
    shoppingCartContext().setShoppingCartId(null);
    responseContext().setShoppingCartResponse(null);
    responseContext().setshopppingCartResonseText(null);
    shoppingCartContext().setExistingChildOffers(null);
    shoppingCartContext().resetOffersToAdd();
    shoppingCartContext().setCharMap(null);
    shoppingCartContext().resetChildOffers();
    shoppingCartContext().clearAddingOffer();
    shoppingCartContext().clearAddingChild();
    shoppingCartContext().clearAddingCharMap();
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
    console.log('EID' + preconditionContext().getExternalCustomerId());
    let customerAccountECID = preconditionContext().getExternalCustomerId();

    shoppingCartContext().clearAddingOffer();
    shoppingCartContext().clearAddingChild();
    shoppingCartContext().clearAddingCharMap();


    let bodyGen = new BodyGenerator(
      customerAccountECID,
      customerCategory,
      distChannelOption,
      externalLocationId,
      null,
      selectedOffers,
      null,
      charMap,
    );
    let body = bodyGen.generateBody();

    logger.debug('BODY IN CREATE:\n' + JSON.stringify(body));
    console.log('BODY IN CREATE:\n' + JSON.stringify(body));


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
      // logger.debug('CART CREATED: '+ JSON.stringify(body));
      const responseText = JSON.stringify(response, null, '\t');
      test('SC should have OPEN status', body.status, AssertionModes.strict )
        .is('OPEN','SC should have OPEN status\n' + responseText);

      test('Response should contain cartItem', body.cartItem, AssertionModes.strict)
        .isnot(undefined,'Response should contain cartItem\n' + responseText,)

      test('Expecting some offers to be returned',body.cartItem.length,AssertionModes.strict)
        .isnot(0,'Expecting some offers to be returned \n Body: ' + JSON.stringify(body))


      let shoppingCartId = body.id;
      console.log(shoppingCartId);
      shoppingCartContext().setShoppingCartId(shoppingCartId);
      responseContext().setShoppingCartResponse(response.data);
      responseContext().setshopppingCartResonseText(responseText);
      let existingChildOfferMap = Common.createExistingChildOffersMap(
        response.data,
      );
      shoppingCartContext().setExistingChildOffers(existingChildOfferMap);


    }
    catch (error) {
      console.log(error)
      errorContext().error = error;
      errorContext().status = ErrorStatus.failed;
      responseContext().SCstatusCode = error.response.status;
      responseContext().SCresponse = error.response.data;
      responseContext().SCresponseBody = error.response.data;
    }
  })



  then('validate shopping cart is created successfully', async () => {
    let response: any;
    response = responseContext().getShoppingCartResponse();
    console.log(JSON.stringify(response));
    let salesOrderRecurrentPrice =
      response.cartTotalPrice[0].price.dutyFreeAmount.value;
    let salesOrderOneTimePrice =
      response.cartTotalPrice[1].price.dutyFreeAmount.value;
    let SORecurrentPriceAlteration = response.cartTotalPrice[0].priceAlteration;
    let SOOneTimePriceAlteration = response.cartTotalPrice[1].priceAlteration;
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

    let responseText = responseContext().getshoppingCartResponseText();
    const offers = shoppingCartContext().getOffersToAdd();
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

    Common.validateAllOffersPresentInResponse(response, offerList);
    Common.validateAllOffersNotPresentInResponse(response, offersDeleted);
    //Common.validateTheCharMapInResponse(response, charMap);

    if (Common.checkIfHasShippmentOrder(response)) {
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
      shoppingCartContext().setCharMap(charMap);

      let externalLocationId = preconditionContext().getAddressId();
      let distributionChannel = preconditionContext().getDistributionChannel();
      let customerCategory = preconditionContext().getCustomerCategory();
      let selectedOffers = shoppingCartContext().getOffersToAdd();
      charMap = shoppingCartContext().getCharMap()!;
      let customerAccountECID = preconditionContext().getExternalCustomerId();
      let childOfferMap = shoppingCartContext().getChildOfferMap();
      let response = responseContext().getShoppingCartResponse();
      let shoppingCartId = shoppingCartContext().getShoppingCartId();
      let responseText = JSON.stringify(response);
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

      logger.debug('BODY IN UPDATE: ' + JSON.stringify(requestBody));

      try {
        const response = await shoppingCartApi.updateShoppingCart(requestBody);

        Common.checkValidResponse(response, 200);
        const body = response.data;
        const responseText = JSON.stringify(response, null, '\t');
        // logger.debug('CART UPDATED: '+ JSON.stringify(body));
        responseContext().setShoppingCartResponse(response.data);
        responseContext().setshopppingCartResonseText(responseText);




      }
      catch (error) {
        test('Error response should not be received', true,AssertionModes.strict)
          .is(false,'Error response is received\n' + JSON.stringify(error, null, '\t'))
      }

    }
  });
};
