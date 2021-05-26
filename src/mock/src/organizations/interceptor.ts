import clamp from 'lodash-es/clamp';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

import {
    HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
// tslint:disable:no-string-literal
import { Injectable } from '@angular/core';

import { Filter } from '../../../app/common/models/Filter';
import { organizationsStorage } from './storage';

@Injectable()
export class MockOrganizationsInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                if (request.url.match(/\api\/v1\/organizations\/?$/)) {
                    switch (request.method) {
                        case 'GET': {
                            let items = organizationsStorage.items;
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
                                    if (filter.hasOwnProperty('name')) {
                                        const rx = new RegExp(filter.name, 'i');
                                        items = items.filter(it => rx.test(it.name));
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
                            const id = organizationsStorage.createItem(request.body);
                            const organization = organizationsStorage.findByField('id', id);
                            if (organization) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: organization
                                }));
                            } else {
                                return throwError({
                                    code: 'ORGANIZATION_CREATE_FAILURE',
                                    status: 400,
                                    name: 'ORGANIZATION_CREATE_FAILURE',
                                    message: 'Organization create failure',
                                });
                            }
                        }
                    }
                }
                const matches = request.url.match(/\api\/v1\/organizations\/(.*)\/?$/);
                if (matches) {
                    switch (request.method) {
                        case 'PUT': {
                            organizationsStorage.updateItemByField('id', matches[1], request.body);
                            const organization = organizationsStorage.findByField('id', matches[1]);
                            if (organization) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: organization
                                }));
                            }
                            break;
                        }
                        case 'DELETE': {
                            const organization = organizationsStorage.findByField('id', matches[1]);
                            const result = organizationsStorage.deleteItemByField('id', matches[1]);
                            if (result) {
                                return of(new HttpResponse({
                                    status: 200,
                                    body: organization
                                }));
                            } else if (organization) {
                                return throwError({
                                    code: 'ORGANIZATION_DELETE_FAILED',
                                    status: 400,
                                    name: 'ORGANIZATION_DELETE_FAILED',
                                    message: 'Organization delete was failed',
                                });
                            }
                            break;
                        }
                    }
                    return throwError({
                        code: 'ORGANIZATION_NOT_FOUND',
                        status: 400,
                        name: 'ORGANIZATION_NOT_FOUND',
                        message: 'Organization not found',
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

export let mockOrganizationsProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockOrganizationsInterceptor,
    multi: true
};
