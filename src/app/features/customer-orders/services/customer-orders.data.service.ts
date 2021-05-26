import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    CustomerOrder, CustomerOrderDetails, DataPage, Filter
} from '../../../common/models/index';
import { AppSettingsService } from '../../../common/services/appsettings.service';

@Injectable()
export class CustomerOrdersDataService {

    constructor(
        private ass: AppSettingsService,
        private http: HttpClient,
    ) { }

    public get serverUrl(): string {
        return this.ass.getProperty('session.serverUrl');
    }

    public get take(): number {
        return this.ass.getProperty(['services', 'customer-orders.data', 'defaults', 'take'], 10);
    }

    public get timeout(): number {
        return this.ass.getProperty(['services', 'customer-orders.data', 'timeout']);
    }

    readOrders(skip: number = 0, take?: number, filter?: Filter): Observable<DataPage<CustomerOrder>> {
        const url = this.serverUrl + 'api/v1/customer_orders';
        const request: any = { skip, take: take ?? this.take, sort: "id=false" };
        if (filter) {
            request.filter = filter.toString(false);
        }
        return this.http.get<DataPage<CustomerOrder>>(url, { params: request });
    }

    readOrder(id: string): Observable<CustomerOrderDetails> {
        const url = this.serverUrl + 'api/v1/customer_orders/' + id;
        let req = this.http.get<CustomerOrderDetails>(url);
        // const t = this.timeout;
        // if (t) {
        //     req = req.pipe(timeout(t));
        // }
        return req;
    }

    createOrder(order: CustomerOrder): Observable<Exclude<CustomerOrderDetails, 'product'>> {
        const url = this.serverUrl + 'api/v1/customer_orders';
        let req = this.http.post<Exclude<CustomerOrderDetails, 'product'>>(url, order);
        // const t = this.timeout;
        // if (t) {
        //     req = req.pipe(timeout(t));
        // }
        return req;
    }

    updateOrder(order: CustomerOrder): Observable<CustomerOrder> {
        const url = this.serverUrl + 'api/v1/customer_orders';
        let req = this.http.put<CustomerOrder>(url, order);
        // const t = this.timeout;
        // if (t) {
        //     req = req.pipe(timeout(t));
        // }
        return req;
    }

    deleteOrder(id: string): Observable<CustomerOrder> {
        const url = this.serverUrl + 'api/v1/customer_orders/' + id;
        let req = this.http.delete<CustomerOrder>(url);
        // const t = this.timeout;
        // if (t) {
        //     req = req.pipe(timeout(t));
        // }
        return req;
    }

    printPdf(id: string, version: string): Observable<Blob> {
        const url = this.serverUrl + 'api/v1/customer_orders/' + id + '/print?version=' + version;
        return this.http.get(url, { responseType: 'blob' });
    }
}
