import { BehaviorSubject, Observable } from 'rxjs';

import { EventEmitter, Injectable } from '@angular/core';

import { Organization } from '../../../common/models/Organization';

@Injectable()
export class OrganizationEditService {

    private _changed$ = new BehaviorSubject<boolean>(false);
    private _valid$ = new BehaviorSubject<boolean>(false);
    private _value$ = new BehaviorSubject<Organization>(null);

    public reset = new EventEmitter();
    public resetSearch = new EventEmitter();

    public get changed$(): Observable<boolean> {
        return this._changed$.asObservable();
    }

    public get changed(): boolean {
        return this._changed$.value;
    }

    public set changed(val: boolean) {
        this._changed$.next(val);
    }

    public get valid$(): Observable<boolean> {
        return this._valid$.asObservable();
    }

    public get valid(): boolean {
        return this._valid$.value;
    }

    public set valid(val: boolean) {
        this._valid$.next(val);
    }

    public get value$(): Observable<Organization> {
        return this._value$.asObservable();
    }

    public get value(): Organization {
        return this._value$.value;
    }

    public set value(val: Organization) {
        this._value$.next(val);
    }
}
