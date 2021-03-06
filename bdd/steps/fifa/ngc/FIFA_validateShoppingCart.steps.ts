import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import {Identificators} from '../../../contexts/Identificators';
import FIFA_PreconditionContext from '../../../contexts/fifa/FIFA_PreconditionContext';
import ResponseContext from '../../../contexts/fifa/FIFA_ResponseConntext';
import FIFA_ShoppingCartContext from '../../../contexts/fifa/FIFA_ShoppingCartContext';
import FIFA_ErrorContext from "../../../contexts/fifa/FIFA_ErrorContext";
import {ErrorStatus} from "../../../../bdd-src/fifa/utils/error-status";
import {Common} from "../../../../bdd-src/fifa/utils/commonBDD/Common";
import {replacerFunc} from "../../../../bdd-src/fifa/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import ncConstants from "../../../../bdd-src/fifa/utils/nc-constants";
import {AxiosResponse} from "axios";

type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;


export const FIFA_validateShoppingCartSteps = (
  {
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

  when('test user try to validate shopping cart', async () => {
    console.log('entering test user try to validate shopping cart')
    try {
      const shoppingCartApi = shoppingCartContext().shoppingCartApiInstance;
      const shoppingCartId = shoppingCartContext().shoppingCartId;
      let distributionChannel = preconditionContext().distributionChannel;
      let distributionChannelExternalId = preconditionContext().distributionChannelExternalId;
      let customerCategory = preconditionContext().customerCategory;
      let response = responseContext().shoppingCartResponse;

      let distChannelOption = Common.resolveAddressId(
        distributionChannelExternalId,
        distributionChannel,
      );

      test('SC id should not be null', shoppingCartId, AssertionModes.strict)
        .isnot(null, 'SC id should not be null, please look at the previous test\n')


      const workOrderdetails = Common.getWorkOrdersCount(response);
      if (workOrderdetails.count > 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let startTime = tomorrow.getTime();
        tomorrow.setHours(tomorrow.getHours() + 2);
        let endTime = tomorrow.getTime();
        let table = [
          {
            Name: ncConstants.characteristics.plannedStartDateTime,
            Value: startTime,
            Item: ncConstants.offers.workOffer,
          },
          {
            Name: ncConstants.characteristics.plannedEndDateTime,
            Value: endTime,
            Item: ncConstants.offers.workOffer,
          },
        ];
        const charMap = Common.createCharMapFromTable(table);
        if (workOrderdetails.action == '-' || workOrderdetails.action == 'Add') {
          let response: any = responseContext().shoppingCartResponse;
          for (let index = 0; index < response.cartItem.length; index++) {
            const element = response.cartItem[index];
            if (element.product.name == 'Work Offer') {
              const characteristics = element.product.characteristic;
              for (let j = 0; j < characteristics.length; j++) {
                if (
                  characteristics[j].name == '9146584120013682838' ||
                  characteristics[j].name == '9146584385713682940'
                ) {
                  if (!characteristics[j].value) {
                    shoppingCartContext().charMap = charMap;
                  } else return;
                }
              }
            }
          }
        } else {
          return;
        }

        let externalLocationId = preconditionContext().addressId;
        let distributionChannel = preconditionContext().distributionChannel;
        let distributionChannelExternalId = preconditionContext().distributionChannelExternalId;
        let customerCategory = preconditionContext().customerCategory;
        let selectedOffers = shoppingCartContext().offersToAdd;
        const newCharMap = shoppingCartContext().charMap;
        let customerAccountECID = preconditionContext().externalCustomerId;
        let childOfferMap = shoppingCartContext().childOfferMap;
        let previousResponse = responseContext().shoppingCartResponse;
        let shoppingCartId = shoppingCartContext().shoppingCartId;
        let responseText = JSON.stringify(previousResponse);
        if (customerAccountECID === null) {
          throw  new Error('customerAccountECID is  null while test user try to validate shopping cart')
        }
        if (responseText.includes(customerAccountECID.toString())) {
          customerAccountECID = null;
        }

        let distChannelOption = Common.resolveAddressId(
          distributionChannelExternalId,
          distributionChannel,
        );


        try {
          const response: AxiosResponse = await shoppingCartApi.updateShoppingCart({
            ecid: customerAccountECID,
            lpdsid: externalLocationId,
            customerCategory,
            distributionChannel: distChannelOption,
            prevResponse: previousResponse,
            offersToAdd: selectedOffers,
            childOfferMap: childOfferMap,
            charMap: newCharMap,
            promotionMap: null
          })

          if (response.status != 200) {
            errorContext().error = `Unexpected http status code in update SC: ${response.status}`;
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
          test('is previousResponse received', true, AssertionModes.strict)
            .is(false, 'Error previousResponse is received\n' + JSON.stringify(error, null, '\t'))
        }
      }


      try {
        const responseValidate: AxiosResponse = await shoppingCartApi.validateShoppingCart({
          customerCategory,
          distributionChannel: distChannelOption,
        })

        if (responseValidate.status != 200) {
          errorContext().error = `Unexpected http status code in validate SC: ${responseValidate.status}`;
          errorContext().status = ErrorStatus.skipped;
        }

        Common.checkValidResponse(responseValidate);
        const body = responseValidate.data;
        responseContext().shoppingCartResponse = body;
        const responseText = JSON.stringify(responseValidate, replacerFunc(), '\t');

        test('Response should contain body', body, AssertionModes.strict)
          .isnot(undefined, 'Response should contain body\n' + responseText)
        test('Response should contain cartItem', body.cartItem, AssertionModes.strict)
          .isnot(undefined, 'Response should contain cartItem\n' + responseText)
      } catch (error: any) {
        console.log(error)
        errorContext().error = error;
        errorContext().status = ErrorStatus.failed;
        responseContext().SCstatusCode = error.response.status;
        responseContext().shoppingCartResponse = error.response.data;
        test('Error response is received', true, AssertionModes.strict)
          .is(false, 'Error response is received\n' + JSON.stringify(error, null, '\t'))
      }
    }

    catch (e) {
      console.log(e)
    }

  });

  and('test work order updated successfully', () => {
    let response = responseContext().shoppingCartResponse;
    Common.validateWorkOrdersCorrectness(response);
  });

  then(/test error messages should be in shopping cart: '(.*)'/, (errorMessage) => {
    try {
      const body: any = responseContext().shoppingCartResponse;
      if (!body.version) {
        errorContext().error = "Cart version should be defined";
        errorContext().status = ErrorStatus.skipped;
      } else if (!(parseFloat(body.version) > 0)) {
        errorContext().error = "Cart version should be greater than 0";
        errorContext().status = ErrorStatus.skipped;
      } else if (!(body.cartItem.length > 0)) {
        errorContext().error = "CartItem should not be empty - HS, LW and WO";
        errorContext().status = ErrorStatus.skipped;
      } else {
        let errors = "";
        body.validationErrors.forEach((errorDetails: any) => {
          if (errorDetails.notificationType === "ERROR") {
            errors =
              errors +
              "ERROR: " +
              errorDetails.name +
              " DESCRIPTION: " +
              errorDetails.message +
              "\n";
          }
        });
        if (errors != "") {
          errorContext().error = `Error massages in shopping cart: ${errors}`;
          errorContext().status = ErrorStatus.skipped;
        }

        test('Got errors in validating e message should be in SC', errors.includes(errorMessage), AssertionModes.strict)
          .is(true, `failed e message should be in SC, errors - ${JSON.stringify(errors)} do not include errorMessage - ${errorMessage}`)
      }


      test('Cart version should be defined', body.version, AssertionModes.strict)
        .isnot(undefined, 'Cart version should be defined \n' +
          JSON.stringify(
            body,
            function (key, value) {
              return key && value && typeof value !== 'number'
                ? Array.isArray(value)
                  ? '[object Array]'
                  : '' + value
                : value;
            },
            '\t',
          )
        )

      test('Cart version should be greater than 0 as we are on', parseFloat(body.version) > 0, AssertionModes.strict)
        .is(true, 'Cart version should be greater than 0 as we are on \n')

      test('cartItem should not be empty - HS, LW and WO test in validateShoppingCart', body.cartItem.length > 0, AssertionModes.strict)
        .is(true, 'cartItem should not be empty - HS, LW and WO\n' +
          JSON.stringify(
            body.cartItem.map(function (elem: any) {
              return {
                id:
                  elem.productOffering.id +
                  '   ' +
                  elem.productOffering.displayName,
              };
            }),
          )
        )
    }

    catch (e) {
      console.log(e)
    }
  });


  then('test no error messages should be in shopping cart', () => {
    try {
      const body: any = responseContext().shoppingCartResponse;
      if (!body.version) {
        errorContext().error = "Cart version should be defined";
        errorContext().status = ErrorStatus.skipped;
      } else if (!(parseFloat(body.version) > 0)) {
        errorContext().error = "Cart version should be greater than 0";
        errorContext().status = ErrorStatus.skipped;
      } else if (!(body.cartItem.length > 0)) {
        errorContext().error = "CartItem should not be empty - HS, LW and WO";
        errorContext().status = ErrorStatus.skipped;
      } else {
        let errors = "";
        body.validationErrors.forEach((errorDetails: any) => {
          if (errorDetails.notificationType === "ERROR") {
            errors =
              errors +
              "ERROR: " +
              errorDetails.name +
              " DESCRIPTION: " +
              errorDetails.message +
              "\n";
          }
        });
        if (errors != "") {
          errorContext().error = `Error massages in shopping cart: ${errors}`;
          errorContext().status = ErrorStatus.skipped;
        }
        test('are there errors in validating', errors, AssertionModes.strict)
          .is('', 'Got errors in validating: \n' + errors)
      }

      test('Cart version should be defined', body.version, AssertionModes.strict)
        .isnot(undefined, 'Cart version should be defined \n' +
          JSON.stringify(
            body,
            function (key, value) {
              return key && value && typeof value !== 'number'
                ? Array.isArray(value)
                  ? '[object Array]'
                  : '' + value
                : value;
            },
            '\t',
          )
        )

      test('Cart version should be greater than 0 as we are on', parseFloat(body.version) > 0, AssertionModes.strict)
        .is(true, 'Cart version should be greater than 0 as we are on \n')


      test('cartItem should not be empty - HS, LW and WO\n', body.cartItem.length > 0, AssertionModes.strict)
        .is(true, 'cartItem should not be empty - HS, LW and WO\n' +
          JSON.stringify(
            body.cartItem.map(function (elem: any) {
              return {
                id:
                  elem.productOffering.id +
                  '   ' +
                  elem.productOffering.displayName,
              };
            }),
          )
        )
    }
    catch (e) {
      console.log(e)
    }
  });

  then(/test warning messages should be in shopping cart: '(.*)'/, (warningMessage) => {
    const body: any = responseContext().shoppingCartResponse;

    test('Cart version should be defined \n', body.version, AssertionModes.strict)
      .isnot(undefined, 'Cart version should be defined \n' +
        JSON.stringify(
          body,
          function (key, value) {
            return key && value && typeof value !== 'number'
              ? Array.isArray(value)
                ? '[object Array]'
                : '' + value
              : value;
          },
          '\t',
        )
      )

    test('Cart version should be greater than 0 as we are on', parseFloat(body.version) > 0, AssertionModes.strict)
      .is(true, 'Cart version should be greater than 0 as we are on \n')


    test('cartItem should not be empty - HS, LW and WO\n', body.cartItem.length > 0, AssertionModes.strict)
      .is(true, 'cartItem should not be empty - HS, LW and WO\n' +
        JSON.stringify(
          body.cartItem.map(function (elem: any) {
            return {
              id:
                elem.productOffering.id +
                '   ' +
                elem.productOffering.displayName,
            };
          }),
        ))

    let warnings = '';
    body.validationErrors.forEach((warningDetails: any) => {
      if (warningDetails.notificationType === 'WARNING') {
        warnings =
          warnings +
          'WARNING: ' +
          warningDetails.name +
          ' DESCRIPTION: ' +
          warningDetails.message +
          '\n';
        preconditionContext().errors = 'WARNING: ' + warningDetails.name + ' DESCRIPTION: ' + warningDetails.message
      }
    });

    test('Got errors in validating', warnings.includes(warningMessage), AssertionModes.strict)
      .is(true, 'Got errors in validating: \n' + warnings)
  });


  and(/^test shopping cart validation should contain attributes:$/, (table) => {
    let SCResponseBody: any;
    let attrsToCheck: Array<any>;
    SCResponseBody = responseContext().shoppingCartResponse;
    attrsToCheck = Common.getCharListFromValidationTable(table);
    attrsToCheck.forEach((attr) => {
      SCResponseBody.validationErrors.forEach((error: any) => {
        if (!error[attr]) {
          errorContext().error = `Error response is received due to validationError attribute ${error[attr]}, but expected ${attr} to be defined`;
          errorContext().status = ErrorStatus.skipped;
        } else if (error[attr] == null) {
          errorContext().error = `Error response is received due to validationError attribute ${error[attr]}, but expected ${attr} not to be null`;
          errorContext().status = ErrorStatus.skipped;
        }

        test(`expected ${attr} to be defined`, error[attr], AssertionModes.strict)
          .isnot(undefined, `Error response is received due to validationError attribute ${error[attr]}, but expected ${attr} to be defined`)

        test(`but expected ${attr} not to be null`, error[attr], AssertionModes.strict)
          .isnot(null, `Error response is received due to validationError attribute ${error[attr]}, but expected ${attr} not to be null`)
      });
    });
  });

  and(
    /^test shopping cart validation should contain custom rule parameters$/,
    () => {
      let SCResponseBody: any;
      SCResponseBody = responseContext().shoppingCartResponse;
      SCResponseBody.validationErrors.forEach((error: any) => {
        let custRuleParamIsValid = Common.validateCustomRuleParameters(error);

        if (!custRuleParamIsValid.valid == true) {
          errorContext().error = `Error response is received due to item: ${custRuleParamIsValid.error}`;
          errorContext().status = ErrorStatus.skipped;
        }

        test('is Error response received due to item', !!custRuleParamIsValid.valid, AssertionModes.strict)
          .is(true, `Error response is received due to item: ${custRuleParamIsValid.error}`)

      });
    },
  );
};

