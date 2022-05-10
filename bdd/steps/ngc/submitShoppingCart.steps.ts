import { featureContext, postgresQueryExecutor,test,AssertionModes } from "@cloudeou/telus-bdd";
import { Identificators } from '../../contexts/Identificators';
import PreconditionContext  from '../../contexts/ngc/PreconditionContext';
import ResponseContext from '../../contexts/ngc/ResponseConntext';
import ShoppingCartContext from '../../contexts/ngc/ShoppingCartContext';
import ErrorContext from "../../contexts/ngc/ErrorContext";
import { ErrorStatus } from "../../../bdd-src/utils/error-status";
import { Common } from "../../../bdd-src/utils/commonBDD/Common";
import {replacerFunc} from "../../../bdd-src/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import { writeSoIdQuery } from "../../../bdd-src/ngc/db/db-queries";
import {AxiosResponse} from "axios";

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

  when('user try to submit shopping cart', async () => {
    const shoppingCartId = shoppingCartContext().getShoppingCartId();
    const distributionChannel = preconditionContext().getDistributionChannel();
    const customerCategory = preconditionContext().getCustomerCategory();
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
      responseContext().setShoppingCartResponse(response.data);
      responseContext().setshopppingCartResonseText(
        JSON.stringify(response, replacerFunc(), '\t'),
      );
    }
    catch (error: any) {
      console.log(error);
      errorContext().error = error;
      errorContext().status = ErrorStatus.failed;
      responseContext().SCstatusCode = error.response.status;
      responseContext().SCresponse = error.response;
      responseContext().SCresponseBody = error.response.data;
      test('is error response received', true, AssertionModes.strict)
        .is(false,'Error response is received\n' + JSON.stringify(error, null, '\t'))
    }
  });

  then('sales order id should be returned', async () => {
    const body: any = responseContext().getShoppingCartResponse();
    const responseText: any = responseContext().getshoppingCartResponseText();

    test('SalesOrderId should be defined\n', body.id, AssertionModes.strict)
      .isnot(undefined, 'SalesOrderId should be defined\n' + responseText)

    test('SalesOrderId should not be null\n', body.id, AssertionModes.strict)
      .isnot(null,'SalesOrderId should not be null\n' + responseText)

    shoppingCartContext().setSalesOrderId(body.id);


    await retry(
      async function (options) {
        // options.current, times callback has been called including this call
        return await du
          .select(dbcfg, dq.getSalesOrderStatus(dbcfg, body.id))
          .then((response) => {
            response = String(response).replace('6#009B00$', '');
            if (
              !(
                response.includes('Processing') ||
                response.includes('Processed') ||
                response.includes('Superseded')
              )
            ) {
              throw 'Sales Order status is not Processing' + response;
            }
          });
      },
      {
        max: 5, // maximum amount of tries
        timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
        backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      },
    );
  });
};
