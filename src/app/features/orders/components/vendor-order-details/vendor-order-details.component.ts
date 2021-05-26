import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { trackBy } from 'src/app/common';

import {
    ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';

import {
    CustomerOrder, EntityState, VendorOrder, VendorOrderStatus, VendorOrderCode, VendorOrderNote, CustomerPaymentType, VendorOrderPaymentType, VendorOrderAttachment, ChaseTransaction
} from '../../../../common/models';
import { UserProfile, UserGroup, CustomerOrderStatus } from '../../../../common/models';
import { CustomerOrdersService } from '../../../customer-orders/services/customer-orders.service';
import { SessionService } from '../../../session/services/session.service';
import { OrdersService } from '../../services/orders.service';
import { filter } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OrdersChangeStatusDialogComponent } from '../change-status-dialog/change-status-dialog.component';
import { union, sumBy } from 'lodash-es';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'rp-vendor-order-details',
    templateUrl: './vendor-order-details.component.html',
    styleUrls: ['./vendor-order-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorOrderDetailsComponent implements OnInit, OnChanges {

    private _customerOrdersIds$ = new BehaviorSubject([]);
    private _order: VendorOrder;
    public state$: Observable<EntityState>;
    private cordersWatcher: Subscription;
    public allOrdersCompleted: boolean = true;
    public notesState$ = new BehaviorSubject('view');

    @Input() set order(val: VendorOrder) {
        let code = VendorOrderCode.SOFD;
        let otherCode = null;
        if (val?.code !== VendorOrderCode.Regular && val?.code !== VendorOrderCode.SOFD) {
            code = VendorOrderCode.Other;
            otherCode = val?.code;
        } else {
            code = val?.code;
        }

        this.form.patchValue({
            code: code,
            otherCode: otherCode
        }, { emitEvent: false });
        this.form.markAsUntouched();

        this._order = val;
        this.warningChecksCountAndAttachemnts = false;
        if (this._order?.payment_type ==  VendorOrderPaymentType.Check && this._order.attachments.length < 1) {
                    this.warningChecksCountAndAttachemnts = true;
        }
    }

    get order(): VendorOrder {
        return this._order;
    }

    public ctx$: Observable<{
        customerOrdersProgress: boolean,
        profile: UserProfile,
        state: EntityState,
        printState: EntityState,
        printOrderState: EntityState
    }>;
    public customerOrders$: Observable<CustomerOrder[]>;
    public customerOrdersProgress$: Observable<boolean>;
    public inGroup = UserProfile.inGroup;
    public trackById = trackBy('id');
    public vendorOrderCodes = Object.entries(VendorOrderCode);
    public addNoteForm: FormGroup;
    public form: FormGroup;
    public ordersDeposit: number = 0;

    public warningTotalDeposit: boolean = false;
    public warningCountOfOrders: boolean = false;
    public warningChecksCountAndAttachemnts: boolean =  false;

    constructor(
        private fb: FormBuilder,
        private customerOrdersService: CustomerOrdersService,
        private ordersService: OrdersService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private sessionService: SessionService,
        private _dialog: MatDialog,
        private http: HttpClient
    ) {
        this.ctx$ = combineLatest(
            combineLatest(
                this.customerOrdersService.state$,
                this.customerOrdersService.isLoading$
            ).pipe(
                map(([state, isLoading]) => isLoading || state === EntityState.Progress)
            ),
            this.sessionService.userProfile$,
            this.ordersService.state$,
            this.ordersService.printState$,
            this.customerOrdersService.printState$
        ).pipe(
            map(([customerOrdersProgress, profile, state, printState, printOrderState]) => ({ customerOrdersProgress, profile, state, printState, printOrderState }))
        );

        this.form = this.fb.group({
            code: [null, [Validators.required]],
            otherCode: [null]
        });

        this.addNoteForm = this.fb.group({
            content: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.customerOrders$ = this._customerOrdersIds$.asObservable().pipe(
            switchMap(ids => this.customerOrdersService.ordersByIds(ids))
        );

        this.cordersWatcher = this.customerOrders$.subscribe((corders: CustomerOrder[]) => {
            if (!corders || !this._order) {
                return;
            }

            this.warningCountOfOrders = corders.length !== this._order.count_of_orders;
            this.ordersDeposit = 0;
            this.allOrdersCompleted = true;
            corders.forEach(corder => {
                var deposit = corder.payment_info?.fully_prepaid || 0;
                if (deposit == 0) {
                    deposit = this.getCustomerOrderDeposit(corder);
                }
                this.ordersDeposit += isNaN(Number(deposit)) ? 0 : Number(deposit);

                if (corder.status == CustomerOrderStatus.Incomplete) {
                    this.allOrdersCompleted = false;
                }
            });

            this.ordersDeposit = Number(this.ordersDeposit.toFixed(2));

            if (this._order) {
                this.warningTotalDeposit = this.ordersDeposit !== this.totalDeposist;
            }
        });
    }

    ngOnDestroy(): void {
        this.cordersWatcher.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.order) {
                this._customerOrdersIds$.next(changes.order.currentValue?.customer_order_ids ?? []);
            }
        }
    }

    getCustomerOrderDeposit(corder: CustomerOrder) {
        if (corder == null) return 0;

        var deposit = corder.payment_info?.fully_prepaid || 0;
        if (deposit == 0) {
            switch (corder.payment_info?.payment_type) {
                case 'chase':
                    deposit = Number(corder.payment_info?.deposit_only);
                    break;
                case 'check':
                    deposit = Number(corder.payment_info?.deposit_only);
                    break;
                case 'bill_rep_office':
                    deposit = (Number(corder.payment_info?.rep_gratis_amount) || 0) + (Number(corder.payment_info?.chase_rep_gratis_amount) || 0);
                    break;
                case 'rep_gratis':
                    deposit = (Number(corder.payment_info?.rep_gratis_amount) || 0)
                        + (Number(corder.payment_info?.chase_rep_gratis_amount) || 0)
                        + (Number(corder.payment_info?.check_rep_gratis_amount_cust) || 0)
                        + (Number(corder.payment_info?.chase_rep_gratis_amount_cust) || 0);
                    break;
                default:
                    deposit = 0;
            }
        }
        return isNaN(Number(deposit)) ? 0 : Number(deposit);
    }

    addCustomerOrder(): void {
        this.router.navigate(['customer_orders', 'create'], { queryParams: { vendor_order_id: this.order.id } });
    }

    onEditClick(): void {
        this.router.navigate(['envelopes', this.order?.id]);
    }

    onProcessVendorOrder(): void {
        if (this.order) {
            const order = Object.assign({}, this.order);
            order.status = VendorOrderStatus.Processed;
            this.ordersService.update(order);
        }
    }

    get chaseAmount() {
        var sum = sumBy(this.order.chase_transactions, (t: ChaseTransaction) => { 
            return t.deposit || 0; 
        });

        return sum;
    }

    get totalDeposist() {
        var sum = 0;

        if (this.order?.payment_type == VendorOrderPaymentType.Chase || this.order?.payment_type_2 == VendorOrderPaymentType.Chase 
                || (this.order?.additional_payment_types && this.order?.additional_payment_types.includes(VendorOrderPaymentType.Chase))) {
            sum += this.chaseAmount;
        }

        if (this.order?.payment_type == VendorOrderPaymentType.Check || this.order?.payment_type_2 == VendorOrderPaymentType.Check
            || (this.order?.additional_payment_types && this.order?.additional_payment_types.includes(VendorOrderPaymentType.Check))) {
            sum += (this.order?.check_deposit || 0);
        }

        if (this.order?.payment_type == VendorOrderPaymentType.Wire || this.order?.payment_type_2 == VendorOrderPaymentType.Wire
            || (this.order?.additional_payment_types && this.order?.additional_payment_types.includes(VendorOrderPaymentType.Wire))) {
            sum += (this.order?.wire_deposit || 0);
        }

        if (this.order?.payment_type == VendorOrderPaymentType["Bill Rep Office @ NET"] || this.order?.payment_type_2 == VendorOrderPaymentType["Bill Rep Office @ NET"]
            || (this.order?.additional_payment_types && this.order?.additional_payment_types.includes(VendorOrderPaymentType["Bill Rep Office @ NET"]))) {
            sum += (this.order?.bill_rep_office_deposit || 0);
        }

        if (this.order?.payment_type == VendorOrderPaymentType["Rep Gratis"] || this.order?.payment_type_2 == VendorOrderPaymentType["Rep Gratis"]
            || (this.order?.additional_payment_types && this.order?.additional_payment_types.includes(VendorOrderPaymentType["Rep Gratis"]))) {
            sum += (this.order?.rep_gratis_deposit || 0);
        }

        return Number(sum.toFixed(2));
    }

    onEditCustomerOrder(corderId: string): void {
        this.router.navigate(['customer_orders', corderId])
    }

    onDeleteCustomerOrder(corder: CustomerOrder): void {
        if (this.order && corder) {
            const order = Object.assign({}, this.order);
            var index = order.customer_order_ids.findIndex((id) => id == corder.id);

            if (index > -1) {
                order.customer_order_ids = filter(order.customer_order_ids, (id, i) => {
                    return i !== index;
                });
                order.customer_names = filter(order.customer_names, (id, i) => {
                    return i !== index;
                });
                order.customer_phones = filter(order.customer_phones, (id, i) => {
                    return i !== index;
                });

                order.total_price -= corder.total_price;

                this.ordersService.update(order);
                this.customerOrdersService.delete(corder.id, true);
                this.openSnackBar('Customer order was removed', 'Done');
            }
        }
    }

    onDeleteVendorOrder(): void {
        if (this.order) {
            this.order.customer_order_ids.forEach((corderId) => {
                this.customerOrdersService.delete(corderId, true);
            });
            this.ordersService.delete(this.order.id);
            this.openSnackBar('Envelope and all customer orders are deleted', 'Done');
        }
    }

    onSubmitVendorOrder(): void {
        if (this.order) {
            const order = Object.assign({}, this.order);
            order.status = VendorOrderStatus.Submitted;
            order.date_mailed = new Date(Date.now());
            this.ordersService.update(order);
            this.openSnackBar('Envelope submitted', 'Done');
        }
    }

    onUnsubmitVendorOrder(): void {
        if (this.order) {
            const order = Object.assign({}, this.order);
            order.status = VendorOrderStatus.InProgress;
            order.date_mailed = null;
            this.ordersService.update(order);
            this.openSnackBar('Envelope unsubmitted', 'Done');
        }
    }

    get isCodeChanged(): boolean {
        return this._order?.code !== this.form.get('code').value
            && (this.form.get('code').value !== VendorOrderCode.Other
                || this._order?.code !== this.form.get('otherCode').value);
    }

    resetCodeInForm() {
        if (this._order?.code !== VendorOrderCode.Regular && this._order.code !== VendorOrderCode.SOFD) {
            this.form.get('code').setValue(VendorOrderCode.Other);
            this.form.get('otherCode').setValue(this._order.code);
        } else {
            this.form.get('code').setValue(this._order.code);
            this.form.get('otherCode').setValue(null);
        }
    }

    onUpdateCode() {
        if (this.order) {
            const order = Object.assign({}, this.order);
            if (this.form.get('code').value === VendorOrderCode.Other) {
                order.code = this.form.get('otherCode').value;
            } else {
                order.code = this.form.get('code').value;
            }
            this.ordersService.update(order);
            this.openSnackBar('Envelope code updated', 'Done');
        }
    }

    onChangeStatus(groups, userProfile) {
        this._dialog.open(OrdersChangeStatusDialogComponent, {
            minWidth: '50vw',
            panelClass: 'rp-relative-dialog',
            data: { current_user: userProfile, groups: groups, status: this.order?.status, assignee_id: this.order?.assignee_id }
        }).afterClosed().subscribe(result => {
            if (result) {
                const order = Object.assign({}, this.order);
                order.status = result.status;
                order.assignee_id = result.assignee_id;
                if (order.status == VendorOrderStatus.Submitted) {
                    order.date_mailed = new Date(Date.now());
                }
                if (order.status == VendorOrderStatus.InProgress) {
                    order.date_mailed = null;
                }
                this.ordersService.update(order);
                this.openSnackBar('Envelope status changed', 'Done');
            }
        });
    }

    onExportPdf(version: string = '1') {
        this.openSnackBar('Pdf generation. Please, wait!', 'OK');
        this.ordersService.printPdf(this._order.id, version);
    }

    onExportOrderPdf(corder, version: string = '1') {
        this.openSnackBar('Pdf generation. Please, wait!', 'OK');
        this.customerOrdersService.printPdf(corder.id, version, true);
    }

    onAddNote() {
        this.notesState$.next('add');
    }

    onAddNoteCancel() {
        this.addNoteForm.patchValue({
            content: null
        });
        this.notesState$.next('view');
    }

    onAddNoteConfirm(profile) {
        var order = Object.assign({}, this.order);
        if (!order.notes || order.notes.length < 1) order.notes = [];
        var note = {
            content: this.addNoteForm.get('content').value,
            author_id: profile.id,
            author_name: profile.full_name,
            resolved: false
        };

        order.notes = union(order.notes, [note]);
        this.ordersService.update(order);
        this.openSnackBar('Note is added', 'Done');
        this.notesState$.next('view');
    }

    onNoteDelete(note: VendorOrderNote) {
        var order = Object.assign({}, this.order);

        var notes = [...order.notes];
        notes.splice(order.notes.findIndex(von => von.content == note.content && von.author_id == note.author_id), 1);
        order.notes = notes;
        this.ordersService.update(order);
        this.openSnackBar('Note is deleted', 'Done');
    }

    onUploadAttachments(files) {
        var attachments: VendorOrderAttachment[] = [];
        var i = 0;
        const reader = new FileReader();
        do {
                const file = files[i];
                reader.readAsDataURL(file);
                reader.onload = () => {
                    attachments.push({
                        name: file.name,
                        type: file.type,
                        uri: null,
                        description: null,
                        blob_id: null,
                        data: reader.result.toString()
                    });
                }
                i++;
        } while (i < files.length)

        setTimeout(() => {
            var order = Object.assign({}, this.order);
            order.attachments = union(order.attachments, attachments);
            this.ordersService.uploadAttachments(order);
            this.openSnackBar('Attachments are added', 'Done');
        }, files.length * 100);
    }

    onDeleteAttachment(attachment: VendorOrderAttachment) {
        var order = Object.assign({}, this.order);
        var index = order.attachments.findIndex(a  => a.blob_id === attachment.blob_id);
        var attachments = [...order.attachments];
        attachments.splice(index, 1);

        order.attachments = attachments;
        this.ordersService.update(order);
        this.openSnackBar('Attachment is deleted', 'Done');
    }

    private openSnackBar(message: string, action: string, panelClass: string[] = []): void {
        this._snackBar.open(message, action, {
            duration: 300000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
        });
    }

    public getVendorOrderCodes(profileGroups): any {
        if (profileGroups) {
            if (this.inGroup(profileGroups.groups, UserGroup.Reps)) {
                return this.vendorOrderCodes.filter(a => a[1] !== VendorOrderCode.Other);
            }
        }
        return this.vendorOrderCodes;
    }

    public onCodeChange($event): void {
        this.form.get('otherCode').markAsUntouched();
        this.form.get('otherCode').markAsPristine({ onlySelf: true });
    }
}
