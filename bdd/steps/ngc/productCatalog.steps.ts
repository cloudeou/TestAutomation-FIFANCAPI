import {ProductCatalogApi} from "../../../bdd-src/ngc/productCatalog/pc.api";

type step = (
    stepMatcher: string | RegExp,
    callback: (args: any) => void
) => void;

export const productInventorySteps = ({ when }: { [key: string]: step }) => {
    const fifaNcApi = new ProductCatalogApi();
    when('user try to retrieve offer details', async ()=>{
        let offerList: any = [ '9156377023113145660', '9151782494813699850', '9155352401613907466' ]
        try{
            const pcResponse = await fifaNcApi.requestProductCatalog(offerList);
            console.log(JSON.stringify(pcResponse));
        }
        catch(error: any) {
            console.log(`ERROR: ${error}`);
        }

    })
}