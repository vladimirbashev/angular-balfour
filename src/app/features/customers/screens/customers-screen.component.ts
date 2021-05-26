import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import get from 'lodash-es/get';
import omit from 'lodash-es/omit';
import { combineLatest, Observable, Subscription, Subject } from 'rxjs';
import { map, take, takeUntil, distinctUntilChanged, skipWhile, debounceTime } from 'rxjs/operators';
import { AppbarService, Customer, EntityState, Filter, trackBy } from '../../../common';
import { CustomerEditService } from '../services/customer-edit.service';
import { CustomersService } from '../services/customers.service';

@Component({
    selector: 'rp-customers-screen',
    templateUrl: './customers-screen.component.html',
    styleUrls: ['./customers-screen.component.scss']
})
export class CustomersScreenComponent implements OnInit, OnDestroy {
    private _disposed$ = new Subject();

    private emptyFilterString = 'Not filtered';
    private startFilterString = 'Search: ';

    public ctx$: Observable<any>;
    public isSingle = false;
    public error$: Observable<any>;
    public selectedItem$: Observable<Customer>;
    public state$: Observable<EntityState>;
    public customers$: Observable<Customer[]>;
    public trackById = trackBy('id');
    public hasChanges$: Observable<boolean>;
    public valid$: Observable<boolean>;
    public tabIndex$: Observable<number>;
    public media: MediaObserver;
    public filterDetailsForm: FormGroup;

    public id_placeholder = 'id';
    public first_name_placeholder = 'first_name';
    public last_name_placeholder = 'last_name';
    public organization_id_placeholder = 'organization_id';
    public organization_name_placeholder = 'organization_name';
    public city_placeholder = 'city';
    public state_placeholder = 'state';
    public zip_placeholder = 'zip';
    public phone_placeholder = 'phone';
    public additional_phone_placeholder = 'additional_phone';
    public email_placeholder = 'email';
    public additional_email_placeholder = 'additional_email';
    public owner_id_placeholder = 'owner_id';
    public isPanelExpanded = false;

    public filterTitle: string = this.emptyFilterString;
    public isFiltered = false;

    private filterObj: object = {
        id: '',
        first_name: '',
        last_name: '',
        organization_id: '',
        organization_name: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        additional_phone: '',
        email: '',
        additional_email: '',
        owner_id: ''
    };
    private mediaWatcher: Subscription;

    constructor(
        private appbar: AppbarService,
        private customersService: CustomersService,
        private customerEditService: CustomerEditService,
        private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private mediaObserver: MediaObserver,
    ) {
        this.error$ = this.customersService.error$.pipe(
            map(error => get(error, 'error.error.message', 'Unknown error'))
        );
        this.selectedItem$ = this.customersService.selectedItem$;
        this.state$ = this.customersService.state$;
        this.customers$ = this.customersService.customers$;
        this.hasChanges$ = this.customerEditService.changed$;
        this.valid$ = this.customerEditService.valid$;
        this.tabIndex$ = this.customerEditService.index$;
        this.ctx$ = combineLatest(
            this.state$,
            this.selectedItem$
        ).pipe(
            map(([state, selectedItem]) => ({ state, selectedItem }))
        );

        combineLatest(
            this.customersService.selectedId$.pipe(skipWhile(id => !id))
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

        this.media = mediaObserver;

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
        this.filterDetailsForm = this._fb.group(this.filterObj);
        this.filterTitle = this.getFilterTitle(this.filterDetailsForm.value);
        this.readCustomers();

        this.appbar.registerIcon({
            name: 'back',
            icon: 'arrow_back',
            callback: () => {
                this.customerEditService.reset.emit();
                this.customersService.resetState();
                this.isSingle = false;
                this.appbar.selectByName('menu');
            }
        });
        // this.ordersService.read();
        const id = this.route.snapshot.queryParamMap.get('id');
        if (id) {
            this.customersService.selectById(id);
        }
    }

    private readCustomers(): void {
        this.customersService.read(this.getFilter());
    }

    ngOnDestroy(): void {
        this.appbar.degeristerIcon('back');
        this.mediaWatcher.unsubscribe();
        this._disposed$.next();
        this._disposed$.complete();
    }

    private get _hasChanges(): boolean {
        return this.customerEditService.changed;
    }
    private get _valid(): boolean {
        return this.customerEditService.valid;
    }

    onReload(): void {
        this.readCustomers();
    }

    onScroll(): void {
        this.customersService.readMore(this.getFilter());
    }

    onSelect(id: string): void {
        this.customersService.selectById(id);
        if (this.mediaObserver.isActive('lt-md')) {
            this.isSingle = true;
            this.appbar.selectByName('back');
        }
    }

    public deleteWithConfirm(): void {
        // dialog window
        this.delete();
    }

    public delete(): void {
        this.customersService.selectedId$
            .pipe(take(1))
            .subscribe(id => {
                this.customersService.deleteCustomer(id);
            });
        this.openSnackBar('Customer was deleted', 'Done');
    }

    public save(): void {
        if (!this._hasChanges || !this._valid) { return; }
        this.customersService.selectedId$
            .pipe(take(1))
            .subscribe(id => {
                this.customersService.updateCustomer(id, this.customerEditService.value);
            });
        this.openSnackBar('Customer was updated', 'Done');
    }

    public create(): void {
        if (!this._hasChanges || !this._valid) { return; }
        this.customersService.createCustomer(omit(this.customerEditService.value, 'id') as Customer);
        this.openSnackBar('Customer was created', 'Done');
    }

    public cancel(): void {
        this.customerEditService.reset.emit();
        this.customersService.resetState();
        if (this.mediaObserver.isActive('lt-md')) {
            this.isSingle = false;
            this.appbar.selectByName('menu');
        }
    }

    public onAdd(): void {
        if (this.mediaObserver.isActive('lt-md')) {
            this.isSingle = true;
            this.appbar.selectByName('back');
        }
        this.customersService.setState(EntityState.Create);
    }

    private openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }

    public onRefresh(): void {
        this.readCustomers();
    }

    public onResetFilter($event): void {
        if ($event) { $event.stopPropagation(); }

        const keys = Object.keys(this.filterObj);
        keys.map(key => this.filterObj[key] = '');
        this.filterDetailsForm.patchValue(this.filterObj, { emitEvent: false });
        this.onApplyFilter(null);
    }

    public onResetFilterValue(name): void {
        this.filterDetailsForm.get(name).patchValue('', { emitEvent: false });
    }

    public mapFilterToRouteParams(): void {
        const filter = new Filter(this.filterDetailsForm.value);
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
        return new Filter(this.getFilterString(this.filterDetailsForm.value));
    }

    public onApplyFilter($event): void {
        // Apply filters
        if ($event) { $event.stopPropagation(); }

        this.isPanelExpanded = false;
        this.mapFilterToRouteParams();
        this.filterTitle = this.getFilterTitle(this.filterDetailsForm.value);
        this.isFiltered = this.filterTitle !== this.emptyFilterString;
        this.readCustomers();
        this.onClosed();
    }

    public onOpened(): void {
        this.isPanelExpanded = true;
    }

    public onClosed(): void {
        this.isPanelExpanded = false;
    }
}
