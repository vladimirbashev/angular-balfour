import { CustomerOrder } from '../../../app/common/models/index';
import { MockStorage } from '../mock-storage';
import { storages } from '../storage';

class MockCustomerOrdersStorage extends MockStorage<CustomerOrder> {

    constructor(key?: string) {
        super({ key: key || 'customer-orders' });
        if (!storages.has(key || 'customer-orders')) {
            storages.push(this);
        }
    }

}

export const customerOrdersStorage = new MockCustomerOrdersStorage('customer-orders');
