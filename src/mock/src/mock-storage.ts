import * as bn from 'bn.js';
import assign from 'lodash-es/assign';
import cloneDeep from 'lodash-es/cloneDeep';
import sortBy from 'lodash-es/sortBy';

export class MockStorage<T> {

    private _idField = 'id';

    protected _defaultItems: T[];
    protected _items: T[];
    protected _key: string;
    protected _lastId: bn = new bn(0);

    public readonly key: string;

    constructor(payload: {
        key: string,
        idField?: string
    }) {
        this._defaultItems = [];
        this._items = [];
        this._key = payload.key;
        this.key = 'MOCK_' + payload.key.toUpperCase();
        if (payload.idField) {
            this._idField = payload.idField;
        }
    }

    private _save(): void {
        localStorage.setItem(this.key, JSON.stringify(this._items));
    }

    public async init(force?: boolean): Promise<void> {
        console.groupCollapsed('💾 MockStorage ' + this.key);
        console.log('init');
        if (force) { localStorage.removeItem(this.key); }
        this._items = JSON.parse(localStorage.getItem(this.key));
        if (!this._items) {
            if (this._defaultItems.length === 0) {
                console.log('should read defaults');
                await this.readDefaults();
                console.log('read defaults');
            }
            this._items = sortBy(cloneDeep(this._defaultItems), this._idField);
            console.log('initialized with items', this._items);
        } else {
            console.log('items read from localStorage');
            this._items = sortBy(this._items, this._idField);
        }
        if (this._items.length) {
            try {
                this._lastId = new bn(this._items[this._items.length - 1][this._idField], 16);
            } catch (err) { }
        }
        console.log('last_id: ', this._lastId);
        console.groupEnd();
    }

    public async readDefaults(): Promise<void> {
        return fetch('./assets/mock/' + this._key + '.json')
            .then(resp => resp.json())
            .then(items => {
                this._defaultItems = items;
                console.log('new defaults is', this._defaultItems);
            })
            .catch(err => {
                this._defaultItems = [];
                console.log('error happened during loading default items, empty collection used as default');
            });
    }

    public get count(): number {
        return this._items.length;
    }

    public get items(): T[] {
        return this._items;
    }

    public filterByField(name: string, value: any): T[] {
        return this._items.filter(it => it[name] === value);
    }

    public findByField(name: string, value: any): T {
        return this._items.find(it => it[name] === value);
    }

    public createItem(value: T): string {
        this._lastId.iadd(new bn(1));
        value = Object.assign({}, value);
        value[this._idField] = this._lastId.toString(16).padStart(32, '0');
        this._items.push(value);
        this._save();
        return value[this._idField];
    }

    public updateItemByField(name: string, value: any, item: Partial<T>): void {
        const idx = this._items.findIndex(it => it[name] === value);
        if (idx >= 0) {
            this._items[idx] = assign(item, this._items[idx]);
            this._save();
        }
    }

    public deleteItemByField(name: string, value: any): boolean {
        const idx = this._items.findIndex(it => it[name] === value);
        if (idx >= 0) {
            this._items.splice(idx, 1);
            this._save();
            return true;
        }
        return false;
    }
}
