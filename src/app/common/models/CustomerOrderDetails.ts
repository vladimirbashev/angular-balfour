import { Customer } from './Customer';
import { CustomerOrder } from './CustomerOrder';
// combined Customer, CustomerOrder, SalesProduct
import { SalesProduct } from './SalesProduct';

export class CustomerOrderDetails {
    order: CustomerOrder;
    product: SalesProduct;
}
