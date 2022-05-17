export const envConfig = {
    envName: "it02",
    productCatalog: {
        baseUrl: "https://apigw-st.tsl.telus.com/marketsales/fifaproductcatalogmanagement/v1/productOffering?",
        clientId: "c19b9aa0-82b4-4aaf-92c0-e62e3ad5880c",
        clientSecret: '12711511-fa3f-4d4e-bebd-6c28ecc51871e213fac9-3c02-43ee-9a9d-f5e8da6ddeaa',
        scope: 363,
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
        clientSecret: '12711511-fa3f-4d4e-bebd-6c28ecc51871e213fac9-3c02-43ee-9a9d-f5e8da6ddeaa',
    },
    shoppingCart: {
        baseUrl:
          "https://apigw-st.tsl.telus.com/marketsales/fifaShoppingCart/v2/shoppingcart",
        clientId: "816a3968-064a-4901-80b9-adf56e73d632",
        clientSecret: '412cc102-ee52-4aa4-8c23-271b40838e90cac74781-751f-4e0e-87ed-befa7f4c35bb',
        scope: 241,
    },
    createCustomer: {
        baseUrl: "https://flcncapp-itn02.tsl.telus.com",
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
    "shipmentOrderCompletion": {
        "base": "http://tap360-data-service-np.paas-app-west2-np.tsl.telus.com/",
        "endpoint": "migration/v1/shipmentOrderCompletion",
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
        "base": "http://tap360-data-service-np.paas-app-west2-np.tsl.telus.com/",
        "endpoint": "migration/v1/workOrderCompletion",
        "contentType": "application/json",
    },
}