import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, DoCheck, HostListener, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import sortBy from 'lodash-es/sortBy';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, finalize, map, retry, startWith, switchMap, tap } from 'rxjs/operators';
import { Customer, Filter } from '../../../../common/models';
import { CustomersDataService } from '../../services/customers.data.service';

class CustomerPickerComponentBase {
    constructor(
        public _defaultErrorStateMatcher,
        public _parentForm,
        public _parentFormGroup,
        public ngControl) { }
}

const _CustomerPickerComponentBase = mixinErrorState(CustomerPickerComponentBase);

@Component({
    selector: 'rp-customer-picker',
    templateUrl: './customer-picker.component.html',
    styleUrls: ['./customer-picker.component.scss'],
    providers: [
        { provide: MatFormFieldControl, useExisting: CustomerPickerComponent }
    ]
})
export class CustomerPickerComponent extends _CustomerPickerComponentBase
    implements OnDestroy, DoCheck, ControlValueAccessor, MatFormFieldControl<Customer> {

    static nextId = 0;

    private _onChangeNull = true;
    private _disabled: boolean;
    private _placeholder: string;
    private _required: boolean;

    controlType = 'rp-customer-picker';
    get empty(): boolean { return !this.customerCtrl.value; }
    focused = false;
    customers$: Observable<Customer[]>;
    customerCtrl: FormControl;
    searching = false;
    searchResults$: Observable<Customer[]>;
    stateChanges = new Subject<void>();

    @HostListener('attr.aria-describedby')
    describedBy = '';
    @HostListener('id')
    id = `rp-customer-picker-${CustomerPickerComponent.nextId++}`;
    @HostListener('class.rp-customer-picker-floating')
    get shouldLabelFloat(): boolean { return this.focused || !this.empty; }

    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.customerCtrl.disable() : this.customerCtrl.enable();
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
    get value(): Customer | null { return this.customerCtrl.value instanceof Customer ? this.customerCtrl.value : null; }
    set value(value: Customer | null) {
        this.customerCtrl.setValue(value);
        this.stateChanges.next();
    }

    onChange: any = (_: any) => { };
    onTouched: any = () => { };

    constructor(
        private ds: CustomersDataService,
        @Optional() @Self() ngControl: NgControl,
        @Optional() _parentForm: NgForm,
        @Optional() _parentFormGroup: FormGroupDirective,
        _defaultErrorStateMatcher: ErrorStateMatcher,
    ) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
        this.customerCtrl = new FormControl();
        this.searchResults$ = this.customerCtrl.valueChanges.pipe(
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
            switchMap((name) => this.ds.readCustomers(0, 5, name ? new Filter({ search: name }) : null)),
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

    displayCustomer(customer: Customer): string {
        return customer && customer.id ? customer.last_name + ' ' + customer.first_name : '';
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
