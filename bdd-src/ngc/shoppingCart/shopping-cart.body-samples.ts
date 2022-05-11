import { bodyParser } from "./shopping-cart.body-parser";

import {data} from "../../../test-data/data";
// module.exports = {
export class BodySamples {
  mainBody(
    ecid: number,
    customerCategory: string,
    distributionChannel: string,
    lpdsid: number,
    cartItems?: Array<any>,
    charItems?: Array<any>
  ) {
    const isDistChanExtId = !Object.values(
        data.distributionChannel
    ).includes(distributionChannel);

    return {
      relatedParty: [
        {
          id: ecid != null ? ecid : "",
          role: "customer",
          characteristic: [
            {
              name: "category",
              value: customerCategory,
            },
          ],
        },
      ],
      channel: {
        id: distributionChannel,
        "@referenceType": isDistChanExtId ? "External_ID" : undefined,
      },
      place: [
        {
          id: `${lpdsid}`,
        },
      ],
      characteristic: charItems ? charItems : "",
      cartItem: cartItems ? cartItems : "",
    };
  }

  topOfferItem(
    offer: string,
    itemId: string,
    action: string,
    charItems?: Array<any>,
  ) {
    return {
      action: action ? action : "Add",
      id: itemId,
      productOffering: {
        id: offer,
      },
      product: {
        characteristic: charItems ? charItems : [],
      },
    };
  }

  removeTopOfferItem(itemId: string) {
    return {
      action: "Delete",
      id: itemId,
    };
  }

  childOfferItem(
    childOffer: string,
    parentItem: string,
    parentProductOffering?: string,
    itemId?: string,
    action?: string,
    charItems?: Array<any>
  ) {
    return {
      action:
        action != null && action != "undefined" ? action : "" ? "" : "Add",
      id: itemId,
      productOffering: {
        id: childOffer,
      },
      product: {
        characteristic: charItems ? charItems : [],
      },
      cartItemRelationship:
        action == ""
          ? ""
          : [
            {
              id: parentItem,
              productOffering: {
                id: parentProductOffering,
              },
              type: "parent",
            },
          ],
    };
  }

  static charupdate(childOffer: string, charItems: Array<any>) {
    return {
      productOffering: {
        id: childOffer,
      },
      product: {
        characteristic: charItems != null ? charItems : [],
      },
    };
  }

  // removechildOfferItem: function (itemId, parentItem) {
  //     return cartItem = {
  //         'action': 'Delete',
  //         'id': itemId,
  //         'cartItemRelationship': [{
  //             'id': parentItem,
  //             'type': 'parent'
  //         }]
  //     }
  // },

  updateTopOfferItem(itemId: string, charItems: Array<any>) {
    return {
      action: "Add",
      id: itemId,
      product: {
        characteristic: charItems,
      },
    };
  }

  updateChildOfferItem(
    childItemId: string,
    parentItemId: string,
    charItems: Array<any>
  ) {
    return {
      action: "Add",
      id: childItemId,
      product: {
        characteristic: charItems,
      },
      cartItemRelationship: [
        {
          id: parentItemId,
          type: "parent",
        },
      ],
    };
  }

  charItem(charContainter: any) {
    return {
      name: charContainter.name,
      value: charContainter.value,
    };
  }

  static validateOrSubmitBody(
    customerCategory: string,
    distributionChannel: string
  ) {
    const isDistChanExtId = !Object.values(
        data.distributionChannel
    ).includes(distributionChannel);

    return {
      relatedParty: [
        {
          role: "customer",
          characteristic: [
            {
              name: "category",
              value: customerCategory,
            },
          ],
        },
      ],
      channel: {
        id: distributionChannel,
        "@referenceType": isDistChanExtId ? "External_ID" : undefined,
      },
    };
  }

  createCustomerBody(customerEmail: string, addressId: number) {
    return {
      firstName: "Merlin",
      lastName: "Automation" + Math.random(),
      businessCustomer: "",
      email: customerEmail,
      addressId: addressId,
      postalZipCode: "E3E3E3",
      personal: {
        provinceOfResidence: "BC",
        birthDate: "1988-12-25",
        driverLicense: {
          number: "2456269",
          provinceCd: "BC",
        },
      },
    };
  }

  getAvailableProductOfferings(context: any, category: string) {
    return {
      relatedParty: [
        {
          role: "customer",
          characteristic: [
            {
              name: "category",
              value: context.customerCategory,
            },
          ],
        },
      ],
      channel: {
        id: context.distributionChannel,
        name: "CSR",
      },
      place: [
        {
          id: context.locationId,
          role: "service address",
        },
      ],
      productOfferingQualificationItem: [
        {
          id: "!",
          productOffering: {
            category: [
              {
                id: category,
              },
            ],
          },
        },
      ],
    };
  }

  getServiceQualification(lpdsid: number) {
    return {
      serviceQualificationItem: [
        {
          id: lpdsid,
        },
      ],
    };
  }

  getProductQualification(
    customerCategory: string,
    distributionChannel: string,
    lpdsid: number,
    productOfferingId?: string,
    categoryList?: any,
    charItems?: Array<any>,
    commitmentId?: string,
    shoppingCartId?: string
  ) {
    const isDistChanExtId = !Object.values(
        data.distributionChannel
    ).includes(distributionChannel);
    const id = shoppingCartId ? { id: shoppingCartId } : undefined;
    return {
      relatedParty: [
        {
          role: "customer",
          characteristic: [
            {
              name: "category",
              value: customerCategory,
            },
          ],
        },
      ],
      channel: {
        id: distributionChannel,
        "@referenceType": isDistChanExtId ? "External_ID" : undefined,
      },
      place: {
        id: lpdsid,
        role: "service address",
      },
      productOfferingQualificationItem: this.getProductQual(
        <string>productOfferingId,
        <string>commitmentId,
        categoryList,
        charItems
      ),
      shoppingCart: id,
    };
  }

  // UPD: ATTENTION: temporary solution
  static getOffering(
    productOfferingId: string,
    categoryList?: any,
    prodSpecCharValueUse?: any
  ) {
    let offering;
    if (productOfferingId) {
      offering = {
        id: productOfferingId,
      };
    } else if (categoryList) {
      offering = {
        category: categoryList,
        prodSpecCharValueUse: prodSpecCharValueUse
          ? prodSpecCharValueUse
          : undefined,
      };
    }
    return offering;
  }

  getProductQual(
    productOfferingId: string,
    commitmentId: string,
    categoryList?: any,
    prodSpecCharValueUse?: any
  ) {
    let qual = [];
    if (
      categoryList !== undefined &&
      categoryList !== "undefined" &&
      categoryList !== null
    ) {
      qual.push({
        id: "1",
        productOffering: BodySamples.getOffering(
          <string>(<unknown>null),
          categoryList,
          prodSpecCharValueUse
        ),
      });
    }
    if (
      productOfferingId !== undefined &&
      productOfferingId !== "undefined" &&
      productOfferingId !== null
    ) {
      qual.push({
        id: qual.length == 1 ? "2" : "1",
        productOffering: BodySamples.getOffering(productOfferingId, null, null),
        qualificationItemRelationship: [
          {
            type: "bundledProductOffering",
          },
        ],
      });
    }
    if (
      commitmentId !== undefined &&
      commitmentId !== "undefined" &&
      commitmentId !== null
    ) {
      qual.push({
        id: qual.length == 2 ? "3" : "2",
        productOffering: BodySamples.getOffering(commitmentId, null, null),
        qualificationItemRelationship: [
          {
            type: "withItem",
            id: "1",
          },
        ],
      });
    }
    return qual;
  }

  getCategoryItem(categoryId: string) {
    return {
      id: categoryId,
    };
  }

  getAppPromotion(
    locationId: number,
    channel: string,
    customerCategory: string,
    cartItems: Array<any>
  ) {
    return {
      place: [
        {
          id: locationId,
          role: "service address",
        },
      ],
      channel: {
        id: channel,
      },
      relatedParty: [
        {
          _comment: "add 'id' attribute in case ECID is known",
          role: "customer",
          characteristic: [
            {
              name: "category",
              value: customerCategory,
            },
          ],
        },
      ],
      cartItem: cartItems,
    };
  }

  appPromotionCarts(
    discountDetail: any,
    cartItemId: string,
    action: string,
    offerId?: string,
    response?: any
  ) {
    return {
      action: action,
      id: cartItemId,
      itemPrice: [
        {
          priceType: "Recurrent",
          price: {
            dutyFreeAmount: {
              value: null,
            },
          },
          priceAlteration: this.getPriceAlterations(
            response,
            <string>offerId,
            discountDetail,
            action
          ),
        },
      ],
    };
  }

  getPriceAlterations(
    scResponse: any,
    offerId: string,
    discountDetail: any,
    action: string
  ) {
    let priceAlteration: Array<any> = [];
    discountDetail.forEach((discount: any) => {
      priceAlteration.push({
        id: bodyParser.getDiscountIdForProductOffer(
          scResponse,
          offerId,
          discount.discountId
        ),
        catalogId: discount.discountId,
        reasonCodeId: discount.reasonCd,
        action: !!action ? action : "Add",
      });
    });
    return priceAlteration;
  }
}
