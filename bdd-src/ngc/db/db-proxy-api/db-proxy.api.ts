import { envConfig } from "../../env-config";
import { IkongApi, KongHeaders } from "../../utils/IkongApi";
import { OauthToken } from "../../utils/telus-api-integrations/oauth-token";
import { axiosInstance } from "../../axios-instance";
import { AxiosResponse } from "axios";

export enum dbActions {
  rawQuery = "rawQuery",
}

export class DbProxyApi implements IkongApi {
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
    try {
      const headers = await this.generateKongHeaders();
      const response = await axiosInstance({
        method: "POST",
        url: `${envConfig.dbApi.baseUrl}/api/performeSQLRequest`,
        data: body,
        headers
      });
      return response;
    } catch (error: any) {
      console.log(`Error while db proxy request ${error}`);
      throw error;
    }
  }

  public async generateKongHeaders(): Promise<KongHeaders> {
    const token = await this._oauthToken.getToken(envConfig.dbApi.scope);
    console.log("token", token);
    return {
      Authorization: `Bearer ${token}`,
      env: envConfig.envName,
    };
  }
}
