import { DateUtils } from "../../utils/common/DateUtils"

export class PayloadGenerator {
    ecid: string;
    shipmentOrderObjectId: string;
    orderNumber: string;
    sku: string;
    status?: string | null;
    trackingNumber?: string | null;
    expectedDeliveryDate?: string | null;
    shipper?: string | null;
    operationName?: string | null;
    notificationType?: string | null;
    ICCID?: string | null;



    constructor(
        ecid: string,
        shipmentOrderObjectId: string,
        orderNumber: string,
        sku: string,
        status?: string | null | undefined,
        trackingNumber?: string | null,
        expectedDeliveryDate?: string | null | undefined,
        shipper?: string | null | undefined,
        operationName?: string | null | undefined,
        notificationType?: string | null | undefined,
        ICCID?: string | null | undefined,
    ) {
        this.ecid = ecid;
        this.shipmentOrderObjectId = shipmentOrderObjectId;
        this.orderNumber = orderNumber;
        this.sku = sku;
        this.status = status;
        this.trackingNumber = trackingNumber;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.shipper = shipper;
        this.operationName = operationName;
        this.notificationType = notificationType;
        this.ICCID = ICCID;
    }

    generateItem(
        ecid: string,
        shipmentOrderObjectId: string,
        orderNumber: string,
        sku: string,
        status?: string | null | undefined,
        // trackingNumber?: string | null,
        // expectedDeliveryDate?: string | null | undefined,
        // shipper?: string | null | undefined,
        operationName?: string | null | undefined,
        notificationType?: string | null | undefined,
        ICCID?: string | null | undefined ) {
        const trackingNumber = "539459352A";
        const shipper = "CANADA POST";
        const expectedDeliveryDate = DateUtils.dateMMDDYYYY(DateUtils.tomorrowDate(),"/");
        return {
            ecid,
            shipmentOrderObjectId,
            orderNumber,
            sku,
            status,
            trackingNumber,
            expectedDeliveryDate,
            shipper,
            operationName,
            notificationType,
            ICCID
          }
    }
}