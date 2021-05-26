import { BehaviorSubject, Observable } from 'rxjs';

import { EventEmitter, Injectable } from '@angular/core';

import { UserPreference, UserProfile } from '../../../common';

@Injectable()
export class SessionEditService {

    private _profileChanged$ = new BehaviorSubject<boolean>(false);
    private _profileValid$ = new BehaviorSubject<boolean>(false);
    private _profileValue$ = new BehaviorSubject<UserProfile>(null);

    private _preferenceChanged$ = new BehaviorSubject<boolean>(false);
    private _preferenceValid$ = new BehaviorSubject<boolean>(false);
    private _preferenceValue$ = new BehaviorSubject<UserPreference>(null);

    public reset = new EventEmitter();
    public resetSearch = new EventEmitter();

    public get profileChanged$(): Observable<boolean> {
        return this._profileChanged$.asObservable();
    }

    public get profileChanged(): boolean {
        return this._profileChanged$.value;
    }

    public get preferenceChanged$(): Observable<boolean> {
        return this._preferenceChanged$.asObservable();
    }

    public get preferenceChanged(): boolean {
        return this._preferenceChanged$.value;
    }

    public set profileChanged(val: boolean) {
        this._profileChanged$.next(val);
    }

    public set preferenceChanged(val: boolean) {
        this._preferenceChanged$.next(val);
    }

    public get profileValid$(): Observable<boolean> {
        return this._profileValid$.asObservable();
    }

    public get profileValid(): boolean {
        return this._profileValid$.value;
    }

    public set profileValid(val: boolean) {
        this._profileValid$.next(val);
    }

    public get preferceValid$(): Observable<boolean> {
        return this._preferenceValid$.asObservable();
    }

    public get preferceValid(): boolean {
        return this._preferenceValid$.value;
    }

    public set preferceValid(val: boolean) {
        this._preferenceValid$.next(val);
    }

    public get profileValue$(): Observable<UserProfile> {
        return this._profileValue$.asObservable();
    }

    public get profileValue(): UserProfile {
        return this._profileValue$.value;
    }

    public set profileValue(val: UserProfile) {
        this._profileValue$.next(val);
    }

    public get preferenceValue$(): Observable<UserPreference> {
        return this._preferenceValue$.asObservable();
    }

    public get preferenceValue(): UserPreference {
        return this._preferenceValue$.value;
    }

    public set preferenceValue(val: UserPreference) {
        this._preferenceValue$.next(val);
    }
}
