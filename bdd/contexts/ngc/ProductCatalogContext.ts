import { Identificators } from "../Identificators";
export default class ProductCatalogContext {
    public identificator = Identificators.ProductCatalogContext;
    private requestedItems: Array<String> = [];
   
    private responsedItems: Map<string, JSON> = new Map();

    public setRequestedItems(offerList: Array<String>) {
        console.log('inside set');
        console.log(offerList);
        offerList.forEach(offer => this.requestedItems.push(offer))
    }
    public getRequestedItems() {
        return this.requestedItems;
    }
    public setResponsedItem(id: string, item: JSON) {
        this.responsedItems.set(id, item);
    }
}