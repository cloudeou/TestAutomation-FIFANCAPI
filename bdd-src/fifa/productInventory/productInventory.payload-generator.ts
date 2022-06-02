export class payloadGenerator {
   
    getProductInventory(params: {
        ecid: number;
        externalLocationId: string;
        limit?: number;
        fields?: string;
      }) {
        let uri =
          '/product/fifaProductInventoryManagement/v1/product' +
          '?relatedParty.id=' +
          params.ecid +
          '&relatedParty.role=customer&place.id=' +
          params.externalLocationId +
          '&place.role=service%20address&';
          uri += !!params.fields
          ? 'fields=' + params.fields
          : 'limit=' + params.limit;
        
          return uri
          
        
      }
}