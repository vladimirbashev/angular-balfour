import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SalesProduct } from '../../../common/models/SalesProduct';
import { AppSettingsService } from '../../../common/services/appsettings.service';

@Injectable()
export class ProductsDataService {
    constructor(
        private ass: AppSettingsService,
        private http: HttpClient,
    ) { }

    public get serverUrl(): string {
        return this.ass.getProperty('session.serverUrl');
    }

    public get timeout(): number {
        return this.ass.getProperty(['services', 'products.data', 'timeout']);
    }

    public readSalesProduct(id: string): Observable<SalesProduct> {
        let req = this.http.get<SalesProduct>(this.serverUrl + 'api/v1/sales_products/' + id);
        // const t = this.timeout;
        // if (t) {
        //     req = req.pipe(timeout(t));
        // }
        return req;
    }
}
