export class payloadGenerator {
    shoppingCartId: string;
    constructor(
        shoppingCartId: string
    ) {
        this.shoppingCartId = '';
    }
    public applyPromotion(): string {
        return `/marketsales/fifaShoppingCart/v2/shoppingcart/` + this.shoppingCartId
    }
}
