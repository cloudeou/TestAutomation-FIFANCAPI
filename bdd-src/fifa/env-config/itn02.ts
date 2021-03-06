export const envConfig = {
    envName: "it02",
    ikongUrl: "https://apigw-st.tsl.telus.com",
    token: {
        tokenPath: "/st/token",
    },
    createCustomer: {
        endpoint: "/service/adtMigration/v1/telus/gem/rest/api/fifacustomeraccountapi/v1/createCustomerAccount",

    },
    productCatalog: {
        baseUrl: "/marketsales/fifaproductcatalogmanagement/v1/productOffering?",
        clientId: "6ca1bd63-db15-4ade-a76f-196fb08fd5b4",
        clientSecret: 'd84e90f3-74e3-4879-b54c-52f7b18d75b0cc654ff5-7058-4205-9061-2a4978dc8d3a',
        scope: 363,
    },
    serviceQualification: {
        baseUrl: "/service/serviceQualification/v2/serviceQualification",
        scope: 26,
        clientId: "816a3968-064a-4901-80b9-adf56e73d632",
        clientSecret: "412cc102-ee52-4aa4-8c23-271b40838e90cac74781-751f-4e0e-87ed-befa7f4c35bb"
    },
    productQualification: {
        baseUrl: "/marketsales/fifaproductofferingqualification/v2/productOfferingQualification",
        scope: 28,
        clientId: "c19b9aa0-82b4-4aaf-92c0-e62e3ad5880c",
        clientSecret: '12711511-fa3f-4d4e-bebd-6c28ecc51871e213fac9-3c02-43ee-9a9d-f5e8da6ddeaa',
    },
    shoppingCart: {
        baseUrl: "/marketsales/fifaShoppingCart/v2/shoppingcart",
        clientId: "816a3968-064a-4901-80b9-adf56e73d632",
        clientSecret: '412cc102-ee52-4aa4-8c23-271b40838e90cac74781-751f-4e0e-87ed-befa7f4c35bb',
        scope: 241,
    },
   
    "holdOrderTaskCompletion": {
        "endpoint": "/service/adtMigration/v1/telus/gem/rest/api/fifaomsupportapi/v1/taskMarkComplete?taskId=#TASK_OBJECT_ID#",
        "contentType": "application/json",
        "keywordsToReplace": ["#TASK_OBJECT_ID#"]
    },
    "processManualTaskCompletion": {
        "endpoint": "/service/adtMigration/v1/manualTask/performTaskAction/#TASK_OBJECT_ID#/complete",
        "contentType": "application/json",
        "keywordsToReplace": ["#TASK_OBJECT_ID#"]
    },
    "releaseActivation": {
        "endpoint": "/service/adtMigration/v1/releaseActivation",
        "contentType": "application/json",
        "keywordsToReplace": ["#workOrderId#"]
    },
    "shipmentOrderCompletion": {
        "endpoint": "/service/adtMigration/v1/shipmentOrderCompletion",
        "contentType": "application/json",
        "keywordsToReplace": [
          "#orderNumber#",
          "#trackingNumber#",
          "#expectedDeliveryDate#",
          "#purchaseOrderNumber#",
          "#shipper#"
        ]
      },
    "workOrderCompletion": {
        "endpoint": "/service/adtMigration/v1/workOrderCompletion",
        "contentType": "application/json",
    },
    "searchAvailableAppointments": {
        "endpoint": "/service/adtMigration/v1/searchAvailableAppointments",
        "contentType": "application/json",
    },
    dbApi: {
        baseUrl: "/service/adtMigration/v1",
        clientId: "5fba5d2a-9c9a-4829-aa16-96e9c34fb14d",
        clientSecret: '10a7c574-2393-4974-a539-38fd1219c41fa9a2f716-a38c-4192-8b71-37d75f53f1b2',
        scope: 2189,
    },
    productInventory: {
        baseUrl: "https://apigw-st.tsl.telus.com",
        scope: 195,
        clientId: "c19b9aa0-82b4-4aaf-92c0-e62e3ad5880c",
        clientSecret: process.env.PI_CLIENTSECRET_ITN,
    },
    "setMigrationFlag": {
        "endpoint": "/service/adtMigration/v1/telus/gem/rest/api/fifacustomeraccountapi/v1/updateCustomerAccount?attrId=9144723841513165963&val=9144723913513165973&objectId=#CUSTOMER_ID#",
        "contentType": "",
        "keywordsToReplace": ["#CUSTOMER_ID#"]
      },
    "sendAsyncCall": {
        "endpoint": "/service/adtMigration/v1/NCSOAPIntegrationWebServiceOperation",
        "keywordsToReplace": [
          "#enterpriseCustomerID#",
          "#actionValue#",
          "#operationName#"
        ]
      },
    "stepForAddingSTB": {
        "endpoint": "/service/adtMigration/v1/OSSJ/OrderManagement/NcOssjOrderManagementWebService/addSTB",
        "keywordsToReplace": [
          "#iptvServiceKey#",
          "#GUID#",
          "#MACAddress#"
        ]
      },
}