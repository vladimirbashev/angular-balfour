import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DataPage, Filter, Organization } from '../../../common/models/index';
import { AppSettingsService } from '../../../common/services/appsettings.service';

@Injectable()
export class OrganizationsDataService {

    constructor(
        private ass: AppSettingsService,
        private http: HttpClient,
    ) { }

    public get serverUrl(): string {
        return this.ass.getProperty('session.serverUrl');
    }

    public get schoolFinderUrl(): string {
        return this.ass.getProperty('session.schoolFinderUrl');
    }

    public get take(): number {
        return this.ass.getProperty(['services', 'organizations.data', 'defaults', 'take'], 10);
    }

    readOrganizations(skip: number = 0, take?: number, filter?: Filter, params?: any): Observable<DataPage<Organization>> {
        const url = this.serverUrl + 'api/v1/organizations?sort=name=true';
        let request: any = { skip, take: take ?? this.take };
        if (params) {
            request = Object.assign(request, params);
        }
        if (filter) {
            request.filter = filter.toString(false);
        }
        return this.http.get<DataPage<Organization>>(url, { params: request });
    }

    readOrganization(id: string): Observable<Organization> {
        const url = this.serverUrl + 'api/v1/organizations/' + id;
        return this.http.get<Organization>(url);
    }

    createOrganization(organization: Organization): Observable<Organization> {
        const url = this.serverUrl + 'api/v1/organizations';
        return this.http.post<Organization>(url, organization);
    }

    updateOrganization(id: string, organization: Organization): Observable<Organization> {
        const url = this.serverUrl + 'api/v1/organizations' + '/' + id;
        return this.http.put<Organization>(url, organization);
    }

    deleteOrganization(id: string): Observable<Organization> {
        const url = this.serverUrl + 'api/v1/organizations/' + id;
        return this.http.delete<Organization>(url);
    }

    searchSchools(name: string): Observable<any> {
        const url = this.schoolFinderUrl + 'api/v2/balfour/schoolfinder/' + name;
        return this.http.get<any>(url);
    }
}
