export class bodyParser {
  static getItemIdByProductOffering(response: any, productOfferingId: string) {
    if (response == null || response == undefined) {
      return "";
    }
    let itemId = "";
    response.cartItem.forEach((item: any) => {
      if (item.productOffering.id == productOfferingId) {
        itemId = item.id;
      }
    });
    return itemId;
  }

  static getChildItemByProductOffering(
    response: any,
    productOfferingId: string
  ) {
    if (response == null) {
      return null;
    }
    let itemResult = null;
    response.cartItem.forEach((item: any) => {
      if (item.productOffering.id == productOfferingId) {
        itemResult = item;
        return itemResult;
      }
      item.cartItem.forEach((childitem: any) => {
        if (childitem.productOffering.id == productOfferingId) {
          itemResult = childitem;
          return itemResult;
        }
      });
    });
    return itemResult;
  }

  static getChildItemIdByProductOffering(
    response: any,
    productOfferingId: string
  ) {
    if (response == null) {
      return "";
    }
    let itemResultId = "";
    response.cartItem.forEach((item: any) => {
      if (item.productOffering.id == productOfferingId) {
        itemResultId = item.id;
        return itemResultId;
      }
      item.cartItem.forEach((childitem: any) => {
        if (childitem.productOffering.id == productOfferingId) {
          itemResultId = childitem.id;
          return itemResultId;
        }
      });
    });
    return itemResultId;
  }

  static getItemByProductOffering(response: any, productOfferingId: string) {
    if (response == null) {
      return "";
    }
    let itemResult = "";
    response.cartItem.forEach((item: any) => {
      if (item.productOffering.id == productOfferingId) {
        itemResult = item;
      }
    });
    return itemResult;
  }

  static getDiscountIdForProductOffer(
    response: any,
    productOfferingId: string,
    promotionCode: string
  ) {
    if (response == null) {
      return "";
    }
    let id = null,
      temp;
    for (let i = 0; i < response.cartItem.length; i++) {
      if (response.cartItem[i].productOffering.id == productOfferingId) {
        temp = response.cartItem[i].itemPrice[0].priceAlteration;
        for (let j = 0; j < temp.length; j++) {
          if (temp[j].catalogId === promotionCode) {
            id = temp[j].id;
            break;
          }
        }
        if (id !== null) break;
      }
    }
    if (id == null) {
      console.log("No price for this item or item not found");
    }
    return id;
  }

  static getSCChars(resposnse: any) {
    return resposnse.characteristic;
  }

  static getCartItemObjects(response: any) {
    const { cartItem: items } = response;
    return items;
  }

  static getOfferingsFromCartItems(items: any) {
    let offerings = items.map((item: any) => item.productOffering);
    return offerings;
  }

  static getProductsFromCartItems(items: any) {
    let offerings = items.map((item: any) => item.product);
    return offerings;
  }

  static getChildsByProductOfferingFromCart(
    response: any,
    productOfferingId: string
  ) {
    const childs: string[] = [];
    if (response == null) {
      return "";
    }
    response.cartItem.forEach((item: any) => {
      if (item.productOffering.id == productOfferingId) {
        item.cartItem.forEach((child: any) => {
          childs.push(child.productOffering.id);
        });
      }
    });
    return childs;
  }

  static getItemIdCharValue(
    response: any,
    productOfferingId: string,
    charName: string,
    itemNumber = 0,
    shift = 0
  ) {
    let matchesP = response.cartItem.filter(
      (item: any) => item.productOffering.id == productOfferingId
    );
    let matchesC: Array<any> = [];
    response.cartItem.forEach((item: any) => {
      let newMatches = item.cartItem.filter(
        (itemc: any) => itemc.productOffering.id == productOfferingId
      );
      matchesC = matchesC.concat(newMatches);
    });
    const matches = matchesP.concat(matchesC);
    if (itemNumber == 0) {
      const res = matches[itemNumber].product.characteristic.find(
        (char: any) => char.name == charName
      ).value;
      return res;
    } else {
      const res = matches[itemNumber - 1 + shift].product.characteristic.find(
        (char: any) => char.name == charName
      ).value;
      return res;
    }
  }
}
