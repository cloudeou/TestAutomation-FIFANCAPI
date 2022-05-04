import { Identificators } from "../Identificators";
export default class ProductCatalogContext {
    private requestedItems: Array<String> = [];
   
    private responsedItems: Map<string, JSON> = new Map();

    public setRequestedItems(offerList: Array<String>) {
        offerList.forEach(offer => this.requestedItems.push(offer))
    }
    public getRequestedItems() {
        return this.requestedItems;
    }
    public setResponsedItem(id: string, item: JSON) {
        this.responsedItems.set(id, item);
    }
}