import { CustomerPayment } from './CustomerPayment';
import { ProductPrice } from './ProductPrice';
import { SelectionPart } from './SelectionPart';
import { VendorOrderStatus } from './VendorOrder';
import { Customer } from './Customer';

export class CustomerOrder {
    id: string;
    order_date: Date;
    product_id: string; // Related sales product id
    parts: SelectionPart[]; // Answers
    pricing: ProductPrice[]; // Prices for product parts
    total_price: number;
    payment_info: CustomerPayment; // Order's payment info.
    customer: Customer;
    owner_id: string;
    create_date: Date;
    update_date: Date;
    vendor_order_status: VendorOrderStatus
    vendor_order_id: string;
    promo_code: string;
    design_number: string;
    status: string;
}

export enum CustomerOrderStatus {
    Complete = 'complete',
    Incomplete = 'incomplete'
}