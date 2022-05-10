import { Identificators } from "../Identificators";
export default class ProductQualificationContext {

    public identificator = Identificators.ProductQualificationContext;
    private _categoryList: Array<string> | null = null;
    private _productOfferingId: string | null = null;
    private _charList: Array<string> | null = null;
    private _commitmentId: any;


    public getCategoryList(): any {
        return this._categoryList;
    }

    public setCategoryList(categoryList: Array<string>) {
        this._categoryList = categoryList;
    }

    public setCommitmentId(commitmentId: any) {
        this._commitmentId = commitmentId;
    }

    public getCommitmentId():any {
        return this._commitmentId;
    }

    public getproductOfferingId(): any {
        return this._productOfferingId;
    }

    public setproductOfferingId(productOfferingId: string) {
        this._productOfferingId = productOfferingId;
    }

    public getCharList():any {
        return this._charList;
    }

    public setCharList(charList: Array<string>) {
        this._charList = charList;
    }

    public reset() {
        this._categoryList = null;
        this._productOfferingId = null;
        this._charList = null;
    }

}