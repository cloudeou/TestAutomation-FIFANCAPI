import { Identificators } from "../Identificators";
export default class FIFA_ProductCatalogContext {

    public identificator = Identificators.FIFA_ProductCatalogContext;
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