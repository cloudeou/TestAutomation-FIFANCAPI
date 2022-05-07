import PreconditionContext from "../../contexts/ngc/PreconditionContext";
import ReportContext from "../../contexts/ngc/ReportContext";
import { Identificators } from "../../contexts/Identificators";
import { Common } from "../../../bdd-src/utils/commonBDD/Common";
import { TestResultStatus } from '../apis.enum';
import { AssertionModes, featureContext, test } from "@cloudeou/telus-bdd";


type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

export const preconditionSteps = async ({ given, and, when, then } : { [key: string]: step }) => {
    let preconditionContext = (): PreconditionContext =>
      featureContext().getContextById(Identificators.preConditionContext);
    let repContext = (): ReportContext =>
      featureContext().getContextById(Identificators.reportContext);
  
    given(
      /^address shall be created under the following unit (.*)$/,
      (streetNumberid) => {
        preconditionContext().setStreetNumberId(streetNumberid);
      },
    );
  
    given(/^user has address with type (.*)$/, (addressType) => {
      preconditionContext().setAddressType(addressType);
    });
  
    // given('addresses are in process env', () => {
    //   preconditionContext().setAllAddressesFromEnv();
    // });
    // given('testData from dbbootstrap', () => {
    //   preconditionContext().setBootstrapData();
    // });
  
    given(/^user has address with address id (.*)$/, (addressId) => {
      preconditionContext().setAddressId(addressId);
    });
  
    and(/^technology type is (.*)$/, (techType) => {
      preconditionContext().setTechnologyType(techType);
    });
  
    and(/^device type is (.*)$/, (devType) => {
      preconditionContext().setDeviceType(devType);
    });
  
    and(/^scenario type is (.*)$/, (scenarioType) => {
      preconditionContext().setScenarioType(scenarioType);
    });
  
    and(/^street number id is (.*)$/, (streetNumberId) => {
      preconditionContext().setStreetNumberId(streetNumberId);
    });
  
    and(/^olt name is (.*)$/, (oltName) => {
      preconditionContext().setOltName(oltName);
    });
  
    and(/^distribution channel is (.*)$/, (distChannel) => {
      preconditionContext().setDistributionChannel(distChannel);
    });
  
    and(/^EXTERNAL_ID of distribution channel is (.*)$/, (distChannelExtId) => {
      preconditionContext().setDistributionChannelExternalId(distChannelExtId);
    });
  
    and(/^customer category is (.*)$/, (custCategory: string) => {
      preconditionContext().setCustomerCategory(custCategory);
    });
  
    and(/^market for an address is (.*)$/, (market) => {
      preconditionContext().setMarket(market);
    });
  
    and(/^user select odb value for address is (.*)$/, (odb) => {
      preconditionContext().setOdb(odb);
    });
  
    and(/^user select dpu value for address is (.*)$/, (dpu) => {
      preconditionContext().setDpu(dpu);
    });
  
    when(/get address based on entered data: '(.*)'/, async (addressId: string) => {
      console.log(`addressId: ${addressId}`);
      preconditionContext().setAddressId(addressId);
    });
  
    then('address id should be returned', () => {
        test('address id should be returned',preconditionContext().getAddressId(),AssertionModes.strict,).isnot(null, 'address id was not returned');
    });
  
    then('test case passed', () => {
      repContext().setTestResult(TestResultStatus.Pass);
      // repContext().writeTestResultFile();
    });
  
    and('drop customer id', async () => {
      preconditionContext().setExternalCustomerId(null);
      preconditionContext().setCustomerObjectId(null);
    });
  };
  