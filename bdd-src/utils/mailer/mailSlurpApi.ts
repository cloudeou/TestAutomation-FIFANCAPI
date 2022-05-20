import { ITestEmail, ILetter } from './types';
import {Common} from "../commonBDD/Common";
const request = require('superagent');
require('superagent-proxy')(request);

const proxy = 'http://webproxystatic-bc.tsl.telus.com:8080';

/*Documentation for catch mails https://dropmail.me/api/#live-demo*/
const ql = require('superagent-graphql');
const queryCreateMail = `
 mutation {introduceSession {id, addresses {address}}}
`

const queryGetEmail = `
        query ($id: ID!) {
    session(id:$id) {
                        mails{
                                 rawSize, fromAddr, toAddr, downloadUrl, text, headerSubject
                                 }
                     }
                                        }
    `


const mailslurpApiKey =
  'eb0351ed6062bb0ea38e9b001d07dd35a74cac5555abbc59badf6e0e12f7ce55';

const createTestEmail = async (): Promise<ITestEmail | null> => {
  try {
    const response = await request
        .post("https://dropmail.me/api/graphql/web-test-20220126bXutz")
        .proxy(proxy)
        .use(ql(queryCreateMail))
    const testAccount =  {
      inboxId: response.body.data.introduceSession.id,
      emailAddress: response.body.data.introduceSession.addresses[0].address
    };
    console.log("ID",testAccount.inboxId);
    return  testAccount ? testAccount : null;
    // const response = await request
    //   .post('https://api.mailslurp.com/inboxes/')
    //   .proxy(proxy)
    //   .set('Content-Type', 'application/json')
    //   .set('x-api-key', mailslurpApiKey)
    //   .send({ expiresIn: 24 * 60 * 60 * 1000 });
    // const testAccount = response.body;
    // return response.status === 201 && testAccount ? testAccount : null;

  } catch (error) {
    throw new Error(`error while creating test email, error:${error}`);
  }
};

const getUserLastLetter = async (email: string): Promise<ILetter | null> => {
  try {
    const response = await request
      .get(
        `https://api.mailslurp.com/emails/latestIn?inboxId=${
          email.split('@')[0]
        }`,
      )
      .proxy(proxy)
      .set('x-api-key', mailslurpApiKey);
    const lastLetter = response.body;
    return response.status === 200 && lastLetter ? lastLetter : null;
  } catch (error) {
    throw new Error(`Cannot get last user letter, error:${error}`);
  }
};

const getEmailById = async (emailId: number): Promise<ILetter> => {
  try {
    const response = await request
      .get(`https://api.mailslurp.com/emails/${emailId}`)
      .proxy(proxy)
      .set('x-api-key', mailslurpApiKey);

    delete response.body.headers;
    return response.body;
  } catch (error) {
    throw new Error(`Cannot get email with id: ${emailId}, error:${error}`);
  }
};

const getUserAllLetters = async (
  email: string,
  size: number = 5,
): Promise<ILetter[] | null> => {
  try {
    const response = await request
      .get(
        `https://api.mailslurp.com/emails?inboxId=${
          email.split('@')[0]
        }&page=0&size=${size}&sort=DESC`,
      )
      .proxy(proxy)
      .set('x-api-key', mailslurpApiKey);

    // path /emails?inboxId returns partial letter body, so here we use separate requests
    const allLeters = [];
    for (const emailObj of response.body.content) {
      allLeters.push(await getEmailById(emailObj.id));
    }
    return response.status === 200 && allLeters.length ? allLeters : null;
  } catch (error) {
    throw new Error(`Cannot get all user letters, error:${error}`);
  }
};

const getLastEmail = async (emailId: string): Promise<Array<any> | null> => {
  console.log("emailId", emailId);
  await Common.delay(20000);
  try {
    const response = await request
        .post("https://dropmail.me/api/graphql/web-test-20220126bXutz")
        .proxy(proxy)
        .use(ql(queryGetEmail,{  id: emailId }))
    const email = JSON.parse(response.text);
    console.log(email);
    console.log(email.data.session.mails);
    return email ? email.data.session.mails : null
  } catch (error) {
    throw new Error(`Cannot get last user letter, error:${error}`);
  }
};

const checkEmail =  (email: any, splittedBody: string[], subject: string): any => {
    return {
      includesKeyWords: splittedBody.every(w => email.text.includes(w.toString())),
      includesSubject : !!email.headerSubject.match(new RegExp(subject, 'ig'))
    }
};


export { createTestEmail, getUserLastLetter, getUserAllLetters, getLastEmail, checkEmail };
