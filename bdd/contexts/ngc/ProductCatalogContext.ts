import { Identificators } from "../Identificators";
export default class ProductCatalogContext {

    public identificator = Identificators.ProductCatalogContext;
    private _requestedItems: Array<String> = [];

    public set requestedItems(offerList: Array<String>) {
        console.log('inside set');
        console.log(offerList);
        offerList.forEach(offer => this._requestedItems.push(offer))
    }
    public get requestedItems() {
        return this._requestedItems;
    }
}