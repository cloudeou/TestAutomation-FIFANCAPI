import ProductCatalogContext from "../../contexts/ngc/ProductCatalogContext";
import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import {Identificators} from "../../contexts/Identificators";
import {ProductCatalogApi} from "../../../bdd-src/ngc/productCatalog/pc.api";
import {Common} from "../../../bdd-src/utils/commonBDD/Common";
import PreconditionContext from "../../contexts/ngc/PreconditionContext";
import ResponseContext from "../../contexts/ngc/ResponseConntext";
import {ServiceQualificationApi} from "../../../bdd-src/ngc/serviceQualification/sq.api";


type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

export const serviceQualificationSteps = ({ when, and, then, given}: { [key: string]: step }) => {
    const preconditionContext = (): PreconditionContext =>
        featureContext().getContextById(Identificators.preConditionContext);
    const ResponseContext = (): ResponseContext =>
        featureContext().getContextById(Identificators.ResponseContext);

    const fifaNcApi = new ServiceQualificationApi();

    given('preconditions by user are selected', () => {
        test('Address id is not null',
            preconditionContext().getAddressId(),
            AssertionModes.strict
        ).isnot(null,'Address id is null');
    });

    when('user check availability', async () => {
        let externalLocationId = preconditionContext().getAddressId();
        try {
                const sqResponse = await fifaNcApi.requestServiceQualification(externalLocationId);
                if (typeof sqResponse !== 'undefined')
                {
                    Common.checkValidResponse(sqResponse, 200);
                    ResponseContext().setResponse("SC",sqResponse);
                }
                else throw new Error(`Address qualification is failed`);
        }
        catch (e){
            console.log("ERROR", e);
            // test('Catch error',
            //     true,
            //     AssertionModes.strict
            // ).is(false,'Error response is received\n' + JSON.stringify(e, null, '\t'))
        }
    })
    then(/^address should be qualified for (.*)$/, (value) => {
        console.log("inside step");
        console.log(value);
        // test(
        //     'Technology is present in response',
        //     Common.IsItemQualified(
        //         value,
        //         ResponseContext().SCresponse(),
        //     ),
        //     AssertionModes.strict,
        // ).is(true, `Technology is not present in response ${value}`);
    });
}