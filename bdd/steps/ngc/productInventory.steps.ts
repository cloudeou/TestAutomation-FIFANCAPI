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
    callback: (...args: any) => void
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
    
        try {
            const productInventoryResponse = await fifaNcApi.requestProductInventory(uri)

            console.log(JSON.stringify(productInventoryResponse));

            test(
                'Product inventory response created successfully',
                productInventoryResponse.status <= 206,
                AssertionModes.strict,
                ).is(true, 'Product inventory response did not create');
                
            const body = productInventoryResponse.data
            responseContext().setProductInventoryResponse(body);
        }
        catch(error: any){
            console.log('Error received: '+ error.response.data)
            throw new Error(`Product inventory response creation is failed`);
        }
      
      });

    and(/^user set fields: (.*)$/, async (fields) => {
        productInventoryContext().setFields(fields);
      });
    
    and(/^user set the limit = (\d+)$/, async (limit) => {
        productInventoryContext().setLimit(limit);
      });

    then(/^(the)?(\s)*list of following product instances shall be available:$/,
        async (dummy: any, dummy1: any, productname: any) => {
          let productInstanceAvailable = true;
          let errormsg = '';
          const body = responseContext().getProductInventoryResponse();
          const productIdsReceived: string[] = [];
          const productNameReceived: string[] = [];

          for (let index = 0; index < body.length; index++) {
            const productnamereceived = String(body[index].productOffering.name);
            const productidreceived = String(body[index].productOffering.id);
            const productSpecificationName = String(
              body[index].productSpecification?.name,
            );
            const prodductSpecificationId = String(
              body[index].productSpecification?.id,
            );
            const productstatusreceived = body[index].status;
            productIdsReceived.push(productidreceived);
            console.log(`productinvetoryIds: ${productIdsReceived}`);

            productNameReceived.push(productnamereceived);
            console.log(`productinvetoryNames:${productNameReceived}`);

            productNameReceived.push(productSpecificationName);
            productIdsReceived.push(prodductSpecificationId);
          }

          productname.forEach((row: any) => {
            let myVar;
            myVar =
              row.productInstances !== undefined ||
              row.productInstances !== 'undefined'
                ? row.productInstances
                : undefined;
            myVar =
              myVar === undefined
                ? row.OfferId !== undefined || row.OfferId !== 'undefined'
                  ? row.OfferId
                  : undefined
                : myVar;
    
            if (myVar === undefined || myVar === 'undefined') {
              errormsg =
                errormsg +
                "Please check the column name either 'productInstances' or 'OfferId'\n";
            }
            if (
              !(
                String(productIdsReceived).includes(String(myVar)) ||
                String(productNameReceived).includes(String(myVar))
              )
            ) {
              productInstanceAvailable = false;
              errormsg = errormsg + myVar + ' is not available.';
            }
          });
          test(
            'No error message should be in product instances',
            errormsg === '',
            AssertionModes.strict,
          ).is(true, 'Error message is: ' + errormsg)
        },
      );

    and('status of the products shall be the following:', async (productname) => {
        const body = responseContext().getProductInventoryResponse();

        productname.forEach((row: any) => {
          for (let index = 0; index < body.length; index++) {
            let psName = String(body[index].productSpecification?.name)
              ?.trim()
              ?.toLowerCase();
            let psId = String(body[index].productSpecification?.id)
              ?.trim()
              ?.toLowerCase();
            let poId = String(body[index].productOffering.id).trim().toLowerCase();
            let poName = String(body[index].productOffering.name)
              .trim()
              .toLowerCase();
    
            let idToCheck = !!row.OfferId ? row.OfferId : row.ProductOfferingId;
            let roId = String(idToCheck).trim().toLowerCase();
            if (
              poName === roId ||
              poId === roId ||
              psName === roId ||
              psId === roId
            ) {
              const productstatus = body[index].status;
              test(
                `product instance${psName} status`,
                productstatus,
                AssertionModes.strict,
              ).is(row.Status, `product instance${psName} status is ${productstatus}`);
            }
          }
        });
      });

    and(/check products (have|haven't) equipments:/, async (availability: string, productEquipmentTable: any) => {
        const inventoryResponse = responseContext().getProductInventoryResponse();
       
        productEquipmentTable.forEach(({ productOfferId, equipmentOfferId, equipmentCount }: any) => {
    
          const foundEquipments = inventoryResponse.filter(
            ({ productOffering }: any) => productOffering.id === equipmentOfferId,
          );
          availability === 'have'
          ? test(
            `Equipment should present`, 
            foundEquipments.length > 0,
            AssertionModes.strict,
          ).is(true, `Equipment with id: ${equipmentOfferId} not found`)
          : test(
            `Equipment should not present`,
            foundEquipments.length > 0,
            AssertionModes.strict,
          ).isnot(true, `Equipment with id: ${equipmentOfferId} was found`)
         
    
          const foundProduct = inventoryResponse.find(
            ({ productOffering }: any) => productOffering.id === productOfferId,
          );
          test(
            `Product should be defined`,
            foundProduct, 
            AssertionModes.strict,
            ).isnot(undefined, `Product with id: ${productOfferId} not found`)
          // availability === 'have'
          // ? expect(foundProduct, `Product with id: ${productOfferId} not found`).not.toBeUndefined()
          // : expect(foundProduct, `Product with id: ${productOfferId} not found`).not.toBeUndefined()
    
          const foundChilds = foundProduct.productRelationship.filter(
            ({ product }: any) => {
              const foundChild = foundEquipments.find(
                (equipment: any) => product.id === equipment.id,
              );
              if (foundChild) {
                return true;
              }
            },
          );
          availability === 'have'
          ? test(
                `Found childs are equal to equipment count`,
                foundChilds.length,
                AssertionModes.strict,
            ).is(Number(equipmentCount), `Found childs aren't equal to equipment count`)
          : test(
            `Found childs are equal to equipment count`,
              foundChilds.length,
              AssertionModes.strict,
            ).is(0,`Found childs aren't equal to equipment count`)
    
        });
      });
}