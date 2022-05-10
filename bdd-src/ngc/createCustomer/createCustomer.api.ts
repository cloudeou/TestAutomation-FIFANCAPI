import { data } from "../../../test-data/test.data";
import {envConfig} from '../../env-config';
import { axiosInstance } from "../../axios-instance";
import { AssertionModes, test } from "@cloudeou/telus-bdd";
import { AxiosResponse } from "axios";


export class CreateCustomerApi {

    private REQUEST_TYPES = new (class {
        createCustomer() {
            return {
              uri:
                '/telus/gem/rest/api/fifacustomeraccountapi/v1/createCustomerAccount',
              method: 'POST',
            };
          }
    })
      
    private buildCreateCustomerOptions(
        type: any,
        queryParameters: any,
        distributionChannelID: any,
        customerCategoryID: any,
        body: any,
      ) {
        let options = {
          method: type.method,
          url: envConfig.createCustomer.baseUrl + type.uri, 
          qs: queryParameters,
          headers: {
            'Content-Type': 'application/json',
          },
          body: body == null ? {} : body,
        //   timeout: configurationLoader.timeout + 50000,
          json: true,
          strictSSL: false,
          gzip: true,
        };
        return options;
      }

    public async requestCreateCustomer(
        type: any,
        queryParameters: any,
        body: any,
        distributionChannelID: any,
        customerCategoryID: any,
      ): Promise<AxiosResponse> {
        try {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            let reqOption = this.buildCreateCustomerOptions(
                    type,
                    queryParameters,
                    distributionChannelID,
                    customerCategoryID,
                    body,
                  );
          
            const response = await axiosInstance({
                method: reqOption.method,
                url: reqOption.url,
                headers: reqOption.headers,
                data: reqOption.body
            })
          
            return response;
            
        } catch (error: any) {
            console.log(`Error while send requestCreateCustomer: ${error}`);
            console.log(`Error while send requestCreateCustomer: ${error.response.data}`);

            throw error;
        }
        
      }
    
      public async verifyCreateCustomerAccountTBAPI(
        queryBody: any,
        distributionChannel?: any,
        customerCategory?: string,
      ) {
        
        distributionChannel =
          distributionChannel === undefined || distributionChannel === null
            ? data.distributionChannel.SSP
            : distributionChannel;

        customerCategory =
          customerCategory === undefined || customerCategory === null
            ? data.customerCategory.CONSUMER
            : customerCategory;

        let isBCA = queryBody.isBusiness ? true : false;
          
          try {
            const responseCustomer = await 
            this.requestCreateCustomer(
              this.REQUEST_TYPES.createCustomer(),
              {},
              queryBody,
              distributionChannel,
              customerCategory,
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