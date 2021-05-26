export class ConfigurationPricing {
    sku_based: boolean;
    sku?: string;
    item_code?: string;
    item_code_key?: string;
    metal_code?: string;
    qo_pairs: { question_id: string, option_id: string }[];
    option_id?: string;
    price_option_id: string;
    product_price: boolean;
}
