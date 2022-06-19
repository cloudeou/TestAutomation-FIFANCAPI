import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import {Identificators} from "../../../contexts/Identificators";
import {Common} from "../../../../bdd-src/fifa/utils/commonBDD/Common";
import FIFA_PreconditionContext from "../../../contexts/fifa/FIFA_PreconditionContext";
import ResponseContext from "../../../contexts/fifa/FIFA_ResponseConntext";
import {ServiceQualificationApi} from "../../../../bdd-src/fifa/serviceQualification/sq.api";


type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

export const FIFA_serviceQualificationSteps = ({ when, and, then, given}: { [key: string]: step }) => {
    const preconditionContext = (): FIFA_PreconditionContext =>
        featureContext().getContextById(Identificators.FIFA_preConditionContext);
    const ResponseContext = (): ResponseContext =>
        featureContext().getContextById(Identificators.FIFA_ResponseContext);

    const fifaNcApi = new ServiceQualificationApi();

    given('preconditions by user are selected', () => {
        try {
          test('preconditions - Address id is not null',
            preconditionContext().addressId,
            AssertionModes.strict
          ).isnot(null,'Address id is null');
        }
        catch (e) {
          console.log(e)
        }
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
        try {
          test(
            'Technology is present in response',
            Common.IsItemQualified(
              value,
              ResponseContext().shoppingCartResponse
            ),
            AssertionModes.strict,
          ).is(true, `Technology is not present in response ${value}`);
        }
        catch (e) {
          console.log(e)
        }
    });

    and(/^address is not qualified for (.*)$/, (techType) => {
        console.log("techType ", techType)
        test('Technology is not present in response',
          Common.IsItemQualified(
            techType,
            ResponseContext().shoppingCartResponse,
          ),
          AssertionModes.strict,
        ).is(false,  'Technology is present in response' + techType,);
      });
}