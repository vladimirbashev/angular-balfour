import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, DoCheck, HostListener, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import sortBy from 'lodash-es/sortBy';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, finalize, map, retry, startWith, switchMap, tap } from 'rxjs/operators';
import { Filter, Organization } from '../../../../common/models';
import { OrganizationsDataService } from '../../services/organizations.data.service';

class OrganizationPickerComponentBase {
    constructor(
        public _defaultErrorStateMatcher,
        public _parentForm,
        public _parentFormGroup,
        public ngControl) { }
}

const _OrganizationPickerComponentBase = mixinErrorState(OrganizationPickerComponentBase);

@Component({
    selector: 'rp-organization-picker',
    templateUrl: './organization-picker.component.html',
    styleUrls: ['./organization-picker.component.scss'],
    providers: [
        { provide: MatFormFieldControl, useExisting: OrganizationPickerComponent }
    ]
})
export class OrganizationPickerComponent extends _OrganizationPickerComponentBase
    implements OnDestroy, DoCheck, ControlValueAccessor, MatFormFieldControl<Organization> {

    static nextId = 0;

    private _onChangeNull = true;
    private _disabled: boolean;
    private _placeholder: string;
    private _required: boolean;

    controlType = 'rp-organization-picker';
    get empty(): boolean { return !this.orgCtrl.value; }
    focused = false;
    organizations$: Observable<Organization[]>;
    orgCtrl: FormControl;
    searching = false;
    searchResults$: Observable<Organization[]>;
    stateChanges = new Subject<void>();

    @HostListener('attr.aria-describedby')
    describedBy = '';
    @HostListener('id')
    id = `rp-organization-picker-${OrganizationPickerComponent.nextId++}`;
    @HostListener('class.rp-organization-picker-floating')
    get shouldLabelFloat(): boolean { return this.focused || !this.empty; }

    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.orgCtrl.disable() : this.orgCtrl.enable();
        this.stateChanges.next();
    }
    @Input()
    get placeholder(): string { return this._placeholder; }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    @Input()
    get required(): boolean { return this._required; }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    @Input()
    get value(): Organization | null { return this.orgCtrl.value instanceof Organization ? this.orgCtrl.value : null; }
    set value(value: Organization | null) {
        this.orgCtrl.setValue(value);
        this.stateChanges.next();
    }

    onChange: any = (_: any) => { };
    onTouched: any = () => { };

    constructor(
        private ds: OrganizationsDataService,
        @Optional() @Self() ngControl: NgControl,
        @Optional() _parentForm: NgForm,
        @Optional() _parentFormGroup: FormGroupDirective,
        _defaultErrorStateMatcher: ErrorStateMatcher,
    ) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
        this.orgCtrl = new FormControl();
        this.searchResults$ = this.orgCtrl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            filter(name => {
                const res = typeof name === 'string';
                if (!res) {
                    this.onChange(name);
                    this._onChangeNull = false;
                } else {
                    if (!this._onChangeNull) {
                        this.onChange(null);
                        this._onChangeNull = true;
                    }
                }
                return res;
            }),
            tap(() => this.searching = true),
            switchMap((name) => this.ds.readOrganizations(0, 3, name ? new Filter({ name }) : null)),
            tap(() => this.searching = false),
            map(dp => sortBy(dp.data, 'name')),
            finalize(() => this.searching = false),
            retry(),
        );
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnDestroy(): void {
        this.stateChanges.complete();
    }

    ngDoCheck(): void {
        if (this.ngControl) {
            this.updateErrorState();
        }
    }

    displayOrg(org: Organization): string {
        if (!org) {return '';}
        if (org.name && org.number) {
            return  org.name + ', ' + org.number;
        }

        return org.name ? org.name : org.number ? org.number : '';
    }

    onContainerClick(event: MouseEvent): void { }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    setDescribedByIds(ids: string[]): void {
        this.describedBy = ids.join(' ');
    }

    writeValue(obj: any): void {
        this.value = obj;
    }

}
