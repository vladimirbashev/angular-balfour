import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Customer, DataPage, Filter } from '../../../common/models/index';
import { AppSettingsService } from '../../../common/services/appsettings.service';

@Injectable()
export class CustomersDataService {

    constructor(
        private ass: AppSettingsService,
        private http: HttpClient,
    ) { }

    public get serverUrl(): string {
        return this.ass.getProperty('session.serverUrl');
    }

    public get take(): number {
        return this.ass.getProperty(['services', 'customers.data', 'defaults', 'take'], 10);
    }

    readCustomers(skip: number = 0, take?: number, filter?: Filter): Observable<DataPage<Customer>> {
        const url = this.serverUrl + 'api/v1/customers';
        const request: any = { skip, take: take ?? this.take };
        if (filter) {
            request.filter = filter.toString(false);
        }
        return this.http.get<DataPage<Customer>>(url, { params: request });
    }

    readCustomer(id: string): Observable<Customer> {
        const url = this.serverUrl + 'api/v1/customers/' + id;
        return this.http.get<Customer>(url);
    }

    createCustomer(customer: Customer): Observable<Customer> {
        const url = this.serverUrl + 'api/v1/customers';
        return this.http.post<Customer>(url, customer);
    }

    updateCustomer(id: string, customer: Customer): Observable<Customer> {
        const url = this.serverUrl + 'api/v1/customers' + '/' + id;
        return this.http.put<Customer>(url, customer);
    }

    deleteCustomer(id: string): Observable<Customer> {
        const url = this.serverUrl + 'api/v1/customers/' + id;
        return this.http.delete<Customer>(url);
    }
}
