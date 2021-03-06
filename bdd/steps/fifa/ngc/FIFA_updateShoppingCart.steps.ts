import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import {Identificators} from '../../../contexts/Identificators';
import FIFA_PreconditionContext from '../../../contexts/fifa/FIFA_PreconditionContext';
import ResponseContext from '../../../contexts/fifa/FIFA_ResponseConntext';
import FIFA_ShoppingCartContext from '../../../contexts/fifa/FIFA_ShoppingCartContext';
import FIFA_ErrorContext from "../../../contexts/fifa/FIFA_ErrorContext";
import {ErrorStatus} from "../../../../bdd-src/fifa/utils/error-status";
import {Common} from "../../../../bdd-src/fifa/utils/commonBDD/Common";
import {replacerFunc} from "../../../../bdd-src/fifa/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import {AxiosResponse} from "axios";


type step = (
    stepMatcher: string | RegExp,
    callback: (...args: any) => void
) => void;

export const FIFA_updateShoppingCartSteps = ({
                                            given,
                                            and,
                                            when,
                                            then,
                                        }: {
    [key: string]: step;
}) => {
    let preconditionContext = (): FIFA_PreconditionContext =>
        featureContext().getContextById(Identificators.FIFA_preConditionContext);
    let responseContext = (): ResponseContext =>
        featureContext().getContextById(Identificators.FIFA_ResponseContext);
    let shoppingCartContext = (): FIFA_ShoppingCartContext =>
        featureContext().getContextById(Identificators.FIFA_shoppingCartContext);
    const errorContext = (): FIFA_ErrorContext =>
        featureContext().getContextById(Identificators.FIFA_ErrorContext);

    and('test user select child offer:', (table) => {
        let offerMap = Common.getChildOfferMapFromTable(
          table,
          shoppingCartContext().topOffer,
        );
        shoppingCartContext().childOfferMap = {value: offerMap, action: 'Add'};
        shoppingCartContext().addingChild = true;
    });

    and('test user delete from SC context of child offers', () => {
        shoppingCartContext().addingChild = false;
        shoppingCartContext().childOfferMap = null;
    });

    and('test user delete child offer:', (table) => {
        let offerMap = Common.getChildOfferMapFromTable(table);
        shoppingCartContext().childOfferMap = {value: offerMap, action: 'Delete'};
        shoppingCartContext().addingChild = true;
    });

  and('test user set related party customer id', (customerId) => {
    preconditionContext().externalCustomerId = customerId;
  });

  when('test user try to update Shopping Cart', async () => {
      try {
          const shoppingCartApi = shoppingCartContext().shoppingCartApiInstance;
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
          let customerAccountECID: any = preconditionContext().externalCustomerId!;
          let childOfferMap = null;
          if (shoppingCartContext().addingChild) {
              childOfferMap = shoppingCartContext().childOfferMap;
          } else {
              shoppingCartContext().childOfferMap = null;
          }

          let promotionMap = null;
          if (shoppingCartContext().addingPromotion) {
              promotionMap = shoppingCartContext().promotions;
          } else {
              shoppingCartContext().promotions = null;
          }
          let response = responseContext().shoppingCartResponse;
          let responseText = JSON.stringify(response)

          if (responseText.includes(customerAccountECID)) {
              customerAccountECID = null;
          }

          const requestBody = {
              prevResponse: response,
              lpdsid: externalLocationId,
              customerCategory: customerCategory,
              distributionChannel: distChannelOption,
              charMap,
              childOfferMap,
              ecid: customerAccountECID,
              offersToAdd: selectedOffers,
              promotionMap
          }

          console.log('BODY IN UPDATE');

          shoppingCartContext().addingOffer = false;
          shoppingCartContext().addingChild = false;
          shoppingCartContext().addingCharMap = false;
          shoppingCartContext().addingPromotion = false;

          try {
              const response: AxiosResponse = await shoppingCartApi.updateShoppingCart(requestBody);

              if (response.status != 201) {
                  errorContext().error = `Unexpected http status code in update ShoppingCart: ${response.status}`;
                  errorContext().status = ErrorStatus.skipped;
              }

              Common.checkValidResponse(response, 200);
              const responseText = JSON.stringify(response, replacerFunc(), '\t');
              responseContext().shoppingCartResponse = response.data;
              responseContext().shopppingCartResonseText = responseText;
          } catch (error: any) {
              console.log(error)
              errorContext().error = error;
              errorContext().status = ErrorStatus.failed;
              responseContext().SCstatusCode = error.response.status;
              responseContext().shoppingCartResponse = error.response.data;
              test('Error response should be received', true, AssertionModes.strict)
                .is(false, 'Error response is received\n' + JSON.stringify(error, null, '\t'))
          }
      }
      catch (e) {
          console.log(e)
      }
    });

    and('test prepare context data for Upgrade', (table) => {
        let charMap = shoppingCartContext().charMap;
        table.forEach((row: any) => {
            if (charMap !== null) {
                const upgradeFromOfferChars = charMap.get(row.From);
                charMap.delete(row.From);
                charMap.set(row.To, upgradeFromOfferChars!);
                shoppingCartContext().charMap = charMap;
            }
            let offerMap = shoppingCartContext().childOfferMap;
            if (offerMap !== null) {
                let childOfferMap: any = new Map(offerMap);
                shoppingCartContext().childOfferMap = null;
                for (let [childMap, action] of childOfferMap) {
                    let newChildMap = new Map<string, Array<string>>();
                    if (
                        childMap.get(row.From) !== null &&
                        childMap.get(row.From) !== undefined
                    ) {
                        let childOfferList = childMap.get(row.From);
                        newChildMap.set(row.To, childOfferList);
                        try{
                            shoppingCartContext().childOfferMap = { value: newChildMap, action};
                        }
                        catch (e) {
                            console.log("ERROR:",e);
                            throw new Error();
                        }

                    } else {

                        shoppingCartContext().childOfferMap = {value: childMap, action};
                    }
                }
            }
        });
    });

    then(/^test validate shopping cart is updated successfully$/, async () => {
        try {
            let response: any;
            let responseText: any;
            response = responseContext().shoppingCartResponse;
            responseText = responseContext().shoppingCartResponseText;
            test('update SC - SC should have OPEN status', response.status, AssertionModes.strict)
              .is('OPEN', 'SC should have OPEN status\n' + responseText)
            test('update SC - Response should contain cartItem', response.cartItem, AssertionModes.strict)
              .isnot(undefined, 'Response should contain cartItem\n' + responseText)
            test('update SC - Expecting some offers to be returned', true, AssertionModes.strict)
              .is(response.cartItem.length > 0, 'Expecting some offers to be returned \n',)

            let shoppingCartId = response.id;
            shoppingCartContext().shoppingCartId = shoppingCartId;

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
            Common.validateAllOffersPresentInResponse(response, offerList);
            Common.validateAllOffersNotPresentInResponse(response, offersDeleted);

            const childOffers = shoppingCartContext().childOfferMap;
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
              shoppingCartContext().charMap,
              response,
              shoppingCartContext().existingChildOffers,
            );
            if (!Common.validateWorkOrdersCorrectness(response)) {
                console.warn(
                  'Expected work orders did not match workOrders in cart...!!!',
                );
            }

            let existingChildOfferMap = Common.createExistingChildOffersMap(
              responseContext().shoppingCartResponse,
            );

            shoppingCartContext().existingChildOffers = existingChildOfferMap;

            return;
        }
        catch (e) {
            console.log(e)
        }
    });

    then(/^test validate that offers can not be removed$/, async () => {
        let response: any;
        let responseText: any;
        response = responseContext().shoppingCartResponse;
        responseText = responseContext().shoppingCartResponseText;
        test('update SC - SC should have OPEN status', response.status, AssertionModes.strict)
            .is('OPEN', 'SC should have OPEN status\n' + responseText)
        test('update SC - Response should contain cartItem', response.cartItem, AssertionModes.strict)
            .isnot(undefined, 'Response should contain cartItem\n' + responseText)
        test('update SC - Expecting some offers to be returned', true, AssertionModes.strict)
            .is(response.cartItem.length > 0, 'Expecting some offers to be returned \n')

        let shoppingCartId = response.id;
        shoppingCartContext().shoppingCartId = shoppingCartId;

        let offers = shoppingCartContext().offersToAdd;
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
        /^test validate total shopping cart price is updated successfully:(.*)$/,
        (priceType) => {
            let SCResponseBody: any;
            let updatedPrice: number;
            let originalPrice: number;
            SCResponseBody = responseContext().shoppingCartResponse;
            if (priceType === 'Recurrent') {
                originalPrice = shoppingCartContext().originalSalesOrderRecurrentPrice;
                updatedPrice =
                    SCResponseBody.cartTotalPrice[0].price.dutyFreeAmount.value;
                test('update SC - expected price to be updated', updatedPrice, AssertionModes.strict)
                    .isnot(originalPrice, `Error response is received due to price, expected price to be updated, but it is the same.`)

                shoppingCartContext().originalSalesOrderRecurrentPrice = updatedPrice;
            } else if (priceType === 'One Time') {
                originalPrice = shoppingCartContext().originalSalesOrderOneTimePrice;
                updatedPrice =
                    SCResponseBody.cartTotalPrice[1].price.dutyFreeAmount.value;
                test('update SC - expected price to be updated', updatedPrice, AssertionModes.strict)
                    .isnot(originalPrice, `Error response is received due to price, expected price to be updated, but it is the same.`)
                shoppingCartContext().originalSalesOrderOneTimePrice = updatedPrice;
            }
        },
    );

    and(
        /^test validate total shopping cart price alteration is updated successfully:(.*)$/,
        (priceType) => {
            let SCResponseBody: any;
            let updatedPriceAlteration: Array<string>;
            let originalPriceAlteration: Array<string>;
            SCResponseBody = responseContext().shoppingCartResponse;
            if (priceType === 'Recurrent') {
                originalPriceAlteration = shoppingCartContext().SORecurrentPriceAlterationList;
                updatedPriceAlteration =
                    SCResponseBody.cartTotalPrice[0].priceAlteration;
                test('update SC - expected price alteration to be updated', updatedPriceAlteration, AssertionModes.strict)
                    .isnot(originalPriceAlteration, `Error response is received due to price alteration, expected price alteration to be updated, but it is the same.`)
                shoppingCartContext().SORecurrentPriceAlterationList = updatedPriceAlteration;
            } else if (priceType === 'One Time') {
                originalPriceAlteration = shoppingCartContext().SOOneTimePriceAlterationList;
                updatedPriceAlteration =
                    SCResponseBody.cartTotalPrice[1].priceAlteration;
                test('update SC - expected price alteration to be updated', updatedPriceAlteration, AssertionModes.strict)
                    .isnot(originalPriceAlteration, `Error response is received due to price alteration, expected price alteration to be updated, but it is the same.`)
                shoppingCartContext().SOOneTimePriceAlterationList = updatedPriceAlteration;
            }
        },
    );
};
