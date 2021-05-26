import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import get from 'lodash-es/get';
import assign from 'lodash-es/assign';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, skipWhile, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { AppbarService, CustomerOrder, EntityState, Filter, FilterVendorOrderStatuses, trackBy } from 'src/app/common';
import { UserProfile } from './../../../../common/models/UserProfile';
import { SessionService } from './../../../session/services/session.service';
import { CustomerOrdersService } from './../../services/customer-orders.service';


@Component({
    selector: 'rp-customer-orders-screen',
    templateUrl: './customer-orders-screen.component.html',
    styleUrls: ['./customer-orders-screen.component.scss']
})
export class CustomerOrdersScreenComponent implements OnInit, OnDestroy {

    private _disposed$ = new Subject();
    private mediaWatcher: Subscription;

    public ctx$: Observable<any>;
    public inGroup = UserProfile.inGroup;
    public isSingle = false;
    public error$: Observable<any>;
    public selectedItem$: Observable<CustomerOrder>;
    public state$: Observable<EntityState>;
    public customerOrders$: Observable<CustomerOrder[]>;
    public trackById = trackBy('id');

    // public form: FormGroup;
    public media: MediaObserver;

    private emptyFilterString = 'Not filtered';
    private startFilterString = 'Search: ';

    public filterDetailsForm: FormGroup;
    public filterStatusForm: FormGroup;

    public id_placeholder = 'id';
    public customer_name_placeholder = 'customer_name';
    public customer_id_placeholder = 'customer_id';
    public customer_phone_placeholder = 'customer_phone';
    public product_id_placeholder = 'product_id';
    public vendor_order_id_placeholder = 'vendor_order_id';
    // public vendor_order_status_placeholder = 'vendor_order_status';
    public owner_id_placeholder = 'owner_id';

    public isPanelExpanded = false;
    public filterTitle: string = this.emptyFilterString;
    public isFiltered = false;
    public filterVendorOrderStatues = Object.entries(FilterVendorOrderStatuses);

    private filterObj: object = {
        id: '',
        customer_name: '',
        customer_id: '',
        customer_phone: '',
        product_id: '',
        vendor_order_id: '',
        // vendor_order_status: '',
        owner_id: ''
    };

    constructor(
        private appbar: AppbarService,
        private mediaObserver: MediaObserver,
        private customerOrdersService: CustomerOrdersService,
        private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private sessionService: SessionService
    ) {
        this.appbar.registerIcon({
            name: 'back',
            icon: 'arrow_back',
            callback: () => {
                this.isSingle = false;
                this.appbar.selectByName('menu');
            }
        });

        this.media = mediaObserver;
        this.error$ = this.customerOrdersService.error$.pipe(
            map(error => get(error, 'error.error.message', 'Unknown error'))
        );
        this.selectedItem$ = this.customerOrdersService.selectedItem$;
        this.state$ = this.customerOrdersService.state$;
        this.customerOrders$ = this.customerOrdersService.customerOrders$;
        this.ctx$ = combineLatest(
            this.state$,
            this.selectedItem$,
            this.sessionService.userProfile$
        ).pipe(
            map(([state, selectedItem, profile]) => ({ state, selectedItem, profile }))
        );

        combineLatest(
            this.customerOrdersService.selectedId$.pipe(skipWhile(id => !id))
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
        this.mapFilterFromRouteParams();
        this.filterTitle = this.getFilterTitle(assign({}, this.filterDetailsForm.value, this.filterStatusForm.value));
 
        this.appbar.selectByName('menu'); 
        const id = this.route.snapshot.queryParamMap.get('id');
        if (id) {
            this.customerOrdersService.selectById(id);
        }
    }

    ngOnDestroy(): void {
        this.appbar.degeristerIcon('back');
        this.mediaWatcher.unsubscribe();
        this._disposed$.next();
        this._disposed$.complete();
    }

    createCustomerOrder(): void {
        this.router.navigate(['customer_orders', 'create']);
    }

    readCustomerOrders(): void {
        this.customerOrdersService.read(this.getFilter());
    }

    onReload(): void {
        this.readCustomerOrders();
    }

    onScroll(): void {
        this.customerOrdersService.readMore(this.getFilter());
    }

    onSelect(id: string): void {
        this.customerOrdersService.selectById(id);
        if (this.mediaObserver.isActive('lt-md')) {
            this.isSingle = true;
            this.appbar.selectByName('back');
        }
    }

    // filter
    public onResetFilter($event): void {
        if ($event) { $event.stopPropagation(); }

        const keys = Object.keys(this.filterObj);
        keys.map(key => this.filterObj[key] = '');
        this.filterDetailsForm.patchValue(this.filterObj, { emitEvent: false });
        this.filterStatusForm.patchValue({ vendor_order_status: 'all' }, { emitEvent: false });
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

        let vendor_order_status = filter['vendor_order_status'] || FilterVendorOrderStatuses.all;

        if (!vendor_order_status || !FilterVendorOrderStatuses[vendor_order_status]) {
            vendor_order_status = 'all';
        }

        this.filterDetailsForm = this._fb.group(this.filterObj);
        this.filterStatusForm = this._fb.group({
            vendor_order_status
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
        if (filter['vendor_order_status'] === 'all') { filter['vendor_order_status'] = null; }

        return new Filter(this.getFilterString(filter));
    }

    public onApplyFilter($event): void {
        // Apply filters
        if ($event) { $event.stopPropagation(); }

        this.isPanelExpanded = false;
        this.mapFilterToRouteParams();
        this.filterTitle = this.getFilterTitle(assign({}, this.filterDetailsForm.value, this.filterStatusForm.value));
        this.isFiltered = this.filterTitle !== this.emptyFilterString;
        this.readCustomerOrders();
        this.onClosed();
    }

    public onOpened(): void {
        this.isPanelExpanded = true;
    }

    public onClosed(): void {
        this.isPanelExpanded = false;
    }
}
