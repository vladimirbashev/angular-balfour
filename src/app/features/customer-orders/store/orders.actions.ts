import { Action } from '@ngrx/store';

import { CustomerOrder, CustomerOrderDetails, Filter } from './../../../common/models/index';

export enum CustomerOrdersActionType {
    OrdersRead = '[Customer orders] Read',
    OrdersReadSuccess = '[Customer orders] Read success',
    OrdersReadFailure = '[Customer orders] Read failure',
    OrdersSelect = '[Customer orders] Select',
    OrderReadOne = '[Customer orders] Read One With Details',
    OrderReadOneSuccess = '[Customer orders] Read One With Details success',
    OrderReadOneFailure = '[Customer orders] Read One With Details failure',
    OrderCreate = '[Customer orders] Create',
    OrderCreateSuccess = '[Customer orders] Create success',
    OrderCreateFailure = '[Customer orders] Create failure',
    OrderUpdate = '[Customer orders] Update',
    OrderUpdateSuccess = '[Customer orders] Update success',
    OrderUpdateFailure = '[Customer orders] Update failure',
    OrderDelete = '[Customer orders] Delete',
    OrderDeleteSuccess = '[Customer orders] Delete success',
    OrderDeleteFailure = '[Customer orders] Delete failure',
    OrdersPrintPdf = '[Customer orders] Print pdf',
    OrdersPrintPdfSuccess = '[Customer orders] Print pdf success',
    OrdersPrintPdfFailure = '[Customer orders] Print pdf failure',
}

export class CustomerOrdersReadAction implements Action {
    readonly type = CustomerOrdersActionType.OrdersRead;
    constructor(public payload?: { filter?: Filter, skip?: number, take?: number, ids?: string[] }) { }
}

export class CustomerOrdersReadSuccessAction implements Action {
    readonly type = CustomerOrdersActionType.OrdersReadSuccess;
    constructor(public payload: { orders: CustomerOrder[], insert?: boolean, isComplete?: boolean, apart?: boolean }) { }
}

export class CustomerOrdersReadFailureAction implements Action {
    readonly type = CustomerOrdersActionType.OrdersReadFailure;
    constructor(public payload: { error: Error }) { }
}

export class CustomerOrdersSelectAction implements Action {
    readonly type = CustomerOrdersActionType.OrdersSelect;
    constructor(public payload: { id: string }) { }
}

export class CustomerOrderReadOneAction implements Action {
    readonly type = CustomerOrdersActionType.OrderReadOne;
    constructor(public payload?: { id: string }) { }
}

export class CustomerOrderReadOneSuccessAction implements Action {
    readonly type = CustomerOrdersActionType.OrderReadOneSuccess;
    constructor(public payload: { orderDetails: CustomerOrderDetails }) { }
}

export class CustomerOrderReadOneFailureAction implements Action {
    readonly type = CustomerOrdersActionType.OrderReadOneFailure;
    constructor(public payload: { error: Error }) { }
}

export class CustomerOrdersCreateAction implements Action {
    readonly type = CustomerOrdersActionType.OrderCreate;
    constructor(public payload: { order: CustomerOrder, vendorOrderId?: string, preventNavigation?: boolean }) { }
}

export class CustomerOrdersCreateSuccessAction implements Action {
    readonly type = CustomerOrdersActionType.OrderCreateSuccess;
    constructor(public payload: { order: CustomerOrder, vendorOrderId?: string, preventNavigation?: boolean }) { }
}

export class CustomerOrdersCreateFailureAction implements Action {
    readonly type = CustomerOrdersActionType.OrderCreateFailure;
    constructor(public payload: { error: any }) { }
}

export class CustomerOrdersUpdateAction implements Action {
    readonly type = CustomerOrdersActionType.OrderUpdate;
    constructor(public payload: { order: CustomerOrder, vendorOrderId?: string, preventNavigation?: boolean }) { }
}

export class CustomerOrdersUpdateSuccessAction implements Action {
    readonly type = CustomerOrdersActionType.OrderUpdateSuccess;
    constructor(public payload: { order: CustomerOrder, vendorOrderId?: string, preventNavigation?: boolean }) { }
}

export class CustomerOrdersUpdateFailureAction implements Action {
    readonly type = CustomerOrdersActionType.OrderUpdateFailure;
    constructor(public payload: { error: any }) { }
}

export class CustomerOrdersDeleteAction implements Action {
    readonly type = CustomerOrdersActionType.OrderDelete;
    constructor(public payload: { id: string, preventNavigation?: boolean }) { }
}

export class CustomerOrdersDeleteSuccessAction implements Action {
    readonly type = CustomerOrdersActionType.OrderDeleteSuccess;
    constructor(public payload: { id: string, preventNavigation?: boolean }) { }
}

export class CustomerOrdersDeleteFailureAction implements Action {
    readonly type = CustomerOrdersActionType.OrderDeleteFailure;
    constructor(public payload: { error: any }) { }
}

export class CustomerOrdersPrintPdfAction implements Action {
    readonly type = CustomerOrdersActionType.OrdersPrintPdf;
    constructor(public payload?: { id: string, version: string, preventNavigation?: boolean }) { }
}

export class CustomerOrdersPrintPdfSuccessAction implements Action {
    readonly type = CustomerOrdersActionType.OrdersPrintPdfSuccess;
    constructor(public payload: { blob: Blob, preventNavigation?: boolean }) { }
}

export class CustomerOrdersPrintPdfFailureAction implements Action {
    readonly type = CustomerOrdersActionType.OrdersPrintPdfFailure;
    constructor(public payload: { error: Error }) { }
}


export type CustomerOrdersActionUnion =
    | CustomerOrdersReadAction
    | CustomerOrdersReadSuccessAction
    | CustomerOrdersReadFailureAction
    | CustomerOrdersSelectAction
    | CustomerOrderReadOneAction
    | CustomerOrderReadOneSuccessAction
    | CustomerOrderReadOneFailureAction
    | CustomerOrdersCreateAction
    | CustomerOrdersCreateSuccessAction
    | CustomerOrdersCreateFailureAction
    | CustomerOrdersUpdateAction
    | CustomerOrdersUpdateSuccessAction
    | CustomerOrdersUpdateFailureAction
    | CustomerOrdersDeleteAction
    | CustomerOrdersDeleteSuccessAction
    | CustomerOrdersDeleteFailureAction
    | CustomerOrdersPrintPdfAction
    | CustomerOrdersPrintPdfSuccessAction
    | CustomerOrdersPrintPdfFailureAction;
