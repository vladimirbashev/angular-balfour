import { Action } from '@ngrx/store';
import { VendorOrder, VendorOrderStatistics, Filter } from './../../../common/models/index';

export enum OrdersActionType {
    OrdersRead = '[VendorOrders] Read',
    OrdersReadSuccess = '[VendorOrders] Read success',
    OrdersReadFailure = '[VendorOrders] Read failure',
    OrdersCreate = '[VendorOrders] Create',
    OrdersCreateSuccess = '[VendorOrders] Create success',
    OrdersCreateFailure = '[VendorOrders] Create failure',
    OrdersUpdate = '[VendorOrders] Update',
    OrdersUpdateSuccess = '[VendorOrders] Update success',
    OrdersUpdateFailure = '[VendorOrders] Update failure',
    OrdersUpdateBatch = '[VendorOrders] Update batch',
    OrdersUpdateBatchSuccess = '[VendorOrders] Update batch success',
    OrdersUpdateBatchFailure = '[VendorOrders] Update batch failure',    
    OrdersDelete = '[VendorOrders] Delete',
    OrdersDeleteSuccess = '[VendorOrders] Delete success',
    OrdersDeleteFailure = '[VendorOrders] Delete failure',
    OrdersSelect = '[VendorOrders] Select',
    OrdersReadStatistics = '[VendorOrders] Read statistics',
    OrdersReadStatisticsSuccess = '[VendorOrders] Read statistics success',
    OrdersReadStatisticsFailure = '[VendorOrders] Read statistics failure',
    OrdersPrintPdf = '[VendorOrders] Print pdf',
    OrdersPrintPdfSuccess = '[VendorOrders] Print pdf success',
    OrdersPrintPdfFailure = '[VendorOrders] Print pdf failure',
    OrdersPrintExcelSummary = '[VendorOrders] Print excel summary',
    OrdersPrintExcelSummarySuccess = '[VendorOrders] Print excel summary success',
    OrdersPrintExcelSummaryFailure = '[VendorOrders] Print excel summary failure',    
    OrdersUploadAttachments = '[VendorOrders] Upload attachments',
    OrdersUploadAttachmentsSuccess = '[VendorOrders] Upload attachments success',
    OrdersUploadAttachmentsFailure = '[VendorOrders] Upload attachments failure',
    OrdersDownloadAttachment = '[VendorOrders] Download attachments',
    OrdersDownloadAttachmentSuccess = '[VendorOrders] Download attachments success',
    OrdersDownloadAttachmentFailure = '[VendorOrders] Download attachments failure'
}

export class OrdersReadAction implements Action {
    readonly type = OrdersActionType.OrdersRead;
    constructor(public payload?: { filter?: Filter, skip?: number, take?: number, ids?: string[] }) { }
}

export class OrdersReadSuccessAction implements Action {
    readonly type = OrdersActionType.OrdersReadSuccess;
    constructor(public payload: { orders: VendorOrder[], insert?: boolean, isComplete?: boolean, apart?: boolean }) { }
}

export class OrdersReadFailureAction implements Action {
    readonly type = OrdersActionType.OrdersReadFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrdersCreateAction implements Action {
    readonly type = OrdersActionType.OrdersCreate;
    constructor(public payload?: { order: VendorOrder, preventNavigation?: boolean }) { }
}

export class OrdersCreateSuccessAction implements Action {
    readonly type = OrdersActionType.OrdersCreateSuccess;
    constructor(public payload: { order: VendorOrder, preventNavigation?: boolean }) { }
}

export class OrdersCreateFailureAction implements Action {
    readonly type = OrdersActionType.OrdersCreateFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrdersUpdateAction implements Action {
    readonly type = OrdersActionType.OrdersUpdate;
    constructor(public payload?: { order: VendorOrder, preventNavigation?: boolean }) { }
}

export class OrdersUpdateSuccessAction implements Action {
    readonly type = OrdersActionType.OrdersUpdateSuccess;
    constructor(public payload: { order: VendorOrder, preventNavigation?: boolean }) { }
}

export class OrdersUpdateFailureAction implements Action {
    readonly type = OrdersActionType.OrdersUpdateFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrdersUpdateBatchAction implements Action {
    readonly type = OrdersActionType.OrdersUpdateBatch;
    constructor(public payload?: { ids: string[], status: string, assignee_id?: string, preventNavigation?: boolean }) { }
}

export class OrdersUpdateBatchSuccessAction implements Action {
    readonly type = OrdersActionType.OrdersUpdateBatchSuccess;
    constructor(public payload: { ids: string[], preventNavigation?: boolean }) { }
}

export class OrdersUpdateBatchFailureAction implements Action {
    readonly type = OrdersActionType.OrdersUpdateBatchFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrdersDeleteAction implements Action {
    readonly type = OrdersActionType.OrdersDelete;
    constructor(public payload?: { id: string, preventNavigation?: boolean }) { }
}

export class OrdersDeleteSuccessAction implements Action {
    readonly type = OrdersActionType.OrdersDeleteSuccess;
    constructor(public payload: { id: string, preventNavigation?: boolean }) { }
}

export class OrdersDeleteFailureAction implements Action {
    readonly type = OrdersActionType.OrdersDeleteFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrdersSelectAction implements Action {
    readonly type = OrdersActionType.OrdersSelect;
    constructor(public payload: { id: string }) { }
}

export class OrdersReadStatisticsAction implements Action {
    readonly type = OrdersActionType.OrdersReadStatistics;
}

export class OrdersReadStatisticsSuccessAction implements Action {
    readonly type = OrdersActionType.OrdersReadStatisticsSuccess;
    constructor(public payload: { statistics: VendorOrderStatistics }) { }
}

export class OrdersReadStatisticsFailureAction implements Action {
    readonly type = OrdersActionType.OrdersReadStatisticsFailure;
    constructor(public payload: { error: any }) { }
}

export class OrdersPrintPdfAction implements Action {
    readonly type = OrdersActionType.OrdersPrintPdf;
    constructor(public payload?: { id: string, version: string, preventNavigation?: boolean }) { }
}

export class OrdersPrintPdfSuccessAction implements Action {
    readonly type = OrdersActionType.OrdersPrintPdfSuccess;
    constructor(public payload: { blob: Blob, preventNavigation?: boolean }) { }
}

export class OrdersPrintPdfFailureAction implements Action {
    readonly type = OrdersActionType.OrdersPrintPdfFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrdersPrintExcelSummaryAction implements Action {
    readonly type = OrdersActionType.OrdersPrintExcelSummary;
    constructor(public payload?: { status: string, preventNavigation?: boolean }) { }
}

export class OrdersPrintExcelSummarySuccessAction implements Action {
    readonly type = OrdersActionType.OrdersPrintExcelSummarySuccess;
    constructor(public payload: { blob: Blob, preventNavigation?: boolean }) { }
}

export class OrdersPrintExcelSummaryFailureAction implements Action {
    readonly type = OrdersActionType.OrdersPrintExcelSummaryFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrdersUploadAttachmentsAction implements Action {
    readonly type = OrdersActionType.OrdersUploadAttachments;
    constructor(public payload?: { order: VendorOrder, preventNavigation?: boolean }) { }
}

export class OrdersUploadAttachmentsSuccessAction implements Action {
    readonly type = OrdersActionType.OrdersUploadAttachmentsSuccess;
    constructor(public payload: { order: VendorOrder, preventNavigation?: boolean }) { }
}

export class OrdersUploadAttachmentsFailureAction implements Action {
    readonly type = OrdersActionType.OrdersUploadAttachmentsFailure;
    constructor(public payload: { error: Error }) { }
}

export class OrdersDownloadAttachmentAction implements Action {
    readonly type = OrdersActionType.OrdersDownloadAttachment;
    constructor(public payload?: { id: string, preventNavigation?: boolean }) { }
}

export class OrdersDownloadAttachmentSuccessAction implements Action {
    readonly type = OrdersActionType.OrdersDownloadAttachmentSuccess;
    constructor(public payload: { blob: Blob, preventNavigation?: boolean }) { }
}

export class OrdersDownloadAttachmentFailureAction implements Action {
    readonly type = OrdersActionType.OrdersDownloadAttachmentFailure;
    constructor(public payload: { error: Error }) { }
}


export type OrdersActionUnion =
    | OrdersReadAction
    | OrdersReadSuccessAction
    | OrdersReadFailureAction
    | OrdersCreateAction
    | OrdersCreateSuccessAction
    | OrdersCreateFailureAction
    | OrdersUpdateAction
    | OrdersUpdateSuccessAction
    | OrdersUpdateFailureAction
    | OrdersUpdateBatchAction
    | OrdersUpdateBatchSuccessAction
    | OrdersUpdateBatchFailureAction    
    | OrdersDeleteAction
    | OrdersDeleteSuccessAction
    | OrdersDeleteFailureAction
    | OrdersSelectAction
    | OrdersReadStatisticsAction
    | OrdersReadStatisticsSuccessAction
    | OrdersReadStatisticsFailureAction
    | OrdersPrintPdfAction
    | OrdersPrintPdfSuccessAction
    | OrdersPrintPdfFailureAction
    | OrdersPrintExcelSummaryAction
    | OrdersPrintExcelSummarySuccessAction
    | OrdersPrintExcelSummaryFailureAction
    | OrdersUploadAttachmentsAction
    | OrdersUploadAttachmentsSuccessAction
    | OrdersUploadAttachmentsFailureAction
    | OrdersDownloadAttachmentAction
    | OrdersDownloadAttachmentSuccessAction
    | OrdersDownloadAttachmentFailureAction;
