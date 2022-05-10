import {AssertionModes, featureContext , test} from "@cloudeou/telus-bdd";
import { Identificators } from '../../contexts/Identificators';
import PreconditionContext  from '../../contexts/ngc/PreconditionContext';
import ResponseContext from '../../contexts/ngc/ResponseConntext';
import ShoppingCartContext from '../../contexts/ngc/ShoppingCartContext';
import ErrorContext from "../../contexts/ngc/ErrorContext";
import { ErrorStatus } from "../../../bdd-src/utils/error-status";
import { Common } from "../../../bdd-src/utils/commonBDD/Common";
import {replacerFunc} from "../../../bdd-src/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import {AxiosResponse} from "axios";


type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;

export const updateShoppingCartSteps = ({
   given,
   and,
   when,
   then,
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

  and('user select child offer:', (table) => {
    let offerMap = Common.getChildOfferMapFromTable(
      table,
      shoppingCartContext().getTopOffer(),
    );
    shoppingCartContext().setChildOfferMap(offerMap, 'Add');
    shoppingCartContext().setAddingChild();
  });

  and('user delete from SC context of child offers', () => {
    shoppingCartContext().clearAddingChild();
    shoppingCartContext().resetChildOffers();
  });

  and('user delete child offer:', (table) => {
    let offerMap = Common.getChildOfferMapFromTable(table);
    shoppingCartContext().setChildOfferMap(offerMap, 'Delete');
    shoppingCartContext().setAddingChild();
  });

  and('user set related party customer id', (customerId) => {
    preconditionContext().setExternalCustomerId(customerId);
  });

  when('user try to update Shopping Cart', async () => {
    const shoppingCartApi = shoppingCartContext().shoppingCartApiInstance;
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
    let customerAccountECID = preconditionContext().getExternalCustomerId();
    let childOfferMap = null;
    if (shoppingCartContext().checkIfAddingChild()) {
      childOfferMap = shoppingCartContext().getChildOfferMap();
    } else {
      shoppingCartContext().resetChildOffers();
    }
    let promotionMap = null;
    if (shoppingCartContext().checkIfAddingPromotion()) {
      promotionMap = shoppingCartContext().getPromotions();
    } else {
      shoppingCartContext().resetPromotions();
    }
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
      distributionChannel: distChannelOption,
      charMap,
      childOfferMap,
      ecid: customerAccountECID,
      offersToAdd: selectedOffers,
      promotionMap
    }

    console.log('BODY IN UPDATE: ' + JSON.stringify(requestBody));

    shoppingCartContext().clearAddingOffer();
    shoppingCartContext().clearAddingChild();
    shoppingCartContext().clearAddingCharMap();
    shoppingCartContext().clearAddingPromotion();

    try {
      const response: AxiosResponse = await shoppingCartApi.updateShoppingCart(requestBody);

      if (response.status != 201) {
        errorContext().error = `Unexpected http status code in update ShoppingCart: ${response.status}`;
        errorContext().status = ErrorStatus.skipped;
      }

      Common.checkValidResponse(response, 200);
      const responseText = JSON.stringify(response, replacerFunc(), '\t');
      responseContext().setShoppingCartResponse(response.data);
      responseContext().setshopppingCartResonseText(responseText);
    }
    catch (error: any) {
      console.log(error)
      errorContext().error = error;
      errorContext().status = ErrorStatus.failed;
      responseContext().SCstatusCode = error.response.status;
      responseContext().SCresponse = error.response.data;
      responseContext().SCresponseBody = error.response.data;
      test('Error response should be received', true, AssertionModes.strict)
        .is(false, 'Error response is received\n' + JSON.stringify(error, null, '\t'))
    }
  });

  and('prepare context data for Upgrade', (table) => {
    let charMap = shoppingCartContext().getCharMap();
    table.forEach((row: any) => {
      if (charMap !== null) {
        const upgradeFromOfferChars = charMap.get(row.From);
        charMap.delete(row.From);
        charMap.set(row.To, upgradeFromOfferChars!);
        shoppingCartContext().setCharMap(charMap);
      }
      let offerMap = shoppingCartContext().getChildOfferMap();
      if (offerMap !== null) {
        let childOfferMap = new Map(offerMap);
        shoppingCartContext().resetChildOffers();
        for (let [childMap, action] of childOfferMap) {
          let newChildMap = new Map<string, Array<string>>();
          if (
            childMap.get(row.From) !== null &&
            childMap.get(row.From) !== undefined
          ) {
            let childOfferList = childMap.get(row.From);
            newChildMap.set(row.To, childOfferList);
            shoppingCartContext().setChildOfferMap(newChildMap, action);
          } else {
            shoppingCartContext().setChildOfferMap(childMap, action);
          }
        }
      }
    });
    console.log("SC CONTEXT", shoppingCartContext().getCharMap())
  });

  then(/^validate shopping cart is updated successfully$/, async () => {
    let response: any;
    let responseText: any;
    response = responseContext().getShoppingCartResponse();
    console.log("RESD",JSON.stringify(response));
    responseText = responseContext().getshoppingCartResponseText();
    test('SC should have OPEN status',response.status,AssertionModes.strict)
      .is('OPEN', 'SC should have OPEN status\n' + responseText)
    test('Response should contain cartItem',response.cartItem,AssertionModes.strict)
      .isnot(undefined,'Response should contain cartItem\n' + responseText)
    test('Expecting some offers to be returned',true,AssertionModes.strict)
      .is(response.cartItem.length > 0,'Expecting some offers to be returned \n',)

    let shoppingCartId = response.id;
    shoppingCartContext().setShoppingCartId(shoppingCartId);

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
    Common.validateAllOffersPresentInResponse(response, offerList);
    Common.validateAllOffersNotPresentInResponse(response, offersDeleted);

    const childOffers = shoppingCartContext().getChildOfferMap();
    let childOfferMap = null;
    let childOfferMapDeleted = null;
    for (let [key, value] of childOffers) {
      if (String(value) === 'Add') {
        childOfferMap = key;
      } else if (String(value) === 'Delete') {
        childOfferMapDeleted = key;
      }
    }
    Common.validateOfferMapInResponse(childOfferMap, response);
    Common.validateOfferMapNotInResponse(childOfferMapDeleted, response);

    Common.validateCharMapInResponse(
      childOfferMap,
      shoppingCartContext().getCharMap(),
      response,
      shoppingCartContext().getExistingChildOffers(),
    );
    if (!Common.validateWorkOrdersCorrectness(response)) {
      console.warn(
        'Expected work orders did not match workOrders in cart...!!!',
      );
    }

    let existingChildOfferMap = Common.createExistingChildOffersMap(
      responseContext().getShoppingCartResponse(),
    );
    // console.log(existingChildOfferMap);
    shoppingCartContext().setExistingChildOffers(existingChildOfferMap);

    return;
  });

  then(/^validate that offers can not be removed$/, async () => {
    let response: any;
    let responseText: any;
    response = responseContext().getShoppingCartResponse();
    responseText = responseContext().getshoppingCartResponseText();
    test('SC should have OPEN status', response.status, AssertionModes.strict)
      .is('OPEN', 'SC should have OPEN status\n' + responseText)
    test('Response should contain cartItem', response.cartItem, AssertionModes.strict)
      .isnot(undefined,'Response should contain cartItem\n' + responseText)
    test('Expecting some offers to be returned', true, AssertionModes.strict)
      .is(response.cartItem.length > 0, 'Expecting some offers to be returned \n')

    let shoppingCartId = response.id;
    shoppingCartContext().setShoppingCartId(shoppingCartId);

    let offers = shoppingCartContext().getOffersToAdd();
    let offerList = [];
    let offersDeleted = [];
    for (let [key, value] of offers) {
      if (String(value) === 'Add') {
        offerList.push(String(key));
      } else if (String(value) === 'Delete') {
        offersDeleted.push(String(key));
      }
    }
    Common.validateAllOffersPresentInResponse(response, offersDeleted);
    return;
  });

  and(
    /^validate total shopping cart price is updated successfully:(.*)$/,
    (priceType) => {
      let SCResponseBody: any;
      let updatedPrice: number;
      let originalPrice: number;
      SCResponseBody = responseContext().getShoppingCartResponse();
      if (priceType === 'Recurrent') {
        originalPrice = shoppingCartContext().getOriginalSalesOrderRecurrentPrice();
        updatedPrice =
          SCResponseBody.cartTotalPrice[0].price.dutyFreeAmount.value;
        test('expected price to be updated', updatedPrice, AssertionModes.strict)
          .isnot(originalPrice,`Error response is received due to price, expected price to be updated, but it is the same.`)

        shoppingCartContext().setOriginalSalesOrderRecurrentPrice(updatedPrice);
      } else if (priceType === 'One Time') {
        originalPrice = shoppingCartContext().getOriginalSalesOrderOneTimePrice();
        updatedPrice =
          SCResponseBody.cartTotalPrice[1].price.dutyFreeAmount.value;
        test('expected price to be updated',updatedPrice, AssertionModes.strict)
          .isnot(originalPrice, `Error response is received due to price, expected price to be updated, but it is the same.`)
        shoppingCartContext().setOriginalSalesOrderOneTimePrice(updatedPrice);
      }
    },
  );

  and(
    /^validate total shopping cart price alteration is updated successfully:(.*)$/,
    (priceType) => {
      let SCResponseBody: any;
      let updatedPriceAlteration: Array<string>;
      let originalPriceAlteration: Array<string>;
      SCResponseBody = responseContext().getShoppingCartResponse();
      if (priceType === 'Recurrent') {
        originalPriceAlteration = shoppingCartContext().getSORecurrentPriceAlterationList();
        updatedPriceAlteration =
          SCResponseBody.cartTotalPrice[0].priceAlteration;
        test('expected price alteration to be updated', updatedPriceAlteration,AssertionModes.strict)
          .isnot(originalPriceAlteration, `Error response is received due to price alteration, expected price alteration to be updated, but it is the same.`)
        shoppingCartContext().setSORecurrentPriceAlterationList(
          updatedPriceAlteration,
        );
      } else if (priceType === 'One Time') {
        originalPriceAlteration = shoppingCartContext().getSOOneTimePriceAlterationList();
        updatedPriceAlteration =
          SCResponseBody.cartTotalPrice[1].priceAlteration;
        test('expected price alteration to be updated', updatedPriceAlteration, AssertionModes.strict)
          .isnot(originalPriceAlteration, `Error response is received due to price alteration, expected price alteration to be updated, but it is the same.`)
        shoppingCartContext().setSOOneTimePriceAlterationList(
          updatedPriceAlteration,
        );
      }
    },
  );
};
