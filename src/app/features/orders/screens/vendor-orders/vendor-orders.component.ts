import get from 'lodash-es/get';
import assign from 'lodash-es/assign';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, skipWhile, takeUntil, distinctUntilChanged, take } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';

import { AppbarService, EntityState, trackBy, VendorOrder, Filter, FilterVendorOrderStatuses } from 'src/app/common';
import { UserProfile } from '../../../../common/models/UserProfile';
import { SessionService } from '../../../session/services/session.service';
import { OrdersService } from '../../services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { isNil } from 'lodash-es';
import { ExcelSummaryDialogComponent } from '../../../../common/components/excel-summary-dialog/excel-summary-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdersChangeStatusMultiDialogComponent } from '../../components/change-status-multi-dialog/change-status-multi-dialog.component';

@Component({
    selector: 'rp-vendor-orders',
    templateUrl: './vendor-orders.component.html',
    styleUrls: ['./vendor-orders.component.scss']
})
export class VendorOrdersComponent implements OnInit, OnDestroy {

    private _disposed$ = new Subject();
    private mediaWatcher: Subscription;

    public ctx$: Observable<any>;
    public inGroup = UserProfile.inGroup;
    public isSingle = false;
    public error$: Observable<any>;
    public selectedItem$: Observable<VendorOrder>;
    public vendorOrders$: Observable<VendorOrder[]>;
    public selectedVendorOrders: VendorOrder[] = [];
    public trackById = trackBy('id');

    private emptyFilterString = 'Not filtered';
    private startFilterString = 'Search: ';

    public media: MediaObserver;
    public filterDetailsForm: FormGroup;
    public filterStatusForm: FormGroup;

    public id_placeholder = 'id';
    public envelope_number_placeholder = 'Envelope number';
    public order_number_placeholder = 'Order number';
    public rep_name_placeholder = 'Rep name';
    public rep_number_placeholder = 'Rep number';
    public org_id_placeholder = 'org id';
    public org_name_placeholder = 'org name';
    public org_number_placeholder = 'org number';
    public status_placeholder = 'status';
    public customer_phones_placeholder = 'customer phones';
    public customer_name_placeholder = 'Customer name';
    public owner_id_placeholder = 'owner id';
    public isPanelExpanded = false;

    public filterVendorOrderStatues = Object.entries(FilterVendorOrderStatuses);

    public filterTitle: string = this.emptyFilterString;
    public isFiltered = false;

    private filterObj: object = {
        id: '',
        purchase_number: '',
        rep_name: '',
        org_id: '',
        org_name: '',
        org_number: '',
        office_number: '',
        // status: '',
        customer_phones: '',
        customer_name: '',
        owner_id: ''
    };

    constructor(
        private appbar: AppbarService,
        private mediaObserver: MediaObserver,
        private ordersService: OrdersService,
        private route: ActivatedRoute,
        private _fb: FormBuilder,
        private router: Router,
        private sessionService: SessionService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _dialog: MatDialog
    ) {
        this.appbar.registerIcon({
            name: 'back',
            icon: 'arrow_back',
            callback: () => {
                this.isSingle = false;
                this.appbar.selectByName('menu');
            }
        });
        this.appbar.registerAction({
            name: 'excel_summary',
            icon: 'file_download',
            tooltip: 'Print Excel Summary',
            in_progress: false,
            action: () => {
                const dialogRef = this.dialog.open(ExcelSummaryDialogComponent, {
                    width: '300px'
                });
                dialogRef.afterClosed().subscribe((status: string) => {
                    if (!isNil(status)) {
                        this.ordersService.printExcelSummary(status);
                    }
                });
            }
        });

        this.ordersService.printExcelSummaryState$.subscribe(s => {
            if (s) {
                let action = this.appbar.selectActionByName('excel_summary');
                if (s == 'progress') {
                    action.in_progress = true;
                } else if (s == 'data') {
                    action.in_progress = false;
                } else if (s == 'error') {
                    this.openSnackBar('Printing Excel Summary is failed', 'Ok');
                }
            }
        });

        const cntSub$ = new BehaviorSubject<number>(4);
        const cntInp$ = new BehaviorSubject<number>(2);
        const cntProc$ = new BehaviorSubject<number>(1);
        this.error$ = this.ordersService.error$.pipe(
            map(error => get(error, 'error.error.message', 'Unknown error'))
        );
        this.media = mediaObserver;
        this.selectedItem$ = this.ordersService.selectedItem$;
        this.vendorOrders$ = this.ordersService.orders$;
        this.ctx$ = combineLatest(
            cntSub$.asObservable(),
            cntInp$.asObservable(),
            cntProc$.asObservable(),
            this.selectedItem$,
            this.ordersService.state$,
            this.sessionService.userProfile$,
            this.ordersService.statistics$,
            this.ordersService.statisticsState$,
            this.ordersService.printExcelSummaryState$
        ).pipe(
            map(([cntSub, cntInp, cntProc, selectedItem, state, profile, statistics, statisticsState, printExcelSummaryState]) =>
                ({ cntSub, cntInp, cntProc, selectedItem, state, profile, statistics, statisticsState, printExcelSummaryState }))
        );
        combineLatest(
            this.ordersService.selectedId$.pipe(skipWhile(id => !id))
        )
            .pipe(
                takeUntil(this._disposed$),
                debounceTime(10))
            .subscribe(([id]) => {
                const queryParams = { id };
                this.router.navigate([], {
                    queryParams,
                    queryParamsHandling: 'merge',
                    replaceUrl: true
                });
            });

        this.mediaWatcher = mediaObserver.media$.pipe(
            distinctUntilChanged((prev, curr) => {
                return prev?.mqAlias === curr?.mqAlias;
            })
        ).subscribe((change: MediaChange) => {
            // if (this.mediaObserver.isActive('lt-md')) {
            if (change?.mqAlias === 'md' || change?.mqAlias === 'lg' || change?.mqAlias === 'xl') {
                this.isSingle = false;
                this.appbar.selectByName('menu');
            } else {

            }
        });
    }

    ngOnInit(): void {
        // check state
        this.mapFilterFromRouteParams();
        this.filterTitle = this.getFilterTitle(assign({}, this.filterDetailsForm.value, this.filterStatusForm.value));
        this.readOrders();

        // setTimeout(() => this.appbar.selectByName('menu'));
        this.appbar.selectByName('menu')
        // this.ordersService.read();
        const id = this.route.snapshot.queryParamMap.get('id');
        if (id) {
            this.ordersService.selectById(id);
        }
        this.ordersService.readStatistics();
    }

    ngOnDestroy(): void {
        this.appbar.degeristerIcon('back');
        this.appbar.deregisterAction('excel_summary');
        this.mediaWatcher.unsubscribe();
        this._disposed$.next();
        this._disposed$.complete();
    }

    createVendorOrder(): void {
        this.router.navigate(['envelopes', 'create']);
    }

    public readOrders(): void {
        this.ordersService.read(this.getFilter());
    }

    onReload(): void {
        this.readOrders();
    }

    onScroll(): void {
        this.ordersService.readMore(this.getFilter());
    }

    onSelect(id: string): void {
        this.ordersService.selectById(id);
        if (this.mediaObserver.isActive('lt-md')) {
            this.isSingle = true;
            this.appbar.selectByName('back');
        }
    }

    // Filter

    public onResetFilter($event): void {
        if ($event) { $event.stopPropagation(); }

        const keys = Object.keys(this.filterObj);
        keys.map(key => this.filterObj[key] = '');
        this.filterDetailsForm.patchValue(this.filterObj, { emitEvent: false });
        this.filterStatusForm.patchValue({ status: 'all' }, { emitEvent: false });
        this.onApplyFilter(null);
    }

    public onResetFilterValue(name): void {
        this.filterDetailsForm.get(name).patchValue('', { emitEvent: false });
    }

    public mapFilterToRouteParams(): void {
        const filter = new Filter(assign({}, this.filterDetailsForm.value, this.filterStatusForm.value));
        const queryParams: object = {
            filter: filter.toString(true, false)
        };
        this.router.navigate([], {
            queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    public mapFilterFromRouteParams(): void {
        const keys = Object.keys(this.filterObj);
        const filter = new Filter(this.route.snapshot.queryParamMap.get('filter'));

        keys.forEach(key => {
            const p = filter[key];
            this.filterObj[key] = p ? p : '';
        });

        let status = filter['status'] || FilterVendorOrderStatuses.all;

        if (!status || !FilterVendorOrderStatuses[status]) {
            status = 'all';
        }
        // if (!status || status !== FilterVendorOrderStatuses.)
        this.filterDetailsForm = this._fb.group(this.filterObj);
        this.filterStatusForm = this._fb.group({
            status
        });

    }

    private getFilterTitle(filter: object): string {
        const value = this.startFilterString + this.getFilterString(filter);

        return value === this.startFilterString ? this.emptyFilterString : value;
    }

    private getFilterString(filter: object): string {
        const keys = Object.keys(filter);
        let value = '';
        keys.forEach(key => {
            if (filter[key]) {
                value = value + key + '=' + filter[key] + '; ';
            }
        });

        return value;
    }

    private getFilter(): Filter {
        const filter = assign({}, this.filterDetailsForm.value, this.filterStatusForm.value);
        if (filter['status'] === 'all') { filter['status'] = null; }

        return new Filter(this.getFilterString(filter));
    }

    public onApplyFilter($event): void {
        // Apply filters
        if ($event) { $event.stopPropagation(); }

        this.mapFilterToRouteParams();
        this.filterTitle = this.getFilterTitle(assign({}, this.filterDetailsForm.value, this.filterStatusForm.value));
        this.isFiltered = this.filterTitle !== this.emptyFilterString;
        this.readOrders();
        this.onClosed();
    }

    public onOpened(): void {
        this.isPanelExpanded = true;
    }

    public onClosed(): void {
        this.isPanelExpanded = false;
    }

    public onDblClickItem(id: string, index: number) {
        let _vendorOrders = [];
        this.vendorOrders$.subscribe(vo => {
            _vendorOrders = vo;
        });
        let existIndex = this.selectedVendorOrders.findIndex(svo => svo.id == id);
        if (existIndex >= 0) {
            this.selectedVendorOrders = Object.assign([], this.selectedVendorOrders);
            this.selectedVendorOrders.splice(existIndex, 1);
        } else {
            this.selectedVendorOrders = Object.assign([], this.selectedVendorOrders);
            this.selectedVendorOrders.push(_vendorOrders[index]);
        }
    }

    public checkedCheckbox(id: string) {
        let existIndex = this.selectedVendorOrders.findIndex(svo => svo.id == id);
        return existIndex >= 0 ? true : false;
    }

    public changeCheckedCheckbox(id: string, index: number) {
        this.onDblClickItem(id, index);
    }

    public changeStatusMulti(groups, userProfile) {
        this._dialog.open(OrdersChangeStatusMultiDialogComponent, {
            minWidth: '50vw',
            panelClass: 'rp-relative-dialog',
            data: { selectedVendorOrders: this.selectedVendorOrders, current_user: userProfile, groups: groups }
        }).afterClosed().subscribe(result => {
            if (result) {
                // let ids = this.selectedVendorOrders.map(svo => svo.id);
                // this.ordersService.updateOrders(ids, result.status, result.assignee_id);
                this.selectedVendorOrders = [];
                this.openSnackBar('Envelopes multiple status changed', 'Done');
            }
        });
    }

    public setAllCheckboxes(checkAll: boolean) {
        this.vendorOrders$.pipe(take(1)).subscribe(vo => {
            if (checkAll) {
                this.selectedVendorOrders = vo;
            } else {
                this.selectedVendorOrders = [];
            }
        });
    }

    private openSnackBar(message: string, action: string, panelClass: string[] = []): void {
        this._snackBar.open(message, action, {
            duration: 300000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
        });
    }

}
