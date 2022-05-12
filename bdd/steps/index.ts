// import your steps here and export all of them as array of steps.
import {productCatalogSteps} from "./ngc/productCatalog.steps";
import {preconditionSteps} from "./ngc/precondition.steps";
import {serviceQualificationSteps} from "./ngc/serviceQualification.steps";
import {productQualificationSteps} from "./ngc/productQualification.steps";
import {createCustomerSteps} from "./ngc/createCustomer.steps";
import {createShoppingCartSteps} from "./ngc/createShoppingCart.steps";

export default [
    productCatalogSteps,
    preconditionSteps,
    serviceQualificationSteps,
    productQualificationSteps,
    createCustomerSteps,
    createShoppingCartSteps,
    productCatalogSteps];