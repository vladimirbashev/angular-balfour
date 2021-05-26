import { Injectable } from '@angular/core';

import { storages } from './storage';

@Injectable()
export class MockInitService {

    constructor() { }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            storages.init().then(() => {
                resolve();
            });
        });
    }
}

export function mockInit(mis: MockInitService): () => void {
    return () => mis.init();
}
