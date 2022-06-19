import FIFA_PreconditionContext from "../../../contexts/fifa/FIFA_PreconditionContext";
import {Identificators} from "../../../contexts/Identificators";
import {AssertionModes, featureContext, test} from "@cloudeou/telus-bdd";
import ResponseContext from "../../../contexts/fifa/FIFA_ResponseConntext";
import FIFA_ShoppingCartContext from "../../../contexts/fifa/FIFA_ShoppingCartContext";
import {
  queryNcCustomerOrdersStatusNeitherCompletedNorProcessed,
  getErrorsOccuredForCustomer,
  getBillingFailedActionStatus,
  queryCheckOrdersStatuses,
  queryCheckTheRDB_SALES_ORDERSTable,
  queryATTR_TYPE_ID,
  queryOption82,
  iptvServiceKey,
  getSalesOrderStatusQuery
} from "../../../../bdd-src/fifa/db/db-queries";
import {TelusApiUtils} from "../../../../bdd-src/fifa/telus-apis/telus-apis";
import {Common} from "../../../../bdd-src/fifa/utils/commonBDD/Common";
import retry from "retry-as-promised";
import {AxiosResponse} from "axios";
import {DbProxyApi} from "../../../../bdd-src/fifa/db/db-proxy-api/db-proxy.api";
import {OrdersHandler} from "../../../../bdd-src/fifa/backendSteps/OrdersHandler";
import {TasksHandler} from "../../../../bdd-src/fifa/backendSteps/TasksHandler";
import {replacerFunc} from "../../../../bdd-src/fifa/utils/common/replaceFunctionForJsonStrigifyCircularDepencdency";
import { data } from '../../../../bdd-src/fifa/test-data/data';
import {MailerApi} from "../../../../bdd-src/fifa/utils/mailer/MailerApi";

type step = (
    stepMatcher: string | RegExp,
    callback: (...args: any) => void
) => void;

export const FIFA_backendSteps = ({ given, and, when, then } : { [key: string]: step }) => {
  let preconditionContext = (): FIFA_PreconditionContext =>
    featureContext().getContextById(Identificators.FIFA_preConditionContext);
  let responseContext = (): ResponseContext =>
    featureContext().getContextById(Identificators.FIFA_ResponseContext);
  let shoppingCartContext = (): FIFA_ShoppingCartContext =>
    featureContext().getContextById(Identificators.FIFA_shoppingCartContext);
  const tapis = new TelusApiUtils();
  const dbProxy = new DbProxyApi();
  const tasksHandler = new TasksHandler();
  const ordersHandler = new OrdersHandler()


  when('try to complete sales order on BE', async () => {
    try {
      let customExternalId = preconditionContext().externalCustomerId;
      let addressId = preconditionContext().addressId;
      let salesOrderId = shoppingCartContext().salesOrderId;
      console.debug('Sales Order ID' + salesOrderId);
      test('customExternalId is defined',
        customExternalId,
        AssertionModes.strict).isnot(undefined, 'ecid undefined');
      test('Customer external Id is not null',
        customExternalId,
        AssertionModes.strict).isnot(null, "Customer external Id is null'");
      test('SO is defined',
        salesOrderId,
        AssertionModes.strict).isnot(undefined, 'SO is undefined');
      test('SO is not null',
        salesOrderId,
        AssertionModes.strict).isnot(null, 'SO is null');
      let response = responseContext().shoppingCartResponse;
      test('Response is not null',
        response,
        AssertionModes.strict).isnot(null, 'Response is null');
      const customerId = preconditionContext().customerObjectId!;
      console.debug('customer id' + customerId);
      let order: any;
      order = {customerId};
      order.customerId = customerId;
      console.debug(`Customer's internal id: ${order.customerId}`);
      console.debug('Storing Manual Task Id');
      let incompleteorders: any;

      try {
        const response = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId!));
        await Common.delay(10000)
        incompleteorders = response.data.rows;
        console.log('get correct incompleteorders', incompleteorders);
      } catch (error) {

        console.log(error);
        throw error
      }
      if (!!incompleteorders && incompleteorders.length > 0) {

        await tasksHandler.processManualTask(customerId)

        await ordersHandler.processPendingWorkOrders(customerId)

        await ordersHandler.processAllPendingOrders(customerId)

        await Common.delay(60000)

        await retry(
          async (options) => {

            const response: AxiosResponse = await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId))

            if (!response || response.data.rows.length === undefined) {
              throw 'Got pending orders as undefined' + response;
            }

            if (response.data.rows.length > 0) {
              console.log('error inside if ', JSON.stringify(
                response,
                replacerFunc()
              ))
            }
            shoppingCartContext().allPendingOrders = response.data.rows;
          },
          {
            max: 5, // maximum amount of tries
            timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
            backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
          },
        );
      }

      else {
        shoppingCartContext().allPendingOrders = [];
      }

    }
    catch (e) {
      console.log(e)
    }
  })

  when('try to cancel sales order on BE', async () => {
    let customExternalId = preconditionContext().externalCustomerId;
    let addressId = preconditionContext().addressId;
    let salesOrderId = shoppingCartContext().salesOrderId;
    console.info('Sales Order ID' + salesOrderId);
    test('customExternalId is defined',customExternalId, AssertionModes.strict).isnot(undefined,'customExternalId should not be undefined');
    test('Customer external Id is not null', customExternalId, AssertionModes.strict).isnot(null, 'Customer external Id is null')
    test('salesOrderId should be defined', salesOrderId, AssertionModes.strict).isnot(undefined,'salesOrderId should be defined')
    test('Sales order Id is not null', salesOrderId, AssertionModes.strict).isnot(null,'Sales order Id should not be null')

    let response = responseContext().shoppingCartResponse;
    test('Response is not null', response, AssertionModes.strict).isnot(null,'Response is null')
    const customerId = preconditionContext().customerObjectId!;
    console.info('customer id' + customerId);
    let order: any;
    order = { customerId };
    order.customerId = customerId;
    console.info(`Customer's internal id: ${order.customerId}`);
    console.info('Storing Manual Task Id');

    const incompleteordersResponse: AxiosResponse= await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));

    const incompleteorders = incompleteordersResponse.data.rows;

    if (!!incompleteorders && incompleteorders.length > 0) {

      await tasksHandler.processManualTask(customerId)

      await ordersHandler.processPendingWorkOrders(customerId)

      await ordersHandler.processAllPendingOrders(customerId)

      await Common.delay(60000)

      await retry(
        async function (options) {

          const response: AxiosResponse= await dbProxy.executeQuery(queryNcCustomerOrdersStatusNeitherCompletedNorProcessed(customerId));

          if (!response.data.rows || response.data.rows.length === undefined) {
            throw 'Got pending orders as undefined' + response;
          }

          shoppingCartContext().allPendingOrders = response.data.rows;
        },
        {
          max: 5, // maximum amount of tries
          timeout: 20000, // throw if no response or error within millisecond timeout, default: undefined,
          backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
        },
      );
    }
    else {
      shoppingCartContext().allPendingOrders = [];
      console.info('all orders are processed');
    }
  });

  then('validate that no errors created on BE', async () => {
    try {
      const customerId = preconditionContext().customerObjectId!;
      const response = await dbProxy.executeQuery(getErrorsOccuredForCustomer(customerId))

      const customerErrors = response.data.rows
      console.debug('Errors' + JSON.stringify(customerErrors));
      test('customerErrors is not null', customerErrors,AssertionModes.strict).isnot(null,'customerErrors has not to be null')
      test('customerErrors is not undefined', customerErrors,AssertionModes.strict).isnot(undefined,'customerErrors has not to be undefined')
      test('customerErrors.length less than 1', customerErrors.length < 1,AssertionModes.strict).is(true,'customerErrors.length less than 1')
    }
    catch (e) {
      console.log(e)
    }
  });

  and('validate that all orders are completed successfully', () => {
    try {
      let allPendingOrders = shoppingCartContext().allPendingOrders;
      test('allPendingOrders length toBe (0)', allPendingOrders.length, AssertionModes.strict).is(0,'allPendingOrders length should Be (0)')
    }
    catch (e) {
      console.log(e)
    }
  });

  and('validate that all orders are canceled successfully', () => {
    let allPendingOrders = shoppingCartContext().allPendingOrders;
    test('allPendingOrders length toBe (0)', allPendingOrders.length, AssertionModes.strict).is(0,'allPendingOrders length should Be (0)')
  });

  and('check that the letters was received:', async (letterInfoTable) => {
    await Common.delay(15000);
    const emailId = preconditionContext().emailId;
    await MailerApi.checkEmail(emailId,letterInfoTable)
  });

  and('validate that all billing actions completed successfully', async () => {
    const customerId = preconditionContext().customerObjectId!;
    const response = await dbProxy.executeQuery(getBillingFailedActionStatus(customerId))
    const billingActionStatus = response.data.rows

    const listOfActionsWIthSubscriberProblem = ['Create Product (OneTimeCharge)','Modify Subscriber']

    const isKindOfSubscriberProblem = listOfActionsWIthSubscriberProblem.includes(billingActionStatus?.[0]?.[1])

    test(`Billing action status for ${customerId} is not NULL`, billingActionStatus, AssertionModes.strict).isnot(null,`Billing action status for ${customerId} should not be NULL`)
    test(`Billing action status for ${customerId} is defined`, billingActionStatus, AssertionModes.strict).isnot(undefined,`Billing action status for ${customerId} is not defined`)
    test(`Status for customer: ${customerId} should be less then 1}`,billingActionStatus.length < 1 || isKindOfSubscriberProblem, AssertionModes.strict).is(true,`Status for customer: ${customerId} is ${billingActionStatus}`)
  });

  and('check present order statuses', async (table) => {
    let status = 'present'

    let customerObjectId = preconditionContext().customerObjectId!;
    let statusMap = Common.getStatusesMapFromTable(table);

    await Common.delay(15000);
    for (const [key, value] of statusMap) {
      const response = await dbProxy.executeQuery(queryCheckOrdersStatuses(key, customerObjectId))
      let orderStatus = response.data.rows
       
       status === 'present'
       ?
        test(`Status for ${key} = ${orderStatus[0][1]} but not ${value} is equal to ${data.statuses[value]}`, orderStatus[0][0], AssertionModes.strict)
          .is(data.statuses[value],`Status for ${key} = ${orderStatus[0][1]} but not ${value}`)
        :
        test('orderStatus equal []', orderStatus.length === 0, AssertionModes.strict).is(true,`Order ${key} present in shoping cart`)
    }
  });

  and('check absent order statuses', async (table) => {
    let status = 'absent'
    let customerObjectId = preconditionContext().customerObjectId!;
    let statusMap = Common.getStatusesMapFromTable(table);

    await Common.delay(15000);
    for (const [key, value] of statusMap) {
      const response = await dbProxy.executeQuery(queryCheckOrdersStatuses(key, customerObjectId))
      let orderStatus = response.data.rows
       console.log(orderStatus)
       console.log(key)
      status === 'present'
        ?
        test(`Status for ${key} = ${orderStatus[0][1]} but not ${value} is equal to ${data.statuses[value]}`, orderStatus[0][0], AssertionModes.strict)
          .is(data.statuses[value],`Status for ${key} = ${orderStatus[0][1]} but not ${value}`)
        :
        test('orderStatus equal []', orderStatus.length === 0, AssertionModes.strict).is(true,`Order ${key} present in shoping cart`)
    }
  });

  and('check the RDB_SALES_ORDERS table', async () => {
    const response = await dbProxy.executeQuery(queryCheckTheRDB_SALES_ORDERSTable())
    const ifTableExist = response.data.rows[0][0]
    test('єRDB_SALES_ORDERS ifTableExist not toBeNull', ifTableExist, AssertionModes.strict).isnot(null, 'єRDB_SALES_ORDERS ifTableExist should not toBeNull');
    test('єRDB_SALES_ORDERS ifTableExist not toBeUndefined', ifTableExist, AssertionModes.strict).isnot(undefined, 'єRDB_SALES_ORDERS ifTableExist should not toBeUndefined');
  });

  and('check that ATTR_TYPE_ID is text', async () => {
    const response = await dbProxy.executeQuery(queryATTR_TYPE_ID())
    const isTest = response.data.rows[0][0];
    test('check that ATTR_TYPE_ID is text',isTest, AssertionModes.strict ).is(0,'check that ATTR_TYPE_ID is text');
  });

  and(/check appointment for (.*) month/, async (monthToCheck) => {
    let addressId = preconditionContext().addressId;
    await tapis.processSearchAvailableAppointment(addressId,monthToCheck)
  });

  and(/send async call to (link|unlink) a Smart Speaker/, async (value) => {
    const enterpriseCustomerID =preconditionContext().externalCustomerId;
    value === 'link' 
    ? console.log( await tapis.sendingCallToLink(enterpriseCustomerID, 'new')) 
    : console.log( await tapis.sendingCallToLink(enterpriseCustomerID, 'delete')) 

  });

  and('add STB with SOAP', async () => {
    const customerId =preconditionContext().externalCustomerId;

    const response = await dbProxy.executeQuery(iptvServiceKey(customerId))

    console.log( await tapis.stepForAddingSTB(response.data.rows[0][0]))
  });

  and('get option 82', async () => {
    const customerId = preconditionContext().externalCustomerId;

    if(customerId !== null) {
      const response = await dbProxy.executeQuery(queryOption82((customerId.toString())))

      let option82 = response.data.rows

      console.log('option82: ' + option82)
    }

    else{
      throw new Error('customer id is null while get option 82')
    }

  });

  and('filter customers by values', async (table) => {
    let valuesMap = Common.createValuesMapFromTable(table);
    console.log(valuesMap);

    let Option82 = valuesMap['Option82'] ? valuesMap['Option82'] : ''
    console.log('Option82: ' + Option82)

    let connectivityStatus = valuesMap['connectivityStatus'] ? valuesMap['connectivityStatus'] : ''
    console.log('connectivityStatus: ' + connectivityStatus)

    let activeServiceIndicator = valuesMap['activeServiceIndicator'] ? valuesMap['activeServiceIndicator'] : ''
    console.log('activeServiceIndicator: ' + activeServiceIndicator)

    let hsiaServiceIndicator = valuesMap['hsiaServiceIndicator'] ? valuesMap['hsiaServiceIndicator'] : ''
    console.log('hsiaServiceIndicator: ' + hsiaServiceIndicator)

    let tvServiceIndicator = valuesMap['tvServiceIndicator'] ? valuesMap['tvServiceIndicator'] : ''
    console.log('tvServiceIndicator: ' + tvServiceIndicator)

    let voiceServiceIndicator = valuesMap['voiceServiceIndicator'] ? valuesMap['voiceServiceIndicator'] : ''
    console.log('voiceServiceIndicator: ' + voiceServiceIndicator)


    // let newArr = [...valuesMap.entries()]
    // console.log('newArr: ' + newArr)
    // console.log('newArr: ' + newArr.length)

    // let Option82 = newArr.find(([key, value]) => key === 'Option82')
    // ? newArr.find(([key, value]) => key === 'Option82')[1] : ''
    // console.log('Option82: ' + Option82)

    // let connectivityStatus = newArr.find(([key, value]) => key === 'connectivityStatus')
    // ? newArr.find(([key, value]) => key === 'connectivityStatus')[1] : ''
    // console.log('connectivityStatus: ' + connectivityStatus)

    // let activeServiceIndicator = newArr.find(([key, value]) => key === 'activeServiceIndicator')
    // ? newArr.find(([key, value]) => key === 'activeServiceIndicator')[1] : ''
    // console.log('activeServiceIndicator: ' + activeServiceIndicator)

    // let hsiaServiceIndicator = newArr.find(([key, value]) => key === 'hsiaServiceIndicator')
    // ? newArr.find(([key, value]) => key === 'hsiaServiceIndicator')[1] : ''
    // console.log('hsiaServiceIndicator: ' + hsiaServiceIndicator)

    // let tvServiceIndicator = newArr.find(([key, value]) => key === 'tvServiceIndicator')
    // ? newArr.find(([key, value]) => key === 'tvServiceIndicator')[1] : ''
    // console.log('tvServiceIndicator: ' + tvServiceIndicator)

    // let voiceServiceIndicator = newArr.find(([key, value]) => key === 'voiceServiceIndicator')
    // ? newArr.find(([key, value]) => key === 'voiceServiceIndicator')[1] : ''
    // console.log('voiceServiceIndicator: ' + voiceServiceIndicator)


    // console.log( await tapis.filterCustomersByValues(apicfg, Option82, connectivityStatus, activeServiceIndicator, hsiaServiceIndicator, tvServiceIndicator, voiceServiceIndicator))

  });

  when(/check sales order statuse is: '(.*)'/, async (statuse: string) => {
    let arraySO = shoppingCartContext().allSalesOrderId
    console.log('arraySO ', JSON.stringify(arraySO))
    let responseSalesOrderId = await dbProxy.executeQuery(getSalesOrderStatusQuery(arraySO[0]))
    let responseSalesOrderIdFirst = responseSalesOrderId.data.rows[0][0]
    console.log('responseSalesOrderIdFirst ', JSON.stringify(responseSalesOrderIdFirst))

    statuse === 'Superseded'
      ? responseSalesOrderIdFirst = String(responseSalesOrderIdFirst).replace('6#DDDDDD$', '')
      : responseSalesOrderIdFirst = String(responseSalesOrderIdFirst).replace('6#009B00$', '')                                  
      console.log(`responseSalesOrderIdFirst: ${responseSalesOrderIdFirst}`);

    test('SalesOrder status should be defined', responseSalesOrderIdFirst.includes(statuse), AssertionModes.strict)
      .is(true, `Sales Order status is not ${statuse} - ${responseSalesOrderIdFirst}`)

  });

}
