import { AssertionModes, featureContext, test } from "@cloudeou/telus-bdd";
import PreconditionContext from "../../contexts/ngc/PreconditionContext";
import ResponseContext from "../../contexts/ngc/ResponseConntext";
import ShoppingCartContext from "../../contexts/ngc/ShoppingCartContext";
import ProductInventoryContext from "../../contexts/ngc/ProductInventoryContext";
import { Identificators } from "../../contexts/Identificators";
import { ProductInventoryApi } from "../../../bdd-src/ngc/productInventory/productInventory.api"
import {payloadGenerator} from "../../../bdd-src/ngc/productInventory/productInventory.payload-generator";

const fifaNcApi = new ProductInventoryApi();

type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

export const productInventorySteps = ({ given, and, when, then } : { [key: string]: step }) => {
    let preconditionContext = (): PreconditionContext =>
    featureContext().getContextById(Identificators.preConditionContext);
  let responseContext = (): ResponseContext =>
    featureContext().getContextById(Identificators.ResponseContext);
  let shoppingCartContext = (): ShoppingCartContext =>
    featureContext().getContextById(Identificators.shoppingCartContext);
  let productInventoryContext = (): ProductInventoryContext =>
    featureContext().getContextById(Identificators.productInventoryContext);

    when(/^(User|user) try to get product instance(s)?$/, async () => {
        const relatedPartyRole = 'customer';
        const placeRole = 'service%20address';
        const fields = productInventoryContext().getFields();
        const limit = productInventoryContext().getLimit();
        let createCustomerResponse: any =
          responseContext().getCreateCustomerResponse();
        let customerAccountECID = preconditionContext().getExternalCustomerId();
        const addressId = preconditionContext().getAddressId();
    
        const data = {
          fields,
          limit,
          customerAccountECID,
          addressId,
        };
        const params = new payloadGenerator()
        let uri = params.getProductInventory({
          ecid: data.customerAccountECID,
          fields: data.fields,
          limit: data.limit,
          externalLocationId: data.addressId,
        });
    
        return await fifaNcApi
          .requestProductInventory(uri)
          .toPromise()
          .then((success) => {
            expect(success.response.statusCode).toBeLessThanOrEqual(206);
            const body = success.response.body;
    
            responseContext().setProductInventoryResponse(body);
          })
          .catch((error) => {
            logger.debug(`Error received: ${JSON.stringify(error)}`);
          });
      });
}