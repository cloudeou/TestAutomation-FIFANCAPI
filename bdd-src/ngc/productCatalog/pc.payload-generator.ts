export class payloadGenerator {
    offers: Array<String>;
    constructor(
        offers: Array<String>
    ) {
        this.offers = offers;
    }
    public generateQueryParams(): any {
                return `id=${this.offers.join(',')}`
    }
}
