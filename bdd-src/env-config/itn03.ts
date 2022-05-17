export const envConfig = {
    envName: "it03",
    productCatalog: {
        baseUrl: "https://apigw-st.tsl.telus.com/marketsales/fifaproductcatalogmanagement/v1/productOffering?",
        clientId: "c19b9aa0-82b4-4aaf-92c0-e62e3ad5880c",
        clientSecret: '12711511-fa3f-4d4e-bebd-6c28ecc51871e213fac9-3c02-43ee-9a9d-f5e8da6ddeaa',
        scope: 363,
    },
    createCustomer: {
        baseUrl: "https://flcncapp-itn03.tsl.telus.com",
    },
    token: {
        tokenHost: "https://apigw-st.tsl.telus.com",
        tokenPath: "/st/token",
    },
    serviceQualification: {
        baseUrl: "https://apigw-st.tsl.telus.com/service/serviceQualification/v2/serviceQualification",
        scope: 26,
        clientId: "816a3968-064a-4901-80b9-adf56e73d632",
        clientSecret: "412cc102-ee52-4aa4-8c23-271b40838e90cac74781-751f-4e0e-87ed-befa7f4c35bb"
    },
    productQualification: {
      baseUrl: "https://apigw-st.tsl.telus.com/marketsales/fifaproductofferingqualification/v2/productOfferingQualification",
        scope: 28,
        clientId: "c19b9aa0-82b4-4aaf-92c0-e62e3ad5880c",
        clientSecret:
            "12711511-fa3f-4d4e-bebd-6c28ecc51871e213fac9-3c02-43ee-9a9d-f5e8da6ddeaa",
    },
    shoppingCart: {
        baseUrl:
            "https://apigw-st.tsl.telus.com/marketsales/fifaShoppingCart/v2/shoppingcart",
        clientId: "816a3968-064a-4901-80b9-adf56e73d632",
        clientSecret: '412cc102-ee52-4aa4-8c23-271b40838e90cac74781-751f-4e0e-87ed-befa7f4c35bb',
        scope: 241,
    },
    promotion:{
        baseUrl:"https://apigw-st.tsl.telus.com",
        clientId: "816a3968-064a-4901-80b9-adf56e73d632",
        clientSecret: '412cc102-ee52-4aa4-8c23-271b40838e90cac74781-751f-4e0e-87ed-befa7f4c35bb',
        scope: 241,
    },
    "holdOrderTaskCompletion": {
        "base": "http://tap360-data-service-np.paas-app-west2-np.tsl.telus.com/",
        "endpoint": "migration/v1/telus/gem/rest/api/fifaomsupportapi/v1/taskMarkComplete{taskId}?taskId=#TASK_OBJECT_ID#",
        "contentType": "application/json",
        "keywordsToReplace": ["#TASK_OBJECT_ID#"]
    },
    "processManualTaskCompletion": {
        "base": "http://tap360-data-service-np.paas-app-west2-np.tsl.telus.com/",
        "endpoint": "migration/v1/manualTask/performTaskAction/#TASK_OBJECT_ID#/complete",
        "contentType": "application/json",
        "keywordsToReplace": ["#TASK_OBJECT_ID#"]
    },
    "releaseActivation": {
        "base": "http://tap360-data-service-np.paas-app-west2-np.tsl.telus.com/",
        "endpoint": "migration/v1/releaseActivation",
        "contentType": "application/json",
        "keywordsToReplace": ["#workOrderId#"]
    },
    "workOrderCompletion": {
        "base": "http://tap360-data-service-np.paas-app-west2-np.tsl.telus.com/",
        "endpoint": "migration/v1/workOrderCompletion",
        "contentType": "application/json",
    },
    dbApi: {
        baseUrl: "https://apigw-st.tsl.telus.com/service/adtMigration/v1",
        clientId: "5fba5d2a-9c9a-4829-aa16-96e9c34fb14d",
        clientSecret: '10a7c574-2393-4974-a539-38fd1219c41fa9a2f716-a38c-4192-8b71-37d75f53f1b2',
        scope: 2189,
    }
}