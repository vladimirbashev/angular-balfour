import clamp from 'lodash-es/clamp';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

import {
    HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
// tslint:disable:no-string-literal
import { Injectable } from '@angular/core';

import { Filter } from '../../../app/common/models/Filter';
import { customersStorage } from '../customers/storage';
import { customerOrdersStorage } from './storage';

@Injectable()
export class MockCustomerOrdersInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                if (request.url.match(/\api\/v1\/customer_orders\/?$/)) {
                    console.log('GET customer_orders', request.url);
                    switch (request.method) {
                        case 'GET': {
                            console.log('Get Order list 0');
                            let items = customerOrdersStorage.items;
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
                            console.log('Get Order list3');
                            const take = request.params.has('take') ? clamp(parseInt(request.params.get('take'), 10), 0, 30) : 30;
                            items = items.slice(0, take);
                            console.log('items', {
                                total: count,
                                data: items
                            });
                            return of(new HttpResponse({
                                status: 200,
                                body: {
                                    total: count,
                                    data: items
                                }
                            }));
                        }
                        case 'POST': {
                            const id = customerOrdersStorage.createItem(request.body);
                            const customer = customerOrdersStorage.findByField('id', id);
                            if (customer) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: customer
                                }));
                            } else {
                                return throwError({
                                    code: 'CUSTOMER_ORDER_CREATE_FAILURE',
                                    status: 400,
                                    name: 'CUSTOMER_ORDER_CREATE_FAILURE',
                                    message: 'Customer order create failure',
                                });
                            }
                        }
                    }
                }
                const matches = request.url.match(/\api\/v1\/customer_orders\/(.*)\/?$/);
                if (matches) {
                    switch (request.method) {
                        case 'GET': {
                            if (matches && matches[1]) {
                                console.log('Get order details');
                                const id = matches[1];
                                const order = customerOrdersStorage.findByField('id', matches[1]);
                                if (!order) {
                                    return of(new HttpResponse({
                                        status: 204,
                                        body: null
                                    }));
                                    break;
                                }
                                const customer = customersStorage.findByField('id', order.customer_id);
                                const product = {
                                    id: '1',
                                    question_groups: [],
                                    questions: [],
                                    options: [],
                                    type: ''
                                }; // productsStorage.findByField('id', customerOrder.product_id);
                                return of(new HttpResponse({
                                    status: 200,
                                    body: {
                                        order,
                                        customer,
                                        product
                                    }
                                }));
                            }
                            break;
                        }
                        case 'PUT': {
                            customerOrdersStorage.updateItemByField('id', matches[1], request.body);
                            const customer = customerOrdersStorage.findByField('id', matches[1]);
                            if (customer) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: customer
                                }));
                            }
                            break;
                        }
                        case 'DELETE': {
                            const customer = customerOrdersStorage.findByField('id', matches[1]);
                            const result = customerOrdersStorage.deleteItemByField('id', matches[1]);
                            if (result) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: customer
                                }));
                            } else if (customer) {
                                return throwError({
                                    code: 'CUSTOMER_ORDER_DELETE_FAILED',
                                    status: 400,
                                    name: 'CUSTOMER_ORDER_DELETE_FAILED',
                                    message: 'Customer order delete was failed',
                                });
                            }
                            break;
                        }
                    }
                    return throwError({
                        code: 'CUSTOMER_ORDER_NOT_FOUND',
                        status: 400,
                        name: 'CUSTOMER_ORDER_NOT_FOUND',
                        message: 'Customer order not found',
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

export let mockCustomerOrdersProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockCustomerOrdersInterceptor,
    multi: true
};
