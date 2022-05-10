import { AssertionModes, featureContext, test } from "@cloudeou/telus-bdd";
import PreconditionContext from "../../contexts/ngc/PreconditionContext";
import ResponseContext from "../../contexts/ngc/ResponseConntext";
import { Identificators } from "../../contexts/Identificators";
import { RandomValueGenerator } from "../../../bdd-src/utils/common/RandomValueGenerator"
import { CreateCustomerSample } from "../../../bdd-src/ngc/createCustomer/CreateCustomerSample.body-samples"
import { CreateCustomerApi } from "../../../bdd-src/ngc/createCustomer/createCustomer.api"


type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

const fifaNcApi = new CreateCustomerApi();

export const createCustomerSteps = ({ given, and, when, then } : { [key: string]: step }) => {
    let preconditionContext = (): PreconditionContext =>
      featureContext().getContextById(Identificators.preConditionContext);
    let responseContext = (): ResponseContext =>
      featureContext().getContextById(Identificators.ResponseContext);

      when('user try to create customer', async () => {
        let customerEmail = preconditionContext().getCustomerEmail();

        if (!customerEmail) {
          customerEmail =
          `brJest_${new Date().getMilliseconds().toString()}` +
          +RandomValueGenerator.getRandomInt(1, 999999) +
          'Jest' +
          RandomValueGenerator.getRandomInt(1, 999999) +
          RandomValueGenerator.generateRandomAlphaNumeric(5) +
          '@email.com';
          preconditionContext().setCustomerEmail(customerEmail);
        }
        console.log(`Cutomer email address: ${customerEmail}`);
        const addressId = preconditionContext().getAddressId();
        
        const body = CreateCustomerSample.createCustomerBody(customerEmail, addressId);

       try{
        const CreateCustomerResponse = await fifaNcApi.verifyCreateCustomerAccountTBAPI(body);

        console.log(JSON.stringify(CreateCustomerResponse));

        if (CreateCustomerResponse !== null && typeof CreateCustomerResponse !== 'undefined') {
          test(
          'Customer account created successfully',
            CreateCustomerResponse,
            AssertionModes.strict,
          ).isnot(null, 'CreateCustomerResponse should not be empty');

          const body = CreateCustomerResponse;
          responseContext().setCreateCustomerResponse(body);
       } else {
         console.log("TRY")
       }
      }
       catch(error: any) {
         console.log('CreateCustomerError: '+ error.response.data)
        throw new Error(`Customer creation is failed`);
       }
    });

    then('external customer id should be returned', () => {
      let response: any;
      response = responseContext().getCreateCustomerResponse();
      let ecid = response.ecid; //99178852;
      let customerId = response.customerId; //9159028580013802859;
      test('ECID should create', ecid,AssertionModes.strict).isnot(undefined,'ECID is not created');
      test('ECID should create', ecid,AssertionModes.strict).isnot(null,'ECID is not created');
      preconditionContext().setExternalCustomerId(ecid);
      preconditionContext().setCustomerObjectId(customerId);
    });

    and('billing account number is returned', () => {
      let response: any;
      response = responseContext().getCreateCustomerResponse();
      let ban = response.ban;
      test('Ban should create', ban, AssertionModes.strict).isnot(undefined,'Ban is not created');
      test('Ban should create', ban, AssertionModes.strict).isnot(null,'Ban is not created');;
      //response.customerBillingAccountIds
      //response.customerDefaultBillingAccountId
      //response.customerAccountNumber
    });

    and('credit check is performed', () => {
      let response: any;
      response = responseContext().getCreateCustomerResponse();
      let checkPerformed = response.creditCheckPerformed;
      test('Check is performed', checkPerformed, AssertionModes.strict).isnot(true,'credit check is not performed');;
    });

  }
    
