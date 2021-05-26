import { Customer } from '../../../app/common/models/Customer';
import { MockStorage } from '../mock-storage';
import { storages } from '../storage';

class MockCustomersStorage extends MockStorage<Customer> {

    constructor(key?: string) {
        super({ key: key || 'customers' });
        if (!storages.has(key || 'customers')) {
            storages.push(this);
        }
    }

}

export const customersStorage = new MockCustomersStorage('customers');
