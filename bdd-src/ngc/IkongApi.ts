export type KongHeaders = {
    Authorization: string;
    env: string;
};

export interface IkongApi {
    generateKongHeaders(): Promise<KongHeaders>;
}
