import { Meta } from "@/app/domain/metaDomain";

export interface MarketAddressData {
    id: string;
    marketId: string;
    name: string;
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number | null;
    longitude?: number | null;
    createdAt: string;
    updatedAt: string;
}

export class Market {
    constructor(
        public id: string,
        public name: string,
        public address: string,
        public profilePicture: string,
        public bannerImage: string,
        public rating?: number,
        public ratingCount?: number,
        public addressId?: string | null,
        public addressData?: MarketAddressData | null,
    ) { }
}

export class MarketPaginatedResponse {
    constructor(
        public markets: Market[],
        public meta: Meta,
    ) { }
}