import { featureContext, postgresQueryExecutor,test,AssertionModes } from "@cloudeou/telus-bdd";
import { Identificators } from '../../contexts/Identificators';
import PreconditionContext  from '../../contexts/ngc/PreconditionContext';
import ResponseContext from '../../contexts/ngc/ResponseConntext';
import ShoppingCartContext from '../../contexts/ngc/ShoppingCartContext';
import ErrorContext from "../../contexts/ngc/ErrorContext";
import { ErrorStatus } from "../../../bdd-src/utils/error-status";
import { Common } from "../../../bdd-src/utils/commonBDD/Common";
import {replacerFunc} from "../../../bdd-src/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import { getSalesOrderStatusQuery } from "../../../bdd-src/ngc/db/db-queries";
import {AxiosResponse} from "axios";
import retry from 'retry-as-promised';
import {DbProxyApi} from "../../../bdd-src/ngc/db/db-proxy-api/db-proxy.api";

type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;

export const submitShoppingCartSteps = ({
  when,
  then,
  and,
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
  const dbProxy = new DbProxyApi();

  when('user try to submit shopping cart', async () => {
    const shoppingCartId = shoppingCartContext().shoppingCartId;
    const distributionChannel = preconditionContext().distributionChannel;
    const customerCategory = preconditionContext().customerCategory;
    let distributionChannelExternalId =
      shoppingCartContext().distributionChannelExternalId;
    const shoppingCartApi = shoppingCartContext().shoppingCartApiInstance;

    let distChannelOption = Common.resolveAddressId(
      distributionChannelExternalId,
      distributionChannel
    );

    try {
      const response: AxiosResponse = await shoppingCartApi.submitShoppingCart({
        distributionChannel: distChannelOption,
        customerCategory,
      });
      Common.checkValidResponse(response);
      responseContext().shoppingCartResponse = response.data;
      responseContext().shopppingCartResonseText = JSON.stringify(response, replacerFunc(), '\t');
    }
    catch (error: any) {
      console.log(error);
      errorContext().error = error;
      errorContext().status = ErrorStatus.failed;
      responseContext().SCstatusCode = error.response.status;
      responseContext().shoppingCartResponse = error.response.data;
      test('is error response received', true, AssertionModes.strict)
        .is(false,'Error response is received\n' + JSON.stringify(error, null, '\t'))
    }
  });

  then('sales order id should be returned', async () => {
    const body: any = responseContext().shoppingCartResponse;
    const responseText: any = responseContext().shoppingCartResponseText;

    test('SalesOrderId should be defined\n', body.id, AssertionModes.strict)
      .isnot(undefined, 'SalesOrderId should be defined\n' + responseText)

    test('SalesOrderId should not be null\n', body.id, AssertionModes.strict)
      .isnot(null,'SalesOrderId should not be null\n' + responseText)

    shoppingCartContext().salesOrderId = body.id;

    await retry(
      async function (options: any) {
        // options.current, times callback has been called including this call
        try {
          const response = await dbProxy.executeQuery(getSalesOrderStatusQuery(body.id));
          let filteredResponse = String(response).replace('6#009B00$', '');
          if (
            !(
              filteredResponse.includes('Processing') ||
              filteredResponse.includes('Processed') ||
              filteredResponse.includes('Superseded')
            )
          ) {
            throw 'Sales Order status is not Processing' + filteredResponse;
          }

          return response

        } catch (error: any) {
          errorContext().status = ErrorStatus.skipped;
          errorContext().error = `Error while getting sales order status from DB: ${JSON.stringify(
            error
          )}`;
        }
      },
      {
        max: 5, // maximum amount of tries
        timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
        backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      },
    );
  });
};
