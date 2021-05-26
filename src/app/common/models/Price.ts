export class Price {
    id: string;
    pricefile: any;
    external_ref_id: string;
    product_id: string;
    configuration_id: string;
    option_id: string;
    item_code: string;
    item_code_key: string;
    metal_code: string;
    sku: string;
    price_net: number;
    price_net_full: number;
    price_retail: number;
    price_retail_full: number;
    start_date: Date;
    end_date: Date;
    promo_code: string;
    priority: number;
    note: string;
    creator_id: string;
    create_date: Date;
    update_date: Date;
}

export class PriceValues {
    price_net = 0;
    price_net_full = 0;
    price_retail = 0;
    price_retail_full = 0;
}
