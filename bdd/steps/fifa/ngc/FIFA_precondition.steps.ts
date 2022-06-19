import FIFA_PreconditionContext from "../../../contexts/fifa/FIFA_PreconditionContext";
import FIFA_ReportContext from "../../../contexts/fifa/FIFA_ReportContext";
import { Identificators } from "../../../contexts/Identificators";
import { TestResultStatus } from '../apis.enum';
import { AssertionModes, featureContext, test } from "@cloudeou/telus-bdd";


type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

export const FIFA_preconditionSteps = async ({ given, and, when, then } : { [key: string]: step }) => {
    let preconditionContext = (): FIFA_PreconditionContext =>
      featureContext().getContextById(Identificators.FIFA_preConditionContext);
    let repContext = (): FIFA_ReportContext =>
      featureContext().getContextById(Identificators.FIFA_reportContext);
  
    given(
      /^address shall be created under the following unit (.*)$/,
      (streetNumberid) => {
        preconditionContext().streetNumberId = streetNumberid;
      },
    );
  
    given(/^user has address with type (.*)$/, (addressType) => {
      try {
        preconditionContext().addressType = addressType;
      }
      catch (e) {
        console.log(e)
      }
    });
  
    given(/^user has address with address id (.*)$/, (addressId) => {
      preconditionContext().addressId = addressId;
    });
  
    and(/^technology type is (.*)$/, (techType) => {
      preconditionContext().technologyType = techType;
    });
  
    and(/^device type is (.*)$/, (devType) => {
      preconditionContext().deviceType = devType;
    });
  
    and(/^scenario type is (.*)$/, (scenarioType) => {
      preconditionContext().scenarioType = scenarioType;
    });
  
    and(/^street number id is (.*)$/, (streetNumberId) => {
      preconditionContext().streetNumberId = streetNumberId;
    });
  
    and(/^olt name is (.*)$/, (oltName) => {
      preconditionContext().oltName = oltName;
    });
  
    and(/^distribution channel is (.*)$/, (distChannel) => {
      try {
        preconditionContext().distributionChannel = distChannel;
      }
      catch (e) {
        console.log(e)
      }
    });
  
    and(/^EXTERNAL_ID of distribution channel is (.*)$/, (distChannelExtId) => {
      preconditionContext().distributionChannelExternalId = distChannelExtId;
    });
    //
    and(/^customer category is (.*)$/, (custCategory: string) => {
        try {
          preconditionContext().customerCategory = custCategory;
        }
        catch (e) {
          console.log(e)
        }
    });
  
    and(/^market for an address is (.*)$/, (market) => {
      preconditionContext().market = market;
    });
  
    and(/^user select odb value for address is (.*)$/, (odb) => {
      preconditionContext().odb = odb;
    });
  
    and(/^user select dpu value for address is (.*)$/, (dpu) => {
      preconditionContext().dpu = dpu;
    });
  
    when(/get address based on entered data: '(.*)'/, async (addressId: string) => {
      try{
        console.log(`addressId: ${addressId}`);
        preconditionContext().addressId = addressId;
      }
      catch (e) {
        console.log(e)
      }
    });
  
    then('address id should be returned', () => {
        try {
          test('address id should be returned',preconditionContext().addressId,AssertionModes.strict,).isnot(null, 'address id was not returned');
        }
        catch (e) {
          console.log(e)
        }
    });
  
    then('test case passed', () => {
      repContext().setTestResult(TestResultStatus.Pass);
    });
  
    and('drop customer id', async () => {
      preconditionContext().externalCustomerId = null;
      preconditionContext().customerObjectId = null;
    });
  };
  