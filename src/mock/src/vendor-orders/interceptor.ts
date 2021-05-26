import clamp from 'lodash-es/clamp';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

import {
    HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
// tslint:disable:no-string-literal
import { Injectable } from '@angular/core';

import { Filter } from '../../../app/common/models/Filter';
import { vendorOrdersStorage } from './storage';

@Injectable()
export class MockVendorOrdersInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                if (request.url.match(/\api\/v1\/orders\/?$/)) {
                    switch (request.method) {
                        case 'GET': {
                            let items = vendorOrdersStorage.items;
                            let count = items && items.length || 0;
                            if (request.params.has('filter')) {
                                const filter = new Filter(request.params.get('filter'));
                                if (filter) {
                                    if (filter.hasOwnProperty('exclude_ids')) {
                                        const excid: string[] = typeof filter.exclude_ids === 'number'
                                            ? [filter.exclude_ids.toString(10).padStart(32, '0')] : filter.exclude_ids;
                                        items = items.filter(it => !excid.includes(it.id));
                                    }
                                    if (filter.hasOwnProperty('ids')) {
                                        const ids: string[] = typeof filter.ids === 'number'
                                            ? [filter.ids.toString(10).padStart(32, '0')] : filter.ids;
                                        items = items.filter(it => ids.includes(it.id));
                                    }
                                    count = items && items.length || 0;
                                }
                            }
                            if (request.params.has('skip')) {
                                items = items.slice(parseInt(request.params.get('skip'), 10));
                            }
                            const take = request.params.has('take') ? clamp(parseInt(request.params.get('take'), 10), 0, 30) : 30;
                            items = items.slice(0, take);
                            return of(new HttpResponse({
                                status: 200,
                                body: {
                                    total: count,
                                    data: items
                                }
                            }));
                        }
                        case 'POST': {
                            const id = vendorOrdersStorage.createItem(request.body);
                            const vendor = vendorOrdersStorage.findByField('id', id);
                            if (vendor) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: vendor
                                }));
                            } else {
                                return throwError({
                                    code: 'VENDOR_ORDER_CREATE_FAILURE',
                                    status: 400,
                                    name: 'VENDOR_ORDER_CREATE_FAILURE',
                                    message: 'Vendor order create failure',
                                });
                            }
                        }
                    }
                }
                const matches = request.url.match(/\api\/v1\/orders\/(.*)\/?$/);
                if (matches) {
                    switch (request.method) {
                        case 'PUT': {
                            vendorOrdersStorage.updateItemByField('id', matches[1], request.body);
                            const vendor = vendorOrdersStorage.findByField('id', matches[1]);
                            if (vendor) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: vendor
                                }));
                            }
                            break;
                        }
                        case 'DELETE': {
                            const vendor = vendorOrdersStorage.findByField('id', matches[1]);
                            const result = vendorOrdersStorage.deleteItemByField('id', matches[1]);
                            if (result) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: vendor
                                }));
                            } else if (vendor) {
                                return throwError({
                                    code: 'VENDOR_ORDER_DELETE_FAILED',
                                    status: 400,
                                    name: 'VENDOR_ORDER_DELETE_FAILED',
                                    message: 'Vendor order delete was failed',
                                });
                            }
                            break;
                        }
                    }
                    return throwError({
                        code: 'VENDOR_ORDER_NOT_FOUND',
                        status: 400,
                        name: 'VENDOR_ORDER_NOT_FOUND',
                        message: 'Vendor order not found',
                    });
                }

                return next.handle(request);
            }),
            materialize(),
            delay(500),
            dematerialize()
        );
    }
}

export let mockVendorOrdersProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockVendorOrdersInterceptor,
    multi: true
};
