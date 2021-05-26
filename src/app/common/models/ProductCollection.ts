export class ProductCollection {
    id: string;
    external_ref_id: string;
    name = '';
    description?: string;
    active: boolean;
    type: string;
    creator_id: string;
    create_date: Date;
    update_date: Date;
    reseller_id: string;
}

export enum ProductCollectionType {
    Channel = 'Channel',
    ProductLine = 'ProductLine'
}