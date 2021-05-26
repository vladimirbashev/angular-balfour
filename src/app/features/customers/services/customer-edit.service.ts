import { BehaviorSubject, Observable } from 'rxjs';

import { EventEmitter, Injectable } from '@angular/core';

import { Customer } from '../../../common/models/Customer';

@Injectable()
export class CustomerEditService {
    private _changed$ = new BehaviorSubject<boolean>(false);
    private _valid$ = new BehaviorSubject<boolean>(false);
    private _index$ = new BehaviorSubject<number>(0);
    private _value$ = new BehaviorSubject<Customer>(null);
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
    public get value$(): Observable<Customer> {
        return this._value$.asObservable();
    }
    public get value(): Customer {
        return this._value$.value;
    }
    public set value(val: Customer) {
        this._value$.next(val);
    }

    public get index$(): Observable<number> {
        return this._index$.asObservable();
    }
    public get index(): number {
        return this._index$.value;
    }
    public set index(val: number) {
        this._index$.next(val);
    }
}
