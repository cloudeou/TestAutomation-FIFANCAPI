// import your steps here and export all of them as array of steps.
import {productCatalogSteps} from "./ngc/productCatalog.steps";
import {preconditionSteps} from "./ngc/precondition.steps";
import {serviceQualificationSteps} from "./ngc/serviceQualification.steps";
import {createShoppingCartSteps} from "./ngc/createShoppingCart.steps";
import {shoppingCartResponseValidationSteps} from './ngc/ShoppingCartResposneValidation.steps';
import  {updateShoppingCartSteps} from  './ngc/updateShoppingCart.steps';
import {validateShoppingCartSteps} from "./ngc/validateShoppingCart.steps";

export default [
    productCatalogSteps,
    preconditionSteps,
    serviceQualificationSteps,
    createShoppingCartSteps,
    shoppingCartResponseValidationSteps,
    updateShoppingCartSteps,
    validateShoppingCartSteps
];