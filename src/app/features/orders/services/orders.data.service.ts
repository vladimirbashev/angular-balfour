import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DataPage, Filter, VendorOrder, VendorOrderStatistics } from '../../../common/models/index';
import { AppSettingsService } from '../../../common/services/appsettings.service';

@Injectable()
export class OrdersDataService {

    constructor(
        private ass: AppSettingsService,
        private http: HttpClient,
    ) { }

    public get serverUrl(): string {
        return this.ass.getProperty('session.serverUrl');
    }

    public get take(): number {
        return this.ass.getProperty(['services', 'orders.data', 'defaults', 'take'], 10);
    }

    readOrders(skip: number = 0, take?: number, filter?: Filter): Observable<DataPage<VendorOrder>> {
        const url = this.serverUrl + 'api/v1/orders';
        const request: any = { skip, take: take ?? this.take, sort: "id=false" };
        if (filter) {
            request.filter = filter.toString(false);
        }
        return this.http.get<DataPage<VendorOrder>>(url, { params: request });
    }

    readOrder(id: string): Observable<VendorOrder> {
        const url = this.serverUrl + 'api/v1/orders/' + id;
        return this.http.get<VendorOrder>(url);
    }

    readStatistics(): Observable<VendorOrderStatistics> {
        const url = this.serverUrl + 'api/v1/orders/stats';
        return this.http.get<VendorOrderStatistics>(url);
    }

    createOrder(order: VendorOrder): Observable<VendorOrder> {
        const url = this.serverUrl + 'api/v1/orders';
        return this.http.post<VendorOrder>(url, order);
    }

    updateOrder(order: VendorOrder): Observable<VendorOrder> {
        const url = this.serverUrl + 'api/v1/orders/' + order.id;
        return this.http.put<VendorOrder>(url, order);
    }

    updateOrders(ids: string[], status: string, assignee_id?: string): Observable<string[]> {
        const url = this.serverUrl + 'api/v1/orders';
        const body = {
            ids: ids,
            status: status,
            assignee_id: assignee_id.length > 0 ? assignee_id : ''
        };
        return this.http.put<string[]>(url, body);
    }    

    deleteOrder(id: string): Observable<VendorOrder> {
        const url = this.serverUrl + 'api/v1/orders/' + id;
        return this.http.delete<VendorOrder>(url);
    }

    printPdf(id: string, version: string): Observable<Blob> {
        const url = this.serverUrl + 'api/v1/orders/' + id + '/print' + (version === '1' ? '' : ('?version=' + version));
        return this.http.get(url, { responseType: 'blob' });
    }

    uploadAttachments(order: VendorOrder): Observable<VendorOrder> {
        const url = this.serverUrl + 'api/v1/orders/' + order.id + '/attachments';
        return this.http.put<VendorOrder>(url, order);
    }

    downloadAttachment(blobId: string) {
        const url = this.serverUrl + 'api/v1/orders/attachments/' + blobId;
        return this.http.get(url, { responseType: 'blob' });
    }

    printExcelSummary(status: string): Observable<Blob> {
        const url = this.serverUrl + 'api/v1/orders/print/summary' + (status == null ? '' : ('?filter=status=' + status));
        
        return this.http.get(url, { responseType: 'blob' });
    }
}
