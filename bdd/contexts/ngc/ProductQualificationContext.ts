import { Identificators } from "../Identificators";
export default class ProductQualificationContext {

    public identificator = Identificators.ProductQualificationContext;
    private _categoryList: Array<string> | null = null;
    private _productOfferingId: string | null = null;
    private _charList: Array<string> | null = null;
    private _commitmentId: any;


    public get categoryList(): any {
        return this._categoryList;
    }

    public set categoryList(categoryList: any) {
        this._categoryList = categoryList;
    }

    public set commitmentId(commitmentId: any) {
        this._commitmentId = commitmentId;
    }

    public get commitmentId():any {
        return this._commitmentId;
    }

    public get productOfferingId(): any {
        return this._productOfferingId;
    }

    public set productOfferingId(productOfferingId: any) {
        this._productOfferingId = productOfferingId;
    }

    public get charList(): Array<string> | null {
        return this._charList;
    }

    public set charList(charList: Array<string> | null) {
        this._charList = charList;
    }

    public reset() {
        this._categoryList = null;
        this._productOfferingId = null;
        this._charList = null;
    }

}