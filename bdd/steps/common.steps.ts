/*import {
  featureContext,
  postgresQueryExecutor,
} from "@cloudeou/telus-bdd";
import { Identificators } from "./../contexts/Identificators";
import AddressContext from "../contexts/adt-migration/AddressContext";
import CustomerContext from "../contexts/adt-migration/CustomerContext";
import FIFA_ErrorContext from "../contexts/FIFA_ErrorContext";
import ResponseContext from "../contexts/adt-migration/ResponseContext";
import { APIs } from "./apis.enum";
import { ErrorStatus } from "../../bdd-src/adt-migration/utils/error-status";
import {
  completeCommonProcessQuery,
  completeMigrationQuery,
  getSalesOrderStatusQuery,
} from "../../bdd-src/adt-migration/db/db-queries";
import { envConfig } from "../../src/env-config";
import SCContext from "../contexts/adt-migration/SCContext";
// import oracleDriver from "../../bdd-src/adt-migration/db/oracle-driver";
import { DbProxyApi } from "../../bdd-src/adt-migration/db/db-proxy-api/db-proxy.api";
import { getHStaskObjectIdQuery } from "../../bdd-src/adt-migration/db/db-queries";
import { NcManualTaskApi } from "../../bdd-src/adt-migration/utils/telus-api-integrations/nc-manual-task/nc-manual-task.api";*/

type step = (
  stepMatcher: string | RegExp,
  callback: (...args: any) => void
) => void;

export enum adtFlags {
  failed = "failed",
  skipped = "skipped",
  migrated = "migrated",
}

export enum commonFlags {
  failed = 'failed',
  completed = 'completed'
}

/*export const commonSteps = ({ then, and, when }: { [key: string]: step }) => {
  const errorContext = (): FIFA_ErrorContext =>
    featureContext().getContextById(Identificators.FIFA_ErrorContext);
  const responseContext = (): ResponseContext =>
    featureContext().getContextById(Identificators.ResponseContext);
  const addressContext = (): AddressContext =>
    featureContext().getContextById(Identificators.AddressContext);
  const customerContext = (): CustomerContext =>
    featureContext().getContextById(Identificators.CustomerContext);
  const shoppingCartContext = (): SCContext =>
    featureContext().getContextById(Identificators.SCContext);

  const ncMtAPI = new NcManualTaskApi();
  const dbProxy = new DbProxyApi();

  and(/^distribution channel is (.*)$/, (channel) => {
    if (!channel) {
      errorContext().error = "Distribution channel is empty or not valid";
      errorContext().status = ErrorStatus.skipped;
    }
    shoppingCartContext().distributionChannel = channel;
  });

  and(/^SO id is (.*)$/, (soId: string) => {
    shoppingCartContext().salesOrderId = soId;
  });

  then(
    /^check (.*) response has no errors and code (.*)$/,
    (apiName: string, code: number) => {
      const fullResponse = responseContext().getResponse(<APIs>apiName);
      if (fullResponse?.status != code) {
        errorContext().error = `Unexpected http status code in response from ${apiName} api: ${fullResponse?.status}`;
        errorContext().status = ErrorStatus.skipped;
      }
    }
  );

  when("get SO from NCBE", async () => {
    const soId: string = shoppingCartContext().salesOrderId;
    try {
      // await oracleDriver.connect();
      // const res = await oracleDriver.executeQuery(
      //   getSalesOrderStatusQuery(soId)
      // );
      // await oracleDriver.closeConnection();
      let res: { [key: string]: any } = await dbProxy.executeQuery(
        getSalesOrderStatusQuery(soId)
      );
      res = res.data;
      shoppingCartContext().soStatus = res.rows[0][0];
    } catch (error: any) {
      console.log(`Error while getting Sales Order Status: ${error}`);
      errorContext().error = error;
      errorContext().status = ErrorStatus.failed;
    }
  });

  and(/^sales order should be (.*)$/, (status) => {
    const soStatus = shoppingCartContext().soStatus;
    console.log(`Sales order status is: ${soStatus}`);
    if (!soStatus.toLocaleLowerCase().includes(status)) {
      const error = `Sales order status should be ${status} but got ${soStatus}`;
      console.log(error);
      errorContext().error = error;
      errorContext().status = ErrorStatus.failed;
    }
  });

  and(
    /^set (.*) migration completed (.*)$/,
    async (tableName: string, columnName: string) => {
      console.log(`Finishing migration in ${tableName}`);
      let id: string;
      switch (tableName) {
        case envConfig.adtTables.adtCustomers:
          id = customerContext().id;
          break;
        case envConfig.adtTables.adtAddresses:
          id = addressContext().id;
          break;
        default:
          id = customerContext().id;
      }
      console.log(`Updating row ${id}`);
      let error = errorContext().error;
      if (error.toString().includes("'")) {
        error = error.toString().replace(/'/gm, '"');
      }
      const status = errorContext().status;
      console.log(`Writing status to DB: ${status}`);
      console.log(`Writing error to DB: ${error}`);
      if (error) {
        console.log(
          await postgresQueryExecutor(
            completeMigrationQuery(tableName, <adtFlags><unknown>status, id, error)
          )
        );
      } else if (columnName) {
        console.log(
          await postgresQueryExecutor(
            completeMigrationQuery(tableName, <adtFlags>columnName, id)
          )
        );
      } else {
        console.log(
          await postgresQueryExecutor(
            completeMigrationQuery(tableName, adtFlags.migrated, id)
          )
        );
      }
    }
  );

  and("complete home security manual task", async () => {
    const custObjId: string = customerContext().objectId;
    const query: string = getHStaskObjectIdQuery(custObjId);
    try {
      // await oracleDriver.connect();
      // const res = await oracleDriver.executeQuery(query);
      // await oracleDriver.closeConnection();
      let res: { [key: string]: any } = await dbProxy.executeQuery(query);
      res = res.data;
      console.log(`Manual task for ${custObjId}: ${query}`);
      const taskObjId = res.rows[0][0];
      console.log(`Completeing manual task ${taskObjId}`);
      await ncMtAPI.completeTask(taskObjId);
    } catch (error: any) {
      console.log(`Error while completing Home Security manual task`);
      console.dir(error);
      errorContext().error = `Error while manual task api call: ${error}`;
      errorContext().status = ErrorStatus.failed;
    }
  });

  and(/^set (.*) process finished$/, async (tableName: string) => {
    const id: string = customerContext().id;
    const error: string = errorContext().error;
    const flag = errorContext().status ? commonFlags.failed : commonFlags.completed;
    await postgresQueryExecutor(completeCommonProcessQuery(tableName, id, flag, error));
  });
};*/
