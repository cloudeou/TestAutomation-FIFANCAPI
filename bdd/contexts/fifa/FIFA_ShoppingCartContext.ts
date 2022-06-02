import {Identificators} from "../Identificators";
import ncConstants from "../../../bdd-src/fifa/utils/nc-constants";
import {ShoppingCartApi} from "../../../bdd-src/fifa/shopping-cart/shopping-cart.api";

export default class FIFA_ShoppingCartContext {
    public identificator = Identificators.FIFA_shoppingCartContext;
    private _shoppingCartId: string | null = null;
    private _childOfferMap = new Map();
    private _promotionMap = new Map();
    private _charMap: Map<string, Array<[]>> | null = new Map();
    private _topOffer: string = '';
    private _allPendingOrders: Array<string> = [];
    private _offerList: Array<[]> = [];
    private _offersToAdd: Map<string, string> = new Map();
    private _salesOrderId: string = '';
    private _addingOffer: boolean = false;
    private _addingChildOffer = false;
    private _addingCharMap = false;
    private _addingPromotion = false;
    private _originalSalesOrderRecurrentPrice: number = NaN;
    private _originalSalesOrderOneTimePrice: number = NaN;
    private _SORecurrentPriceAlterationList: Array<string> = [];
    private _SOOneTimePriceAlterationList: Array<string> = [];
    private _existingChildOffers: Map<string, Map<string, any>> | null = new Map();
    private _distributionChannel: string = ncConstants.distributionChannel.CSR;
    private _distributionChannelExternalId: string = "";
    private _customerCategory: string = ncConstants.customerCategory.RESIDENTIAL;
    private _shoppingCartApiInstance: ShoppingCartApi = <ShoppingCartApi>(<unknown>null);


    public set existingChildOffers(childOffers: Map<string, Map<string, any>> | null) {
        this._existingChildOffers = childOffers;
    }


    public get existingChildOffers() {
        return this._existingChildOffers;
    }


    public set salesOrderId(salesOrderId: string) {
        this._salesOrderId = salesOrderId;
    }

    public get salesOrderId() {
        return this._salesOrderId;
    }

    public set addingPromotion(flag: boolean) {
        this._addingPromotion = flag;
    }

    public get addingPromotion() {
        return this._addingPromotion;
    }

    public set addingOffer(flag: boolean) {
        this._addingOffer = flag;
    }

    public get addingOffer() {
        return this._addingOffer
    }

    public set addingChild(flag: boolean) {
        this._addingChildOffer = flag;
    }

    public get addingChild() {
        return this._addingChildOffer;
    }

    public set addingCharMap(flag: boolean) {
        this._addingCharMap = flag;
    }

    public get addingCharMap() {
        return this._addingCharMap;
    }

    public set offersToAdd(obj: any | null) {
        if (obj !== null)
            obj?.offerList.forEach((offer: string) => {
                this._offersToAdd.set(String(offer), obj?.action);
            });
        else this._offersToAdd.clear();
    }

    public get offersToAdd() {
        return this._offersToAdd;
    }

    public set availableOffers(offers) {
        this._offerList = offers
    }

    public get availableOffers() {
        return this._offerList;
    }

    public get shoppingCartId() {
        return this._shoppingCartId;
    }

    public set shoppingCartId(value: string | null) {
        this._shoppingCartId = value;
    }

    public set allPendingOrders(value: Array<string>) {
        this._allPendingOrders = value;
    }

    public get allPendingOrders() {
        return this._allPendingOrders;
    }

    public get childOfferMap(): any {
        return this._childOfferMap;
    }

    public set childOfferMap(obj: any | null) {
        if (obj !== null)
            this._childOfferMap.set(obj.value, obj.action);
        else this._childOfferMap.clear();
    }

    public get promotions() {
        return this._promotionMap;
    }

    public set promotions(obj: any | null) {
        if (obj !== null)
            this._promotionMap.set(obj.value, obj.action);
        else this._promotionMap.clear();
    }

    public get charMap() {
        return this._charMap;
    }

    public set charMap(value: Map<string, any[]> | null) {
        this._charMap = value;
    }

    public get topOffer() {
        return this._topOffer;
    }

    public set topOffer(offer) {
        this._topOffer = offer;
    }

    public get originalSalesOrderRecurrentPrice() {
        return this._originalSalesOrderRecurrentPrice;
    }

    public set originalSalesOrderRecurrentPrice(price: number) {
        this._originalSalesOrderRecurrentPrice = price;
    }

    public get originalSalesOrderOneTimePrice() {
        return this._originalSalesOrderOneTimePrice;
    }

    public set originalSalesOrderOneTimePrice(price: number) {
        this._originalSalesOrderOneTimePrice = price;
    }

    public get SORecurrentPriceAlterationList() {
        return this._SORecurrentPriceAlterationList;
    }

    public set SORecurrentPriceAlterationList(
        SORecurrentPriceAlterationList: Array<string>,
    ) {
        this._SORecurrentPriceAlterationList = SORecurrentPriceAlterationList;
    }

    public get SOOneTimePriceAlterationList() {
        return this._SOOneTimePriceAlterationList;
    }

    public set SOOneTimePriceAlterationList(
        SOOneTimePriceAlterationList: Array<string>,
    ) {
        this._SOOneTimePriceAlterationList = SOOneTimePriceAlterationList;
    }

    public set distributionChannel(distributionChannel: string) {
        this._distributionChannel = (<{ [key: string]: any }>(
            ncConstants.distributionChannel
        ))[distributionChannel];
    }

    public get distributionChannel(): string {
        return this._distributionChannel;
    }

    public set distributionChannelExternalId(value: string) {
        this._distributionChannelExternalId = value;
    }

    public get distributionChannelExternalId(): string {
        return this._distributionChannelExternalId;
    }

    public set customerCategory(customerCategory: string) {
        this._customerCategory = customerCategory;
    }

    public get customerCategory(): string {
        return this._customerCategory;
    }

    public set shoppingCartApiInstance(scInstance: ShoppingCartApi) {
        this._shoppingCartApiInstance = scInstance;
    }

    public get shoppingCartApiInstance(): ShoppingCartApi {
        return this._shoppingCartApiInstance;
    }

}