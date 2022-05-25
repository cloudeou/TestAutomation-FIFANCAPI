import { data } from "../../../test-data/data";
import {envConfig} from '../../env-config';
import { axiosInstance } from "../../axios-instance";
import { AssertionModes, test } from "@cloudeou/telus-bdd";
import { AxiosResponse } from "axios";
import { OauthToken } from "../oauth-token";
import {generateKongHeaders} from "../IkongApi"


export class CreateCustomerApi {
    private _oauthToken: any;

    constructor() {
        this._oauthToken = new OauthToken(
            envConfig.dbApi.clientId,
            envConfig.dbApi.clientSecret
        );
    }

    public async requestCreateCustomer(
        body: any,
      ): Promise<AxiosResponse> {
        try {
            const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
            console.log("token", token);
            const headers = await generateKongHeaders(token);
            console.log("headers", headers);

            const response = await axiosInstance({
                method: 'POST',
                url: envConfig.ikongUrl + envConfig.createCustomer.endpoint,
                headers,
                data: body == null ? {} : body
            })
          
            return response;
            
        } catch (error: any) {
            console.log(`Error while send requestCreateCustomer: ${error}`);
            console.log(`Error while send requestCreateCustomer: ${JSON.stringify(error.response.data)}`);

            throw error;
        }
        
      }
    
      public async verifyCreateCustomerAccountTBAPI(
        queryBody: any,
      ) {
        let isBCA = queryBody.isBusiness ? true : false;
          
          try {
            const responseCustomer = await 
            this.requestCreateCustomer(
              queryBody,
            )
            const response = responseCustomer.data;
           
            test(
                'Create customer response should be received',
                response,
                AssertionModes.strict,
              ).isnot(null, 'Response should be received');
            test(
                'Response should contain body',
                response,
                AssertionModes.strict,
              ).isnot(null, 'Response should contain body');

              let customerAccount = response;
              let successText = JSON.stringify(response, null, '\t');
              let customerAccountText = JSON.stringify(customerAccount, null, '\t');

              test(
                'Customer account should created successfully',
                customerAccount,
                AssertionModes.strict,
              ).isnot(null,  'Customer account should have been created successfully\n' +
              successText,);

              if (!isBCA) {
                // console.log('TESTIK' + JSON.stringify(customerAccount));
                test(
                'Customer external ID should be defined and not empty',
                  customerAccount.ecid,
                  AssertionModes.strict,
                ).isnot(null, 'Customer external ID should be defined and not empty\n' +
                customerAccountText);
                test(
                'Customer external ID should have more than one character\n',
                  customerAccount.ecid.length,
                  AssertionModes.strict,
                ).isnot(0, 'Customer external ID should have more than one character\n' +
                customerAccountText);
              }
              test(
                'Customer account ID should be defined and not empty',
                customerAccount.customerAccountObjectId,
                AssertionModes.strict,
              ).isnot(null, 'Customer account ID should be defined and not empty\n' +
              customerAccountText);
              test(
                'Customer account ID should have more than one character',
                customerAccount.customerAccountObjectId.length,
                AssertionModes.strict,
              ).isnot(0, 'Customer account ID should have more than one character\n' +
              customerAccountText);

              console.log(
                `Customer Id: ${customerAccount.customerAccountObjectId}\nECID: ${customerAccount.ecid}`,
              );

              return {
                ecid: customerAccount.ecid,
                customerId: customerAccount.customerAccountObjectId,
                ban: customerAccount.billingAccountNum,
                creditCheckPerformed: customerAccount.creditCheckPerformed,
              };
        }
        catch(error: any) {
              if (error.matcherResult != null) {
                throw new Error('Error in creating Customer Account' + error);
              }
        }
      }
}