import { MultiString } from './MultiString';
import { ProductPricing } from './ProductPricing';

export class Product {
    id: string;
    name: string;
    active: boolean;
    display_name: MultiString;
    display_desc: MultiString;
    organization_ids: string[];
    product_collection_ids: string[];
    product_categories_ids: string[];
    prices: ProductPricing[];
    avatar: string;
    vendor_id: string;
    creator_id: string;
    create_date: Date;
    update_date: Date;
}
