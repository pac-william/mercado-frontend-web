import { Meta } from "@/app/domain/metaDomain";

export class Market {
    constructor(
        public id: string,
        public name: string,
        public address: string,
        public logo: string,
        public rating?: number,
        public ratingCount?: number,
    ) { }
}

export class MarketPaginatedResponse {
    constructor(
        public markets: Market[],
        public meta: Meta,
    ) { }
}