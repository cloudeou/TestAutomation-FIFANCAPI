import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import FIFA_PreconditionContext from "../../contexts/fifa/FIFA_PreconditionContext";
import ResponseContext from "../../contexts/fifa/FIFA_ResponseConntext";
import {Identificators} from "../../contexts/Identificators";
import {RandomValueGenerator} from "../../../bdd-src/fifa/utils/common/RandomValueGenerator"
import {CreateCustomerSample} from "../../../bdd-src/fifa/createCustomer/CreateCustomerSample.body-samples"
import {CreateCustomerApi} from "../../../bdd-src/fifa/createCustomer/createCustomer.api"
import {MailerApi} from "../../../bdd-src/fifa/utils/mailer/MailerApi";


type step = (
  stepMatcher: string | RegExp,
  callback: (args: any) => void
) => void;

const fifaNcApi = new CreateCustomerApi();

export const createCustomerSteps = ({given, and, when, then}: { [key: string]: step }) => {
  let preconditionContext = (): FIFA_PreconditionContext =>
    featureContext().getContextById(Identificators.FIFA_preConditionContext);
  let responseContext = (): ResponseContext =>
    featureContext().getContextById(Identificators.FIFA_ResponseContext);


  and('create real email address for API', async () => {
    const emailInfo = await MailerApi.createTestEmail();
    console.log(emailInfo?.emailAddress);
    test('The real email was created', emailInfo, AssertionModes.strict)
      .isnot(null,'The real email was not created')
    if(emailInfo) {
      preconditionContext().customerEmail = emailInfo.emailAddress;
      preconditionContext().emailId = emailInfo.inboxId;
    }

  });

  when('user try to create customer', async () => {
    let customerEmail = preconditionContext().customerEmail;

    if (!customerEmail) {
      customerEmail =
        `brJest_${new Date().getMilliseconds().toString()}` +
        +RandomValueGenerator.getRandomInt(1, 999999) +
        'Jest' +
        RandomValueGenerator.getRandomInt(1, 999999) +
        RandomValueGenerator.generateRandomAlphaNumeric(5) +
        '@email.com';
      preconditionContext().customerEmail = customerEmail;
    }
    console.log(`Customer email address: ${customerEmail}`);
    const addressId = preconditionContext().addressId;

    const body = CreateCustomerSample.createCustomerBody(customerEmail, addressId);

    try {
      const CreateCustomerResponse = await fifaNcApi.verifyCreateCustomerAccountTBAPI(body);

      console.log(JSON.stringify(CreateCustomerResponse));

      if (CreateCustomerResponse !== null && typeof CreateCustomerResponse !== 'undefined') {
        test(
          'Customer account created successfully',
          CreateCustomerResponse,
          AssertionModes.strict,
        ).isnot(null, 'CreateCustomerResponse should not be empty');

        const body = CreateCustomerResponse;
        responseContext().createCustomerResponse = body;
      }
    } catch (error: any) {
      console.log('CreateCustomerError: ' + error.response.data)
      throw new Error(`Customer creation is failed`);
    }
  });

  then('external customer id should be returned', () => {
    let response: any;
    response = responseContext().createCustomerResponse;
    let ecid = response.ecid; //99178852;
    let customerId = response.customerId; //9159028580013802859;
    test('ECID should create', ecid, AssertionModes.strict).isnot(undefined, 'ECID is not created');
    test('ECID should create', ecid, AssertionModes.strict).isnot(null, 'ECID is not created');
    preconditionContext().externalCustomerId = ecid;
    preconditionContext().customerObjectId = customerId;
  });

  and('billing account number is returned', () => {
    let response: any;
    response = responseContext().createCustomerResponse;
    let ban = response.ban;
    test('Ban should create', ban, AssertionModes.strict).isnot(undefined, 'Ban is not created');
    test('Ban should create', ban, AssertionModes.strict).isnot(null, 'Ban is not created');
    ;

  });

  and('credit check is performed', () => {
    let response: any;
    response = responseContext().createCustomerResponse;
    let checkPerformed = response.creditCheckPerformed;
    test('Check is performed', checkPerformed, AssertionModes.strict).isnot(true, 'credit check is not performed');
    ;
  });

}
    

