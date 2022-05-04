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
    const newCharMap = Common.mergeMaps(oldCharMap, comCharMap);
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
      const response = await ShoppingCartApi.createShoppingCart()
    }
    catch (e) {
      console.log(e)
    }



    return await btapi
      .$requestShoppingCart(btapi.TYPES.createShoppingCart(), body, null)
      .toPromise()
      .then(
        (success) => {
          Common.checkValidResponse(success, 201);
          const body = success.response.body;
          // logger.debug('CART CREATED: '+ JSON.stringify(body));
          const responseText = JSON.stringify(success, null, '\t');
          expect(
            body.status,
            'SC should have OPEN status\n' + responseText,
          ).toBe('OPEN');
          expect(
            body.cartItem,
            'Response should contain cartItem\n' + responseText,
          ).toBeDefined();
          expect(
            body.cartItem.length,
            'Expecting some offers to be returned \n Body: ' +
            JSON.stringify(body),
          ).toBeGreaterThan(0);
          let shoppingCartId = body.id;
          console.log(shoppingCartId);
          shoppingCartContext().setShoppingCartId(shoppingCartId);
          responseContext().setShoppingCartResponse(success.response.body);
          responseContext().setshopppingCartResonseText(responseText);
          let existingChildOfferMap = Common.createExistingChildOffersMap(
            success.response.body,
          );
          shoppingCartContext().setExistingChildOffers(existingChildOfferMap);
        },
        (error) => {
          expect(
            true,
            'Error response is received\n' + JSON.stringify(error, null, '\t'),
          ).toBe(false);
        },
      );
  });

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
    var offers = shoppingCartContext().getOffersToAdd();
    var offerList = [];
    var offersDeleted = [];
    for (let [key, value] of offers) {
      if (String(value) === 'Add') {
        offerList.push(String(key));
      } else if (String(value) === 'Delete') {
        offersDeleted.push(String(key));
      }
    }
    let charMap = shoppingCartContext().getCharMap();
    expect(response.status, 'SC should have OPEN status\n' + responseText).toBe(
      'OPEN',
    );
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
      charMap = shoppingCartContext().getCharMap();
      let customerAccountECID = preconditionContext().getExternalCustomerId();
      let childOfferMap = shoppingCartContext().getChildOfferMap();
      let response = responseContext().getShoppingCartResponse();
      let shoppingCartId = shoppingCartContext().getShoppingCartId();
      let responseText = JSON.stringify(response);
      if (responseText.includes(customerAccountECID)) {
        customerAccountECID = null;
      }
      // logger.debug('RESPONSE:' + JSON.stringify(response));
      //console.log('RESPONSE:' + JSON.stringify(response));
      let bodyGen = new bodyGenerator(
        customerAccountECID,
        customerCategory,
        distributionChannel,
        externalLocationId,
        response,
        selectedOffers,
        childOfferMap,
        charMap,
      );

      let body = bodyGen.generateBody();
      logger.debug('BODY IN UPDATE: ' + JSON.stringify(body));
      return await btapi
        .$requestShoppingCart(
          btapi.TYPES.updateShoppingCart(shoppingCartId),
          body,
        )
        .toPromise()
        .then(
          (success) => {
            Common.checkValidResponse(success, 200);
            const body = success.response.body;
            const responseText = JSON.stringify(success, null, '\t');
            // logger.debug('CART UPDATED: '+ JSON.stringify(body));
            responseContext().setShoppingCartResponse(success.response.body);
            responseContext().setshopppingCartResonseText(responseText);
          },
          (error) => {
            expect(
              true,
              'Error response is received\n' +
              JSON.stringify(error, null, '\t'),
            ).toBe(false);
          },
        );
    }
  });
};
