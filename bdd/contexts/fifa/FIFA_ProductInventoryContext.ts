import { Identificators } from "../Identificators";


export default class FIFA_ProductInventoryContext {
    public identificator = Identificators.FIFA_productInventoryContext;
    private fields: string = '';
    private limit: number = 0;

    public getFields() {
        return this.fields;
      }
    
    public setFields(fields: string) {
        this.fields = fields;
      }

    public getLimit() {
        return this.limit;
      }
    
    public setLimit(limit: number) {
        this.limit = limit;
      }
}