export class payloadGenerator {
    offers: Array<String>;
    constructor(
        offers: Array<String>
    ) {
        this.offers = [];
    }
    // static queryGenerator (offers: Array<String>) {
    //     return `id=${offers.join(',')}`;
    // }
    public generateQueryParams(): any {
                return `id=${this.offers.join(',')}`
    }
}
