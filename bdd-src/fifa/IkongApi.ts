import {envConfig} from "./env-config";

export type KongHeaders = {
    Authorization: string;
    accept: string;
    env: string;
};


export const generateKongHeaders = async (token: any): Promise<KongHeaders> => {
    return {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        env: envConfig.envName
    };
}
