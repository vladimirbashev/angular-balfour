import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver, MediaChange  } from '@angular/flex-layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import get from 'lodash-es/get';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, take, takeUntil, distinctUntilChanged, skipWhile, debounceTime } from 'rxjs/operators';
import omit from 'lodash-es/omit';
import { AppbarService, EntityState, Filter, Organization, trackBy, UserProfile } from '../../../common';
import { OrganizationEditService } from '../services/organization-edit.service';
import { OrganizationsService } from '../services/organizations.service';
import { SessionService } from '../../session/services/session.service';

@Component({
    selector: 'rp-organizations-screen',
    templateUrl: './organizations-screen.component.html',
    styleUrls: ['./organizations-screen.component.scss']
})
export class OrganizationsScreenComponent implements OnInit, OnDestroy {
    private _disposed$ = new Subject();
    private mediaWatcher: Subscription;
    public media: MediaObserver;

    public ctx$: Observable<any>;
    public isSingle = false;
    public error$: Observable<any>;
    public selectedItem$: Observable<Organization>;
    public state$: Observable<EntityState>;
    public organizations$: Observable<Organization[]>;
    public trackById = trackBy('id');
    public hasChanges$: Observable<boolean>;
    public valid$: Observable<boolean>;
    public inGroup = UserProfile.inGroup;

    // public form: FormGroup;
    private emptyFilterString = 'Not filtered';
    private startFilterString = 'Search: ';

    public filterDetailsForm: FormGroup;

    public id_placeholder = 'id';
    public name_placeholder = 'name';
    public number_placeholder = 'number';
    public city_placeholder = 'city';
    public state_placeholder = 'state';
    public zip_placeholder = 'zip';
    public owner_id_placeholder = 'owner_id';

    public isPanelExpanded = false;
    public filterTitle: string = this.emptyFilterString;
    public isFiltered = false;

    private filterObj: object = {
        id: '',
        name: '',
        number: '',
        city: '',
        state: '',
        zip: '',
        owner_id: ''
    };

    constructor(
        private appbar: AppbarService,
        private mediaObserver: MediaObserver,
        private organizationsService: OrganizationsService,
        private organizationEditService: OrganizationEditService,
        private sessionService: SessionService,
        private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _snackBar: MatSnackBar
    ) {

        this.media = mediaObserver;
        this.error$ = this.organizationsService.error$.pipe(
            map(error => get(error, 'error.error.message', 'Unknown error'))
        );
        this.selectedItem$ = this.organizationsService.selectedItem$;
        this.state$ = this.organizationsService.state$;
        this.organizations$ = this.organizationsService.organizations$;
        this.hasChanges$ = this.organizationEditService.changed$;
        this.valid$ = this.organizationEditService.valid$;
        this.ctx$ = combineLatest(
            this.state$,
            this.selectedItem$,
            this.sessionService.userProfile$
        ).pipe(
            map(([state, selectedItem, profile]) => ({ state, selectedItem, profile }))
        );

        combineLatest(
            this.organizationsService.selectedId$.pipe(skipWhile(id => !id))
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

        this.readOrganizations();

        this.appbar.registerIcon({
            name: 'back',
            icon: 'arrow_back',
            callback: () => {
                this.organizationEditService.reset.emit();
                this.organizationsService.resetState();
                this.isSingle = false;
                this.appbar.selectByName('menu');
            }
        });
        const id = this.route.snapshot.queryParamMap.get('id');
        if (id) {
            this.organizationsService.selectById(id);
        }
    }

    ngOnDestroy(): void {
        this.appbar.degeristerIcon('back');
        this.mediaWatcher.unsubscribe();
        this._disposed$.next();
        this._disposed$.complete();
    }

    private readOrganizations(): void {
        this.organizationsService.read(this.getFilter());
    }

    private get _hasChanges(): boolean {
        return this.organizationEditService.changed;
    }

    private get _valid(): boolean {
        return this.organizationEditService.valid;
    }

    onScroll(): void {
        this.organizationsService.readMore(this.getFilter());
    }

    onSelect(id: string): void {
        this.organizationsService.selectById(id);
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
        this.organizationsService.selectedId$
            .pipe(take(1))
            .subscribe(id => {
                this.organizationsService.deleteOrganization(id);
            });
        this.openSnackBar('Organization was deleted', 'Done');
    }

    public save(): void {
        if (!this._hasChanges || !this._valid) { return; }
        this.organizationsService.selectedId$
            .pipe(take(1))
            .subscribe(id => {
                this.organizationsService.updateOrganization(id, this.organizationEditService.value);
            });
        this.openSnackBar('Organization was updated', 'Done');
    }
    public create(): void {
        if (!this._hasChanges || !this._valid) { return; }
        this.organizationsService.createOrganization(omit(this.organizationEditService.value, 'id') as Organization);
        this.openSnackBar('Organization was created', 'Done');
    }

    public cancel(): void {
        this.organizationEditService.reset.emit();
        this.organizationsService.resetState();
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
        this.organizationsService.setState(EntityState.Create);
    }

    private openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }

    // filter
    public onReload(): void {
        this.readOrganizations();
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
        this.readOrganizations();
        this.onClosed();
    }

    public onOpened(): void {
        this.isPanelExpanded = true;
    }

    public onClosed(): void {
        this.isPanelExpanded = false;
    }
}
