import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import {Identificators} from "../../contexts/Identificators";
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
        test('preconditions - Address id is not null',
            preconditionContext().addressId,
            AssertionModes.strict
        ).isnot(null,'Address id is null');
    });

    when('user check availability', async () => {
        let externalLocationId = preconditionContext().addressId;
        try {
                const sqResponse = await fifaNcApi.requestServiceQualification(externalLocationId);
                if (typeof sqResponse !== 'undefined')
                {
                    Common.checkValidResponse(sqResponse, 200);
                    ResponseContext().shoppingCartResponse = sqResponse.data
                }
                else throw new Error(`Address qualification is failed`);
        }
        catch (error){
            console.log("ERROR", error);
            test('Error response should not be received', true,AssertionModes.strict)
                .is(false,'Error response is received\n' + JSON.stringify(error, null, '\t'))
        }
    })
    then(/^address should be qualified for (.*)$/, (value) => {
        test(
            'Technology is present in response',
            Common.IsItemQualified(
               value,
               ResponseContext().shoppingCartResponse
            ),
            AssertionModes.strict,
        ).is(true, `Technology is not present in response ${value}`);
    });
}