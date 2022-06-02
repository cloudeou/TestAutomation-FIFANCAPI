import {ILetter, ITestEmail} from "./types";
import {Common} from "../commonBDD/Common";
import {AssertionModes, test} from "@cloudeou/telus-bdd";
const request = require('superagent');
require('superagent-proxy')(request);
const ql = require('superagent-graphql');

export class MailerApi {
  static proxy = 'http://webproxystatic-bc.tsl.telus.com:8080';
  static queryCreateMail = `
    mutation {introduceSession {id, addresses {address}}}
  `;
  static queryGetEmail = `
        query ($id: ID!) {
          session(id:$id) {
            mails{
              rawSize, fromAddr, toAddr, downloadUrl, text, headerSubject
            }
          }
        }
    `;

  static async createTestEmail (): Promise<ITestEmail | null> {
    console.log('got here for creating address')
    try {
      const response = await request
        .post("https://dropmail.me/api/graphql/web-test-20220126bXutz")
        .proxy(this.proxy)
        .use(ql(this.queryCreateMail))
      const testAccount =  {
        inboxId: response.body.data.introduceSession.id,
        emailAddress: response.body.data.introduceSession.addresses[0].address
      };
      console.log("ID",testAccount.inboxId);
      return  testAccount ? testAccount : null;
    } catch (error) {
      console.log(error)
      throw new Error(`error while creating test email, error:${error}`);
    }
  }

  static async getLastEmail (emailId: string): Promise<Array<any> | null> {
    console.log("emailId", emailId);
    await Common.delay(20000);
    try {
      const response = await request
        .post("https://dropmail.me/api/graphql/web-test-20220126bXutz")
        .proxy(this.proxy)
        .use(ql(this.queryGetEmail,{  id: emailId }))
      const email = JSON.parse(response.text);
      console.log(email);
      console.log(email.data.session.mails);
      return email ? email.data.session.mails : null
    } catch (error) {
      throw new Error(`Cannot get last user letter, error:${error}`);
    }
  };

   static async checkEmail (emailId: string,letterInfoTable: any)  {
     const checkEmailContent =  (email: any, splittedBody: string[], subject: string): any => {
       return {
         includesKeyWords: splittedBody.every(w => email.text.includes(w.toString())),
         includesSubject : !!email.headerSubject.match(new RegExp(subject, 'ig'))
       }
     };

     const userEmail = await this.getLastEmail(emailId);
     for (let letter in userEmail)
       letterInfoTable.forEach(({ subject, body }: any) => {
         const splittedBody = body.split('=>');
         let checkResult =  checkEmailContent(userEmail[0],splittedBody,subject);
         if (!checkResult.includesSubject || !checkResult.includesSubject)
           checkResult =  checkEmailContent(userEmail[1],splittedBody,subject);
         test(`Email contains ${splittedBody}`,checkResult.includesKeyWords, AssertionModes.strict).is(true,`Email doest not contains ${splittedBody}`)
         test(`Email contains letter with subject ${subject}`,checkResult.includesSubject, AssertionModes.strict).is(true,`Email doest not contains letter with subject ${subject}, but ${userEmail[0].headerSubject}`)

       });

   };
}