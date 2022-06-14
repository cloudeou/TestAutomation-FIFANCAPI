// import your steps here and export all of them as array of steps.
import {FIFA_productCatalogSteps} from "./fifa/ngc/FIFA_productCatalog.steps";
import {FIFA_preconditionSteps} from "./fifa/ngc/FIFA_precondition.steps";
import {FIFA_serviceQualificationSteps} from "./fifa/ngc/FIFA_serviceQualification.steps";
import {FIFA_createShoppingCartSteps} from "./fifa/ngc/FIFA_createShoppingCart.steps";
import {shoppingCartResponseValidationSteps} from './fifa/ngc/FIFA_ShoppingCartResposneValidation.steps';
import {FIFA_updateShoppingCartSteps} from './fifa/ngc/FIFA_updateShoppingCart.steps';
import {FIFA_validateShoppingCartSteps} from "./fifa/ngc/FIFA_validateShoppingCart.steps";
import {FIFA_submitShoppingCartSteps} from "./fifa/ngc/FIFA_submitShoppingCart.steps";
import {FIFA_productQualificationSteps} from "./fifa/ngc/FIFA_productQualification.steps";
import {FIFA_createCustomerSteps} from "./fifa/ngc/FIFA_createCustomer.steps";
import {FIFA_promotionSteps} from "./fifa/ngc/FIFA_promotion.steps";
import {FIFA_backendSteps} from './fifa/ngc/FIFA_backend.steps'

export default [
    FIFA_productCatalogSteps,
    FIFA_preconditionSteps,
    FIFA_serviceQualificationSteps,
    FIFA_createShoppingCartSteps,
    shoppingCartResponseValidationSteps,
    FIFA_updateShoppingCartSteps,
    FIFA_validateShoppingCartSteps,
    FIFA_submitShoppingCartSteps,
    FIFA_productQualificationSteps,
    FIFA_createCustomerSteps,
    FIFA_promotionSteps,
    FIFA_backendSteps
];
