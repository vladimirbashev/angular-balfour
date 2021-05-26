import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserPreference, UserProfile } from '../../../common/models';
import { AppSettingsService } from '../../../common/services/appsettings.service';

@Injectable()
export class SessionDataService {

    constructor(
        private ass: AppSettingsService,
        private http: HttpClient,
    ) { }

    public get serverUrl(): string {
        return this.ass.getProperty('session.serverUrl');
    }

    readUserProfile(id: string): Observable<UserProfile> {
        const url = `${this.serverUrl}api/v1/user_profiles/${id}`;
        return this.http.get<UserProfile>(url);
    }

    readUserPreference(id: string): Observable<UserPreference> {
        const url = `${this.serverUrl}api/v1/user_preferences/${id}`;
        return this.http.get<UserPreference>(url);
    }

    getGroupUsersByGroupName(group_name: string): Observable<UserProfile[]> {
        const url = `${this.serverUrl}api/v1/group_by_name/${group_name}/users`;
        return this.http.get<UserProfile[]>(url);
    } 

    updateUserProfile(id: string, profile: UserProfile): Observable<UserProfile> {
        const url = `${this.serverUrl}api/v1/user_profiles/${id}`;
        return this.http.put<UserProfile>(url, profile);
    }

    updateUserPreference(id: string, preference: UserPreference): Observable<UserPreference> {
        const url = `${this.serverUrl}api/v1/user_preferences/${id}`;
        return this.http.put<UserPreference>(url, preference);
    }
}
