import { Identificators } from "../Identificators";
import ncConstants from "../../../bdd-src/utils/nc-constants";
import {ShoppingCartApi} from "../../../bdd-src/ngc/shopping-cart/shopping-cart.api";

export default class ShoppingCartContext {
  public identificator = Identificators.shoppingCartContext;
  private _shoppingCartId: string| null = null;
  private _selectedOffers: Array<string> = [];
  private _childOfferMap = new Map();
  private _promotionMap = new Map();
  private _charMap: Map<string, Array<[]>> | null = new Map();
  private _topOffer: string = '';
  private _allOrdersStatus: Array<string> = [];
  private _allPendingOrders: Array<string> = [];
  private _offerList: Array<[]> = [];
  private _offersToAdd: Map<string,string> = new Map();
  private _salesOrderId: string = '';
  private _salesOrderStatus: string = "";
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


  public set soStatus(status: string) {
    this._salesOrderStatus = status;
  }

  public get soStatus(): string {
    return this._salesOrderStatus;
  }


  public setExistingChildOffers(childOffers: Map<string, Map<string, any>> | null) {
    this._existingChildOffers = childOffers;
  }

  public getExistingChildOffers() {
    return this._existingChildOffers;
  }

  public getExistingChildOfferById(tloId: string, sloId: string) {
    return this._existingChildOffers?.get(tloId)?.get(sloId);
  }

  public setSalesOrderId(salesOrderId: string) {
    this._salesOrderId = salesOrderId;
  }

  public getSalesOrderId() {
    return this._salesOrderId;
  }

  public setAddingPromotion() {
    this._addingPromotion = true;
  }

  public clearAddingPromotion() {
    this._addingPromotion = false;
  }

  public checkIfAddingPromotion() {
    return this._addingPromotion;
  }

  public setAddingOffer() {
    this._addingOffer = true;
  }

  public clearAddingOffer() {
    this._addingOffer = false;
  }

  public checkIfAddingOffer() {
    return this._addingOffer;
  }

  checkIfAddingChild() {
    return this._addingChildOffer;
  }

  public setAddingChild() {
    this._addingChildOffer = true;
  }

  public clearAddingChild() {
    this._addingChildOffer = false;
  }

  checkIfAddingCharMap() {
    return this._addingCharMap;
  }

  public setAddingCharMap() {
    this._addingCharMap = true;
  }

  public clearAddingCharMap() {
    this._addingCharMap = false;
  }

  public setOffersToAdd(offerList: Array<[]>, action: string) {
    // this._offersToAdd = _offerList;
    offerList.forEach((offer) => {
      this._offersToAdd.set(String(offer), action);
    });
  }

  public resetOffersToAdd() {
    this._offersToAdd.clear();
  }

  public getOffersToAdd() {
    return this._offersToAdd;
  }

  public setAvailableOffers(offerList: Array<[]>) {
    this._offerList = offerList;
  }

  public getAvailableOffers() {
    return this._offerList;
  }

  public getShoppingCartId() {
    return this._shoppingCartId;
  }
  public setShoppingCartId(value: string | null) {
    this._shoppingCartId = value;
  }

  public getAllPendingOrders() {
    return this._allPendingOrders;
  }
  public setAllPendingOrders(value: Array<string>) {
    this._allPendingOrders = value;
  }

  public getAllOrdersStatus() {
    return this._allOrdersStatus;
  }
  public setAllOrdersStatus(value: Array<string>) {
    this._allOrdersStatus = value;
  }

  public getSelectedOffers() {
    return this._selectedOffers;
  }
  public setSelectedOffers(value: Array<string>) {
    this._selectedOffers = value;
  }

  public getChildOfferMap() {
    return this._childOfferMap;
  }
  public setChildOfferMap(value: Map<string, Array<string>>, action: string) {
    // this._childOfferMap = value;
    this._childOfferMap.set(value, action);
  }

  public resetChildOffers() {
    if (this._childOfferMap !== undefined || this._childOfferMap !== null) {
      this._childOfferMap.clear();
    }
  }

  public getPromotions() {
    return this._promotionMap;
  }
  public setPromotions(value: Map<string, any[]>, action: string) {
    this._promotionMap.set(value, action);
  }

  public resetPromotions() {
    if (this._promotionMap !== undefined || this._promotionMap !== null) {
      this._promotionMap.clear();
    }
  }

  public getCharMap() {
    return this._charMap;
  }

  public setCharMap(value: Map<string, any[]> | null) {
    this._charMap = value;
  }

  public getTopOffer() {
    return this._topOffer;
  }

  public setTopOffer(offer: string) {
    this._topOffer = offer;
  }

  public getOriginalSalesOrderRecurrentPrice() {
    return this._originalSalesOrderRecurrentPrice;
  }

  public setOriginalSalesOrderRecurrentPrice(price: number) {
    this._originalSalesOrderRecurrentPrice = price;
  }

  public getOriginalSalesOrderOneTimePrice() {
    return this._originalSalesOrderOneTimePrice;
  }

  public setOriginalSalesOrderOneTimePrice(price: number) {
    this._originalSalesOrderOneTimePrice = price;
  }

  public getSORecurrentPriceAlterationList() {
    return this._SORecurrentPriceAlterationList;
  }

  public setSORecurrentPriceAlterationList(
    SORecurrentPriceAlterationList: Array<string>,
  ) {
    this._SORecurrentPriceAlterationList = SORecurrentPriceAlterationList;
  }

  public getSOOneTimePriceAlterationList() {
    return this._SOOneTimePriceAlterationList;
  }

  public setSOOneTimePriceAlterationList(
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