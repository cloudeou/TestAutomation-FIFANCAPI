import ResponseContext from "../../contexts/ngc/ResponseConntext"
import {featureContext} from "@cloudeou/telus-bdd";
import {Identificators} from "../../contexts/Identificators";
import ShoppingCartContext from "../../contexts/ngc/ShoppingCartContext";
import {PromotionApi} from "../../../bdd-src/ngc/promotion/promotion.api"
import PreconditionContext from "../../contexts/ngc/PreconditionContext"
import {Common} from "../../../bdd-src/utils/commonBDD/Common";
import {replacerFunc} from "../../../bdd-src/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import {bodyParser} from "../../../bdd-src/ngc/promotion/promotion.body-parser";

type step = (
    stepMatcher: string | RegExp,
    callback: (...args: any) => void
) => void;


let price = new Map();

export const productCatalogSteps = ({ when, and, then}: { [key: string]: step }) => {
    const ResponseContext = (): ResponseContext =>
        featureContext().getContextById(Identificators.ResponseContext);
    const shoppingCartContext = (): ShoppingCartContext =>
        featureContext().getContextById(Identificators.shoppingCartContext);
    const fifaNcApi = new PromotionApi();
    const PreconditionContext = (): PreconditionContext =>
        featureContext().getContextById(Identificators.preConditionContext);

    and(
        /^user (.*) the following manual (discount|discounts):$/,
        async (action, dummy, table) => {
            let promotionMap = await fifaNcApi.getMapFromPromotionTable(table);
            if (
                String(action).toLowerCase() === 'apply' ||
                String(action).toLowerCase() === 'add'
            ) {
                shoppingCartContext().setPromotions(promotionMap, 'Add');
            } else if (
                String(action).toLowerCase() === 'remove' ||
                String(action).toLowerCase() === 'delete'
            ) {
                shoppingCartContext().setPromotions(promotionMap, 'Remove');
            }
            shoppingCartContext().setAddingPromotion();
        },
    );


    when(/^user try to (apply|remove) promotions$/, async () => {
        price.clear();
        let externalLocationId = PreconditionContext().getAddressId();
        let distributionChannel = PreconditionContext().getDistributionChannel();
        let customerCategory = PreconditionContext().getCustomerCategory();
        let promotionMap;
        if (shoppingCartContext().checkIfAddingPromotion()) {
            promotionMap = shoppingCartContext().getPromotions();
        } else {
            shoppingCartContext().resetPromotions();
        }
        let response = ResponseContext().getSCresponse();
        let shoppingCartId = shoppingCartContext().getShoppingCartId();
        let responseText = JSON.stringify(response);




        try{
            const pcResponse = await fifaNcApi.requestPromotion({
                customerCategory,
                distributionChannel,
                externalLocationId,
                response,
                promotionMap,
                shoppingCartId
            });
            console.log(JSON.stringify(pcResponse));
            Common.checkValidResponse(pcResponse, 200);
            const response = JSON.parse(pcResponse.data);
            const responseText = JSON.stringify(response, replacerFunc(), '\t');
            ResponseContext().SCresponse = response;
            ResponseContext().SCresponseBody = responseText;
        }
        catch (error) {
            console.log(error)
        }


    then(/^promotions are (applied|removed)$/, () => {
        let response: any;
        let responseText: any;
        response = ResponseContext().getSCresponse();
        responseText = ResponseContext().getSCresponseBody();
        let promotions = shoppingCartContext().getPromotions();
        var addPromotion = null;
        var removePromotion = null;
        for (let [key, value] of promotions) {
            if (String(value) === 'Add') {
                addPromotion = key;
            } else if (String(value) === 'Remove') {
                removePromotion = key;
            }
        }
        if (addPromotion !== null) {
            bodyParser.validatePromotionsInResponse(addPromotion, response);
        }
        if (removePromotion !== null) {
            bodyParser.validatePromotionsNotInResponse(removePromotion, response);
        }
    });





}