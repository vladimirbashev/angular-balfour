// import { applicationsGroupsStorage, applicationsStorage } from './applications/storage';
// import { usersStorage } from './users/storage';
import { MockStorage } from './mock-storage';

export class MockStorageCollection {

    private _storagesIdx: { [name: string]: number } = {};
    private _storages: { name: string, storage: MockStorage<any> }[] = [];

    public MOCK_VERSION: number;

    public async init() {
        return fetch('./assets/mock/version.json')
            .then(resp => resp.json())
            .then(async (data) => {
                this.MOCK_VERSION = data.version;
                const version = JSON.parse(localStorage.getItem('MOCK_VERSION'));
                console.log('MockStorageCollection versions ', version, this.MOCK_VERSION);
                const force = version !== this.MOCK_VERSION;
                if (force) { localStorage.setItem('MOCK_VERSION', JSON.stringify(this.MOCK_VERSION)); }
                console.log('MockStorageCollection init', this._storages);
                for (const s of this._storages) {
                    await s.storage.init(force);
                }
                console.log('MockStorageCollection init done');
            });
    }

    public has(name: string): boolean {
        return this._storagesIdx.hasOwnProperty(name);
    }

    public push(storage: MockStorage<any>) {
        this._storages.push({
            name: storage.key,
            storage
        });
        this._storagesIdx[storage.key] = this._storages.length - 1;
    }
}

const storages = new MockStorageCollection();

export { storages };
