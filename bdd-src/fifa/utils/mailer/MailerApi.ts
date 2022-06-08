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
     const checkEmailContent = async (email: any, splittedBody: string[], subject: string) => {
       if(email.headerSubject === null || email.text === null) {
         console.log('headerSubject or text is null')
         const response = await request
           .get(email.downloadUrl)
           .proxy(this.proxy)
         const emailBody = response.body.toString();
         return {
           notFoundKeyWordsInBody: splittedBody.filter(w => !emailBody.includes(w.toString())),
           includesKeyWords: splittedBody.every(w => emailBody.includes(w.toString())),
           includesSubject : emailBody.includes(subject)
         }
       }
       console.log('email.headerSubject -', email.headerSubject,'has to be like', subject, 'reslut ', email.headerSubject?.match(new RegExp(subject, 'ig')))
       console.log('email.text.includes -', email.text, '_spitted body -', splittedBody)
       return {
         notFoundKeyWordsInBody: splittedBody.filter(w => !email.text?.includes(w.toString())),
         includesKeyWords: splittedBody.every(w => email.text?.includes(w.toString())),
         includesSubject : !!email.headerSubject?.match(new RegExp(subject, 'ig'))
       }
     };

     const userEmail = await this.getLastEmail(emailId);

     if(!userEmail){
       throw new Error('userEmail was not received')
     }

     console.log('full emaill is -', global.JSON.stringify(userEmail))
     let allLettersIncludeKeyWords = true;
     const keyWordsThatWereNotFound: string[] = [];
     let allLettersIncludeSubject = true;
     const subjectsThatWereNotFound: string[] = []
     for(const{subject, body} of letterInfoTable ) {
       const splittedBody = body.split('=>');
       let checkResult: any = await checkEmailContent(userEmail[0], splittedBody, subject);
       if(!checkResult.includesKeyWords || !checkResult.includesSubject) {
         checkResult = await checkEmailContent(userEmail[1], splittedBody, subject);
       }
       if(checkResult.notFoundKeyWordsInBody.length > 0) {
         allLettersIncludeKeyWords = false;
         checkResult.notFoundKeyWordsInBody.forEach((str: string)=>{
           if(!keyWordsThatWereNotFound.includes(str)) {
             keyWordsThatWereNotFound.push(str)
           }
         })
       }
       if (!checkResult.includesSubject){
         allLettersIncludeSubject = false;
         if(!subjectsThatWereNotFound.includes(subject)) {
           subjectsThatWereNotFound.push(subject)
         }

       }
     }

     test('all letters were received in a customer\'s email', allLettersIncludeKeyWords && allLettersIncludeSubject, AssertionModes.strict)
       .is(true, `In ${userEmail.length} letters were not found ${keyWordsThatWereNotFound.length} phrases: \n ${keyWordsThatWereNotFound.map((s,i)=>`${i+1}. "${s}"`).join('\n')};
               \r\n subject was not found: \n ${subjectsThatWereNotFound.map((s,i)=>`${i+1}. "${s}"`).join('\n')};`)

   };
}