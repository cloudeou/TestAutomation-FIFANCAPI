import {AssertionModes, featureContext , test} from "@cloudeou/telus-bdd";
import { Identificators } from '../../contexts/Identificators';
import FIFA_PreconditionContext  from '../../contexts/fifa/FIFA_PreconditionContext';
import ResponseContext from '../../contexts/fifa/FIFA_ResponseConntext';
import FIFA_ShoppingCartContext from '../../contexts/fifa/FIFA_ShoppingCartContext';
import { Common } from "../../../bdd-src/fifa/utils/commonBDD/Common";
import {bodyParser} from "../../../bdd-src/fifa/shopping-cart/shopping-cart.body-parser";


type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;

export const shoppingCartResponseValidationSteps = (
  {
   given,
   and,
   when,
   then,
  }:{
    [key: string]: step;
}) => {
    let preconditionContext = (): FIFA_PreconditionContext =>
        featureContext().getContextById(Identificators.FIFA_preConditionContext);
    let responseContext = (): ResponseContext =>
        featureContext().getContextById(Identificators.FIFA_ResponseContext);
    let shoppingCartContext = (): FIFA_ShoppingCartContext =>
        featureContext().getContextById(Identificators.FIFA_shoppingCartContext);

    and(/^user validate cart item categories should contain:$/, (table) => {
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        let offerings: Array<any>;
        let categoryIds: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        offerings = bodyParser.getOfferingsFromCartItems(cartItems)
        categoryIds = Common.getCategoriesFromTable(table)
        categoryIds.forEach((id) => {
            let atLeastOneHasCat = false
            offerings.forEach((offering) => {
                if (offering.category.find((c: any) => c.id == id)) atLeastOneHasCat = true
            })
            test(`expected at least one item to contain category ${id}`,atLeastOneHasCat,AssertionModes.strict)
              .is(true,`Error response is received due to cartItems, expected at least one item to contain category ${id}, but none of items contain it.`)

        })
    })

    /*and(/test user validate shopping cart (should|should not) contain (child|top) offers:/, (present,typeOffer, table) => {
        console.log(present,'present',typeOffer, 'typeOffer',table, 'table','table!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        console.log(table)
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        let offeringIds: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        offeringIds = Common.getOffersFromTable(table, null)

        test('expected cart item to contain products',cartItems.length,AssertionModes.strict)
          .isnot(0,'Error response is received due to cartItem, expected cart item to contain products, but cartItem is empty.')

        offeringIds.forEach((id) => {
            let isOfferingReferenced = false
            cartItems.forEach((item) => {
                if(typeOffer==='child')
                {
                        item.cartItem.forEach((cartItem:any) => {
                            if (cartItem.productOffering.id == id) isOfferingReferenced = true
                        })
                }
                else
                if (item.productOffering.id == id) isOfferingReferenced = true
            })
            if (present === 'should') {
                test(`due to offering ${id}, expected it to be referenced in cartItem`,isOfferingReferenced, AssertionModes.strict)
                  .is(true,`Error response is received due to offering ${id}, expected it to be referenced in cartItem, but it is not referenced.`)
            }
            else{
                test('due to offering ${id}, expected it to be not referenced in cartItem', isOfferingReferenced,AssertionModes.strict)
                  .isnot(true,`Error response is received due to offering ${id}, expected it to be not referenced in cartItem, but it is referenced.`)
            }

        })
    })*/

    //after bug with regexps will be fixed, remove it and uncomment step above
    and('test user validate shopping cart should contain child offers:', (table) => {
        console.log(table, 'table1','!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        let offeringIds: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        offeringIds = Common.getOffersFromTable(table, null)

        test('expected cart item to contain products',cartItems.length,AssertionModes.strict)
          .isnot(0,'Error response is received due to cartItem, expected cart item to contain products, but cartItem is empty.')

        offeringIds.forEach((id) => {
            let isOfferingReferenced = false
            cartItems.forEach((item) => {
                item.cartItem.forEach((cartItem:any) => {
                    if (cartItem.productOffering.id == id) isOfferingReferenced = true
                })

            })
            test(`due to offering ${id}, expected it to be referenced in cartItem`,isOfferingReferenced, AssertionModes.strict)
              .is(true,`Error response is received due to offering ${id}, expected it to be referenced in cartItem, but it is not referenced.`)

        })
    })

    //after bug with regexps will be fixed, remove it and uncomment step above
    and('test user validate shopping cart should not contain child offers:', (table) => {
        console.log(table, 'table','!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        let offeringIds: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        offeringIds = Common.getOffersFromTable(table, null)

        test('expected cart item to contain products',cartItems.length,AssertionModes.strict)
          .isnot(0,'Error response is received due to cartItem, expected cart item to contain products, but cartItem is empty.')

        offeringIds.forEach((id) => {
            let isOfferingReferenced = false
            cartItems.forEach((item) => {
                item.cartItem.forEach((cartItem:any) => {
                    if (cartItem.productOffering.id == id) isOfferingReferenced = true
                })
            })
            test('due to offering ${id}, expected it to be not referenced in cartItem', isOfferingReferenced,AssertionModes.strict)
              .isnot(true,`Error response is received due to offering ${id}, expected it to be not referenced in cartItem, but it is referenced.`)

        })
    })

    //after bug with regexps will be fixed, remove it and uncomment step above
    and('test user validate shopping cart should contain top offers:', (table) => {
        console.log(table, 'table','!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        let offeringIds: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        offeringIds = Common.getOffersFromTable(table, null)

        test('expected cart item to contain products',cartItems.length,AssertionModes.strict)
          .isnot(0,'Error response is received due to cartItem, expected cart item to contain products, but cartItem is empty.')

        offeringIds.forEach((id) => {
            let isOfferingReferenced = false
            cartItems.forEach((item) => {
                if (item.productOffering.id == id) isOfferingReferenced = true
            })
            test(`due to offering ${id}, expected it to be referenced in cartItem`,isOfferingReferenced, AssertionModes.strict)
              .is(true,`Error response is received due to offering ${id}, expected it to be referenced in cartItem, but it is not referenced.`)

        })
    })

    and('test user validate shopping cart should not contain top offers:', (table) => {
        console.log(table, 'table3','!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        let offeringIds: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        offeringIds = Common.getOffersFromTable(table, null)

        test('expected cart item to contain products',cartItems.length,AssertionModes.strict)
          .isnot(0,'Error response is received due to cartItem, expected cart item to contain products, but cartItem is empty.')

        offeringIds.forEach((id) => {
            let isOfferingReferenced = false
            cartItems.forEach((item) => {
                if (item.productOffering.id == id) isOfferingReferenced = true
            })

            test('due to offering ${id}, expected it to be not referenced in cartItem', isOfferingReferenced,AssertionModes.strict)
              .isnot(true,`Error response is received due to offering ${id}, expected it to be not referenced in cartItem, but it is referenced.`)

        })
    })

    and(/^test user validate shopping cart should contain discount:$/, (table) => {
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        let promotionMap: any;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        promotionMap = Common.getPromotionMapFromTable(table)

        test('expected cart item to contain products', cartItems.length,AssertionModes.strict)
          .isnot(0,'Error response is received due to cartItem, expected cart item to contain products, but cartItem is empty.')

        for (const [discountId, offerId] of promotionMap) {
            let cart: any;
            cart = bodyParser.getItemByProductOffering(SCResponseBody, offerId);
            test('cart not to be null',cart,AssertionModes.strict).isnot(null,'cart should not to be null')
            for (let itemPrice of cart.itemPrice) {
                for (let alteration of itemPrice.priceAlteration) {
                    test('alteration catalog id equals to discountId',alteration.catalogId,AssertionModes.strict)
                      .is(discountId,'alteration catalog should be equal to discountId')
                }
            }
        }
    })

    and(/^test user validate shopping cart should contain characteristic term:$/, (table) => {
        let SCResponseBody: JSON;
        let responseChars: Array<any>;
        let charValues: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        charValues = Common.getCharListFromValidationTable(table)
        responseChars = bodyParser.getSCChars(SCResponseBody)

        test('expected responseChars to contain chars', responseChars.length, AssertionModes.strict)
          .isnot(0,'Error response is received due to SC characteristic, expected it to contain chars, but it is empty.')

        let isTermPresent = <Boolean>responseChars.find(ch => ch.name == 9148880848313061086);
        test('expected to contain term', isTermPresent,AssertionModes.strict)
          .isnot(undefined,`Error response is received due to SC characteristic, expected it to contain term, but it is empty.`)

        charValues.forEach((value) => {
            let isValueTermPresent = <Boolean>responseChars.find(ch => ch.value == value)
            test('expected SC to contain isValueTermPresent', isValueTermPresent, AssertionModes.strict)
              .isnot(undefined,`Error response is received due to value ${value}, expected SC to contain it, but it is absent in SC.`)
        })
    })


    and(/^test user validate shopping cart top level item should contain chars:$/, async (table) => {
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        let charMap = await Common.createCharMapFromTable(table);
        Common.validateCartItemChars(cartItems, charMap)
    })

    and(/^test user validate shopping cart chars should contain:$/, (table) => {
        let SCResponseBody: JSON;
        let charNames: Array<any>;
        let responseChars: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        responseChars = bodyParser.getSCChars(SCResponseBody)
        charNames = Common.getCharListFromValidationTable(table)

        test('expected responseChars to contain chars',responseChars.length,AssertionModes.strict)
          .isnot(0,'Error response is received due to SC characteristic, expected it to contain chars, but it is empty.')
        charNames.forEach((name) => {
            let isCharPresent = <Boolean>responseChars.find(ch => ch.name == name)
            test('expected SC to contain Char', isCharPresent,AssertionModes.strict)
              .isnot(undefined,`Error response is received due to char ${name}, expected SC to contain it, but it is absent in SC.`)
        })
    })
    // ADD TO DOCS
    and(/^test user validate cart at least one item should contain price$/, () => {
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        let priceIsPresent = false;
        cartItems.forEach((cartItem) => {
            let priceIsValid = Common.validateCartItemPrice(cartItem)
            if (priceIsValid) priceIsPresent = true
        })
        test('expected at least one item to contain price',priceIsPresent,AssertionModes.strict)
          .isnot(false,`Error response is received due to price, expected at least one item to contain price, but none contain it.`)
    })

    and(/^test user validate cart item should contain price$/, () => {
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        cartItems.forEach((cartItem) => {
            let priceIsValid = Common.validateCartItemPrice(cartItem)
            test('item price should be valid', priceIsValid.valid,AssertionModes.strict)
              .isnot(undefined,`Error response is received due to item price: ${priceIsValid.error}`)
        })
    })
    //ADD TO DOCS
    and(/^test user validate at least one cart item should contain price alteration$/, () => {
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        let priceAlterationIsPresent = false;
        cartItems.forEach((cartItem) => {
            let priceAlterationIsValid = Common.validateCartItemPriceAlteration(cartItem)
            if (priceAlterationIsValid) priceAlterationIsPresent = true
        })
        test('expected at least one item to contain price alteration',priceAlterationIsPresent,AssertionModes.strict)
          .isnot(undefined,`Error response is received due to price alteration, expected at least one item to contain price alteration, but none contain it.}`)
    })

    and(/^test user validate cart item should contain price alteration$/, () => {
        let SCResponseBody: JSON;
        let cartItems: Array<any>;
        SCResponseBody = responseContext().shoppingCartResponse!
        cartItems = bodyParser.getCartItemObjects(SCResponseBody)
        cartItems.forEach((cartItem) => {
            let priceAlterationIsValid = Common.validateCartItemPriceAlteration(cartItem)
            test('priceAlterationIsValid should be valid', priceAlterationIsValid.valid, AssertionModes.strict)
              .isnot(undefined,`Error response is received due to item price alteration: ${priceAlterationIsValid.error}`)
        })
    })

    and('test user validate cart item parameters should contain:', (table) => {
        try {
            let SCResponseBody: JSON;
            let cartItems: Array<any>;
            let products: Array<any>;
            let paramsToCheck: Array<any>;
            let descriptionIsPresent: boolean;
            SCResponseBody = responseContext().shoppingCartResponse!
            cartItems = bodyParser.getCartItemObjects(SCResponseBody)
            products = bodyParser.getProductsFromCartItems(cartItems)
            paramsToCheck = Common.getParamsListFromTable(table)
            descriptionIsPresent = false
            products.forEach((product) => {
                paramsToCheck.forEach((param) => {
                    if (param === 'description') {
                        if (product.description) descriptionIsPresent = true
                    } else {
                        test(`expects ${param} to be defined`, product[param], AssertionModes.strict)
                          .isnot(undefined,`Error response is received due to product parameter ${product[param]}, but expected ${param} to be defined`)

                        test(`expected ${param} not to be null`, product[param], AssertionModes.strict)
                          .isnot(null,`Error response is received due to productOffring parameter ${product[param]}, but expected ${param} not to be null`)
                    }
                })
            })
            if (paramsToCheck.includes('description')) {
                test('product description has to be defined at least one product', descriptionIsPresent, AssertionModes.strict)
                  .isnot(undefined,`Error response is received due to product description to be defined at least one product`)
            }
        }

        catch (e) {
            console.log('error happened in /test user validate cart item parameters should contain:/ feature')
            console.log(e)
        }
    })

    and('test user validate shopping cart related party customer id', () => {
        let actualECID: String;
        let originalECID: number;
        let response: any;

        response = responseContext().shoppingCartResponse
        actualECID = response.relatedParty[1].id
        originalECID = preconditionContext().externalCustomerId!;

        test(`expected SC creator to be ${originalECID}`, actualECID, AssertionModes.strict)
          .is(originalECID,`Error response is received due to SC related party, expected SC creator to be ${originalECID}, but got ${actualECID} instead.`)
    })
}
