export class Filter {
    [key: string]: any;

    constructor(filter?: string | object) {
        if (filter) {
            const obj = typeof filter === 'string' ? this._stringToObject(filter) : filter;
            Object.keys(obj).forEach(key => {
                Object.defineProperty(this, key, {
                    enumerable: true,
                    value: obj[key]
                });
            });
        }
    }

    private _stringToObject(str: string, delimiter: string = ';'): object {
        const parts = str.split(delimiter);
        const res = {};
        for (const part of parts) {
            const eqIdx = part.indexOf('=');
            if (eqIdx <= 1) { continue; }
            const [k, v] = [part.slice(0, eqIdx), part.slice(eqIdx + 1)];
            let value;
            if (['true', 'false'].includes(v)) {
                value = v === 'true';
            } else if ('null' === v) {
                value = null;
            } else if (v.includes(',') && v.includes('=')) {
                value = this._stringToObject(v, ',');
            } else if (v.includes(',')) {
                value = v.split(',');
            } else if (parseFloat(v)) {
                // const isHex = /^[0-9A-Fa-f]+$/.test(v);
                // value = isHex && parseFloat(v).toString(16) !== v.replace(/^[0]+/, '').toLowerCase() ? v : parseFloat(v);
                value = v;
            } else if (Date.parse(v)) {
                value = new Date(v);
            } else {
                value = v;
            }
            res[k] = value;
        }
        return res;
    }

    public toString(uriEncoding: boolean = true, hasEmpty: boolean = true): string {
        const pairs = [];
        const keys = Object.keys(this);
        for (const key of keys) {
            if (!this.hasOwnProperty(key) || (!hasEmpty && (this[key] === null || this[key] === ''))) { continue; }
            switch (typeof this[key]) {
                case 'string':
                case 'number':
                    pairs.push(`${key}=${uriEncoding ? encodeURIComponent(this[key]) : this[key]}`);
                    break;
                case 'boolean':
                    pairs.push(`${key}=${this[key].toString()}`);
                    break;
                case 'object':
                    if (this[key] === null) {
                        pairs.push(`${key}=null`);
                    } else if (this[key] instanceof Date) {
                        pairs.push(`${key}=${this[key].toISOString()}`);
                    } else if (Array.isArray(this[key])) {
                        pairs.push(`${key}=${this[key].join(',')}`);
                    }
                    break;
            }
        }
        return pairs.join(';');
    }
}
