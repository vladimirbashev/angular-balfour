import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, tap, startWith } from 'rxjs/operators';

import { OrganizationsService } from '../../services/organizations.service';
import { Organization, Filter, EntityState } from '../../../../common/models/index';
import { trackBy } from '../../../../common';

@Component({
    selector: 'mn-organizations-add-dialog',
    templateUrl: './organizations-add-dialog.component.html',
    styleUrls: ['./organizations-add-dialog.component.scss'],
    providers: [OrganizationsService]
})
export class OrganizationsAddDialogComponent implements OnInit, OnDestroy {

    private TAKE = 50;
    private _subs = new Subscription();

    public form: FormGroup;
    public loading$: Observable<boolean>;
    public organizations$: Observable<Organization[]>;
    public trackById = trackBy('id');
    private search: string = '';

    @ViewChild(MatSelectionList) organizationsList: MatSelectionList;

    constructor(
        private _dialogRef: MatDialogRef<OrganizationsAddDialogComponent>,
        private _fb: FormBuilder,
        private _organizationsService: OrganizationsService
    ) {
        this.form = this._fb.group({
            search: ['']
        });

        this._subs.add(this.form.valueChanges
            .pipe(
                startWith(this.form.getRawValue()),
                debounceTime(500))
            .subscribe(val => {
                this.search = val.search;
                this._organizationsService.read(val.search ? new Filter({ search: val.search }) : null, 0, this.TAKE);
                // this._organizationsService.read(val.search ? new Filter({name: val.search, number: val.search }) : null, 0, this.TAKE);
            }));

        this.loading$ = combineLatest(
            this._organizationsService.isLoading$,
            this._organizationsService.state$
        ).pipe(
            map(([loading, state]) => loading || state === EntityState.Progress),
            distinctUntilChanged(),
            tap(loading => {
                if (loading) {
                    this.form.disable({ emitEvent: false });
                } else {
                    this.form.enable({ emitEvent: false });
                }
            })
        );
        this.organizations$ = this._organizationsService.organizations$;
    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        this._subs.unsubscribe();
        // reread organization
        this._organizationsService.read();
    }

    public readMore(): void {
        this._organizationsService.readMore(this.search ? new Filter({ search: this.search }) : null);
        // this._organizationsService.readMore(this.search ? new Filter({name: this.search, number: this.search }) : null);
    }

    public onAdd(): void {
        const result = this.organizationsList.selectedOptions.selected[0]?.value;
        console.log(result);
        this._dialogRef.close(result);
    }

    public clearSearch(): void {
        this.form.setValue({search: ''});
    }
}
