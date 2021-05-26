import { Action } from '@ngrx/store';

import { EntityState, Filter, Organization } from '../../../common/models/index';

export enum OrganizationsActionType {
    OrganizationsRead = '[Organizations] Read',
    OrganizationsReadSuccess = '[Organizations] Read success',
    OrganizationsReadFailure = '[Organizations] Read failure',
    OrganizationsCreateInit = '[Organizations] Create init',
    OrganizationsCreateSuccess = '[Organizations] Create success',
    OrganizationsCreateFailure = '[Organizations] Create failure',
    OrganizationsUpdateInit = '[Organizations] Update init',
    OrganizationsUpdateSuccess = '[Organizations] Update success',
    OrganizationsUpdateFailure = '[Organizations] Update failure',
    OrganizationsDeleteInit = '[Organizations] Delete init',
    OrganizationsDeleteSuccess = '[Organizations] Delete success',
    OrganizationsDeleteFailure = '[Organizations] Delete failure',
    OrganizationsSelectId = '[Organizations] Select id',
    OrganizationsSelect = '[Organizations] Select',
    OrganizationsSetState = '[Organizations] Set state'
}

export class OrganizationsReadAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsRead;
    constructor(public payload?: { filter?: Filter, skip?: number, take?: number, params: any }) { }
}

export class OrganizationsReadSuccessAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsReadSuccess;
    constructor(public payload: { organizations: Organization[], insert?: boolean, isComplete?: boolean }) { }
}

export class OrganizationsReadFailureAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsReadFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrganizationsCreateInitAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsCreateInit;
    constructor(public payload: { organization: Organization }) { }
}

export class OrganizationsCreateSuccessAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsCreateSuccess;
    constructor(public payload: { organization: Organization }) { }
}

export class OrganizationsCreateFailureAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsCreateFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrganizationsUpdateInitAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsUpdateInit;
    constructor(public payload: { id: string, organization: Organization }) { }
}

export class OrganizationsUpdateSuccessAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsUpdateSuccess;
    constructor(public payload: { id: string, organization: Organization }) { }
}

export class OrganizationsUpdateFailureAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsUpdateFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrganizationsDeleteInitAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsDeleteInit;
    constructor(public payload: { id: string }) { }
}

export class OrganizationsDeleteSuccessAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsDeleteSuccess;
    constructor(public payload: { id: string }) { }
}

export class OrganizationsDeleteFailureAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsDeleteFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrganizationsSelectIdAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsSelectId;
    constructor(public payload: { id: string }) { }
}

export class OrganizationsSelectAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsSelect;
    constructor(public payload: { idx: number }) { }
}

export class OrganizationsSetStateAction implements Action {
    public readonly type = OrganizationsActionType.OrganizationsSetState;
    constructor(public payload: { state: EntityState }) { }
}

export type OrganizationsActionUnion =
    | OrganizationsReadAction
    | OrganizationsReadSuccessAction
    | OrganizationsReadFailureAction
    | OrganizationsCreateInitAction
    | OrganizationsCreateSuccessAction
    | OrganizationsCreateFailureAction
    | OrganizationsUpdateInitAction
    | OrganizationsUpdateSuccessAction
    | OrganizationsUpdateFailureAction
    | OrganizationsDeleteInitAction
    | OrganizationsDeleteSuccessAction
    | OrganizationsDeleteFailureAction
    | OrganizationsSelectIdAction
    | OrganizationsSelectAction
    | OrganizationsSetStateAction;
