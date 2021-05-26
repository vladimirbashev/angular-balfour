import { Organization } from '../../../app/common/models/Organization';
import { MockStorage } from '../mock-storage';
import { storages } from '../storage';

class MockOrganizationsStorage extends MockStorage<Organization> {

    constructor(key?: string) {
        super({ key: key || 'organizations' });
        if (!storages.has(key || 'organizations')) {
            storages.push(this);
        }
    }

}

export const organizationsStorage = new MockOrganizationsStorage('organizations');
