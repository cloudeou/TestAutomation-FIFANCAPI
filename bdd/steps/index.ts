// import your steps here and export all of them as array of steps.
import {productCatalogSteps} from "./ngc/productCatalog.steps";
import {preconditionSteps} from "./ngc/precondition.steps";
import {serviceQualificationSteps} from "./ngc/serviceQualification.steps";
import {createShoppingCartSteps} from "./ngc/createShoppingCart.steps";
import {shoppingCartResponseValidationSteps} from './ngc/ShoppingCartResposneValidation.steps';
import {updateShoppingCartSteps} from  './ngc/updateShoppingCart.steps';
import {validateShoppingCartSteps} from "./ngc/validateShoppingCart.steps";
import {submitShoppingCartSteps} from "./ngc/submitShoppingCart.steps";
import {productQualificationSteps} from "./ngc/productQualification.steps";
import {createCustomerSteps} from "./ngc/createCustomer.steps";
import {promotionSteps} from "./ngc/promotion.steps";
import {backendSteps} from './ngc/backend.steps'

export default [
    productCatalogSteps,
    preconditionSteps,
    serviceQualificationSteps,
    createShoppingCartSteps,
    shoppingCartResponseValidationSteps,
    updateShoppingCartSteps,
    validateShoppingCartSteps,
    submitShoppingCartSteps,
    productQualificationSteps,
    createCustomerSteps,
    promotionSteps,
    backendSteps
];