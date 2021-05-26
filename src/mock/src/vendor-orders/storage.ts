import { VendorOrder } from '../../../app/common/models/VendorOrder';
import { MockStorage } from '../mock-storage';
import { storages } from '../storage';

class MockVendorOrdersStorage extends MockStorage<VendorOrder> {

    constructor(key?: string) {
        super({ key: key || 'vendor-orders' });
        if (!storages.has(key || 'vendor-orders')) {
            storages.push(this);
        }
    }

}

export const vendorOrdersStorage = new MockVendorOrdersStorage('vendor-orders');
