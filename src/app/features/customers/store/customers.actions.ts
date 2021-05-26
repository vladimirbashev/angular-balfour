import { Action } from '@ngrx/store';

import { Customer, EntityState, Filter } from '../../../common/models/index';

export enum CustomersActionType {
    CustomersRead = '[Customers] Read',
    CustomersReadSuccess = '[Customers] Read success',
    CustomersReadFailure = '[Customers] Read failure',
    CustomersCreateInit = '[Customers] Create init',
    CustomersCreateSuccess = '[Customers] Create success',
    CustomersCreateFailure = '[Customers] Create failure',
    CustomersUpdateInit = '[Customers] Update init',
    CustomersUpdateSuccess = '[Customers] Update success',
    CustomersUpdateFailure = '[Customers] Update failure',
    CustomersDeleteInit = '[Customers] Delete init',
    CustomersDeleteSuccess = '[Customers] Delete success',
    CustomersDeleteFailure = '[Customers] Delete failure',
    CustomersSelectId = '[Customers] Select id',
    CustomersSelect = '[Customers] Select',
    CustomersSetState = '[Customers] Set state'
}

export class CustomersReadAction implements Action {
    readonly type = CustomersActionType.CustomersRead;
    constructor(public payload?: { filter?: Filter, skip?: number, take?: number }) { }
}

export class CustomersReadSuccessAction implements Action {
    readonly type = CustomersActionType.CustomersReadSuccess;
    constructor(public payload: { customers: Customer[], insert?: boolean, isComplete?: boolean }) { }
}

export class CustomersReadFailureAction implements Action {
    readonly type = CustomersActionType.CustomersReadFailure;
    constructor(public payload: { error: Error }) { }
}

export class CustomersCreateInitAction implements Action {
    public readonly type = CustomersActionType.CustomersCreateInit;
    constructor(public payload: { customer: Customer }) { }
}
export class CustomersCreateSuccessAction implements Action {
    public readonly type = CustomersActionType.CustomersCreateSuccess;
    constructor(public payload: { customer: Customer }) { }
}
export class CustomersCreateFailureAction implements Action {
    public readonly type = CustomersActionType.CustomersCreateFailure;
    constructor(public payload: { error: Error }) { }
}
export class CustomersUpdateInitAction implements Action {
    public readonly type = CustomersActionType.CustomersUpdateInit;
    constructor(public payload: { id: string, customer: Customer }) { }
}
export class CustomersUpdateSuccessAction implements Action {
    public readonly type = CustomersActionType.CustomersUpdateSuccess;
    constructor(public payload: { id: string, customer: Customer }) { }
}
export class CustomersUpdateFailureAction implements Action {
    public readonly type = CustomersActionType.CustomersUpdateFailure;
    constructor(public payload: { error: Error }) { }
}
export class CustomersDeleteInitAction implements Action {
    public readonly type = CustomersActionType.CustomersDeleteInit;
    constructor(public payload: { id: string }) { }
}
export class CustomersDeleteSuccessAction implements Action {
    public readonly type = CustomersActionType.CustomersDeleteSuccess;
    constructor(public payload: { id: string }) { }
}
export class CustomersDeleteFailureAction implements Action {
    public readonly type = CustomersActionType.CustomersDeleteFailure;
    constructor(public payload: { error: Error }) { }
}
export class CustomersSelectIdAction implements Action {
    public readonly type = CustomersActionType.CustomersSelectId;
    constructor(public payload: { id: string }) { }
}

export class CustomersSelectAction implements Action {
    public readonly type = CustomersActionType.CustomersSelect;
    constructor(public payload: { idx: number }) { }
}

export class CustomersSetStateAction implements Action {
    public readonly type = CustomersActionType.CustomersSetState;
    constructor(public payload: { state: EntityState }) { }
}

export type CustomersActionUnion =
    | CustomersReadAction
    | CustomersReadSuccessAction
    | CustomersReadFailureAction
    | CustomersCreateInitAction
    | CustomersCreateSuccessAction
    | CustomersCreateFailureAction
    | CustomersUpdateInitAction
    | CustomersUpdateSuccessAction
    | CustomersUpdateFailureAction
    | CustomersDeleteInitAction
    | CustomersDeleteSuccessAction
    | CustomersDeleteFailureAction
    | CustomersSelectIdAction
    | CustomersSelectAction
    | CustomersSetStateAction;
