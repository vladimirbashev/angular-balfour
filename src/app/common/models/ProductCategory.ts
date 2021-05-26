export class ProductCategory {
    id: string;
    name: string;
    description: string;
    parent_id: string;
    parents?: string[];
    children?: string[];
    creator_id: string;
    create_date: Date;
    update_date: Date;
    vendor_id: string;
}