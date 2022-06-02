import { envConfig } from "../../env-config";
import { OauthToken } from "../../oauth-token";
import { axiosInstance } from "../../axios-instance";
import { AxiosResponse } from "axios";
import {generateKongHeaders} from "../../IkongApi"


export enum dbActions {
  rawQuery = "rawQuery",
}

export class DbProxyApi  {
  private _oauthToken: OauthToken;

  constructor() {
    this._oauthToken = new OauthToken(
      envConfig.dbApi.clientId,
      envConfig.dbApi.clientSecret
    );
  }

  public generatePayload(
    action: dbActions,
    query: string
  ): { [key: string]: any } {
    let body: { [key: string]: any } = {};
    switch (action) {
      case dbActions.rawQuery: {
        body = { rawQuery: query };
      }
    }
    return body;
  }

  public async executeQuery(query: string): Promise<AxiosResponse> {
    const body = this.generatePayload(dbActions.rawQuery, query);
    const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
    console.log("token", token);
    try {
      const headers = await generateKongHeaders(token);
      const response = await axiosInstance({
        method: "POST",
        url: `${envConfig.ikongUrl}${envConfig.dbApi.baseUrl}/api/performeSQLRequest`,
        data: body,
        headers
      });
      return response;
    } catch (error: any) {
      console.log(`Error while db proxy request ${error}`);
      throw error;
    }
  }

}
