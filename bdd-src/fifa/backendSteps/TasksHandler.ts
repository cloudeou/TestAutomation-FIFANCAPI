import {Common} from "../utils/commonBDD/Common";
import {getManualCreditTaskId} from "../db/db-queries";
import {DbProxyApi} from "../db/db-proxy-api/db-proxy.api";
import {TelusApiUtils} from "../telus-apis/telus-apis";
const dbProxy = new DbProxyApi();
const tapis = new TelusApiUtils()

export class TasksHandler {

  constructor() {}

  async processManualTask (customerId: string) {
    const manualCreditTaskId = await this.requestManualCreditTaskId(customerId);

    if (manualCreditTaskId !== null && manualCreditTaskId !== undefined) {
      await Common.delay(10000)
      await tapis.processManualTask(manualCreditTaskId);
      await Common.delay(15000);
    }
  }

  private async requestManualCreditTaskId (customerId: string) {
    try {
      await Common.delay(15000)
      const response = await dbProxy.executeQuery(getManualCreditTaskId(customerId));
      return response.data.rows[0];
    }
    catch (error) {
      console.log(error);
      throw error
    }
  }

}