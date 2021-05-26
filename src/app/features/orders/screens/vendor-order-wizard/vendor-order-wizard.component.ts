import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import assign from 'lodash-es/assign';
import invert from 'lodash-es/invert';
import union from 'lodash-es/union';
import sumBy from 'lodash-es/sumBy';
import cloneDeep from 'lodash-es/cloneDeep';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, merge, Observable, of, Subject, combineLatest } from 'rxjs';
import { filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import {
    Organization, UserGroup, UserPreference, UserProfile, VendorOrder, VendorOrderCode, EntityState,
    VendorOrderRoutingType, VendorOrderShipDestType, VendorOrderType, VerificationDataType, VendorOrderStatus, VendorOrderPaymentType, ChaseTransaction, VendorOrderBillTo
} from '../../../../common/models';
import { SessionService } from '../../../session/services';
import { OrdersService } from '../../services/orders.service';
import { AppbarService } from '../../../../common';
import { CustomerOrdersService } from '../../../customer-orders/services/customer-orders.service';
import { OrganizationsAddDialogComponent } from '../../../organizations/components/organizations-add-dialog/organizations-add-dialog.component';
import { OrganizationsDataService } from '../../../organizations/services/organizations.data.service';

@Component({
    selector: 'rp-vendor-order-wizard',
    templateUrl: './vendor-order-wizard.component.html',
    styleUrls: ['./vendor-order-wizard.component.scss']
})
export class VendorOrderWizardComponent implements OnInit, OnDestroy {

    private _order: VendorOrder;
    private _disposed$ = new Subject();
    private _orderShipping: VendorOrder;
    private _reload$ = new Subject();
    private userPreference: UserPreference;
    private selectedOrganization$ = new BehaviorSubject<Organization>(null);

    public cancelButtonText = 'Cancel';
    public editState$ = new BehaviorSubject<'create' | 'edit'>('create');
    public form: FormGroup;
    // public loading$: Observable<boolean>;
    public isSaveVisible = true;
    public stepIndex = 0;
    public routingTypes = Object.entries(VendorOrderRoutingType);
    public vendorOrderCodes = Object.entries(VendorOrderCode);
    public vendorOrderTypes = Object.entries(VendorOrderType);
    public paymentTypes = Object.entries(VendorOrderPaymentType);
    public vendorOrderShipDestTypes = Object.entries(VendorOrderShipDestType);
    public vendorOrderBillTo = Object.entries(VendorOrderBillTo);
    public vendorOrderBillTos = invert(VendorOrderBillTo);
    public verificationDataTypes = Object.entries(VerificationDataType);
    public VendorOrderShipDestType = invert(VendorOrderShipDestType);
    public showShippingCheckBox: boolean;
    public inGroup = UserProfile.inGroup;
    public ctx$: Observable<{
        loading: boolean,
        profile: UserProfile,
        editState: string
    }>;
    public isDisabled: boolean = true;

    @ViewChild('stepper') stepper: MatStepper;

    constructor(
        private appbar: AppbarService,
        private fb: FormBuilder,
        private location: Location,
        private ordersService: OrdersService,
        private sessionService: SessionService,
        private route: ActivatedRoute,
        private customerOrdersService: CustomerOrdersService,
        private organizationDS: OrganizationsDataService,
        private _dialog: MatDialog
    ) {

        this.appbar.registerIcon({
            name: 'back',
            icon: 'arrow_back',
            callback: () => {
                this.appbar.selectByName('menu');
                this.location.back();
            }
        });

        this.ctx$ = combineLatest(
            this.editState$,
            this.ordersService.isLoading$,
            this.sessionService.userProfile$
        ).pipe(
            map(([editState, loading, profile]) => ({ editState, loading, profile }))
        );

        console.log('paymentTypes: ', this.paymentTypes);

        // Not in step
        // id: '',
        // customer_order_ids: this.fb.array([]),
        // total_price: [0]
        this.form = this.fb.group({
            step1: this.fb.group({
                routing: this.fb.group({
                    type: [null, [Validators.required]],
                    trade_in_enclosed: false
                }),
                id: [null],
                purchase_number: [null, [Validators.pattern('[0-9]{6,7}')]],
                office_number: [null, [Validators.required, Validators.pattern('[0-9]{4,4}')]],
                rep_name: [null, [Validators.required]],
                org: [null, [Validators.required]],
                type: [null, [Validators.required]],
                code: VendorOrderCode.SOFD,
                other_code: null,
                date_mailed: null,
                request_ship_date: [null, [Validators.required]],
                event_date: null,
                ceremony_date: null,
                champ_short: false,
            }),
            step2: this.fb.group({
                bill_to: ['', []],
                account_number: ['', []],
                account_name: ['', []],
                tax_exempt: [false, []],
                ship_address: ['', [Validators.required]],
                ship_name: ['', [Validators.required]],
                ship_city: ['', [Validators.required]],
                ship_state: ['', [Validators.required]],
                ship_zip: ['', [Validators.required]],
                ship_attention: '',
                ship_phone: ['', [Validators.required]],
                ship_dest_type: [null, [Validators.required]],
            }),
            step3: this.fb.group({
                count_of_orders: [null, [Validators.pattern('[0-9]{1,10}')]],
                instructions: '',
                verification: this.fb.group({
                    type: this.fb.control(VerificationDataType.NET, [Validators.required]),
                    cpa: false,
                    out_of_territory: false
                }),
            }),
            step4: this.fb.group({
                wire_number: null,
                wire_deposit: null,
                check_number: null,
                check_deposit: null,
                payment_type: [null, [Validators.required]],
                payment_type_2: null,
                payment_type_3: null,
                payment_type_4: null,
                rep_gratis_deposit: null,
                bill_rep_office_deposit: null,
                chase_number: null,
                chase_info: null,
                chase_transactions: [[]]
            }, {
                validator: (group) => {
                    if (group.value.payment_type == VendorOrderPaymentType.Check) {
                        group.controls.wire_number.status = 'VALID';
                        group.controls.wire_number.validator = null;
                        group.controls.wire_deposit.status = 'VALID';
                        group.controls.wire_deposit.validator = null;
                        group.controls.chase_number.status = 'VALID';
                        group.controls.chase_number.validator = null;
                        group.controls.chase_transactions.status = 'VALID';
                        group.controls.chase_transactions.validator = null;
                        group.controls.check_number.validator = Validators.required;
                        group.controls.check_deposit.validator = Validators.required;
                    }

                    if (group.value.payment_type == VendorOrderPaymentType.Wire) {
                        group.controls.check_number.validator = null;
                        group.controls.check_number.status = 'VALID';
                        group.controls.check_deposit.validator = null;
                        group.controls.check_deposit.status = 'VALID';
                        group.controls.chase_number.status = 'VALID';
                        group.controls.chase_number.validator = null;
                        group.controls.chase_transactions.status = 'VALID';
                        group.controls.chase_transactions.validator = null;
                        group.controls.wire_number.validator = Validators.required;
                        group.controls.wire_deposit.validator = Validators.required;
                    }

                    if (group.value.payment_type == VendorOrderPaymentType.Chase) {
                        group.controls.check_number.validator = null;
                        group.controls.check_number.status = 'VALID';
                        group.controls.check_deposit.validator = null;
                        group.controls.check_deposit.status = 'VALID';
                        group.controls.wire_number.status = 'VALID';
                        group.controls.wire_number.validator = null;
                        group.controls.wire_deposit.status = 'VALID';
                        group.controls.wire_deposit.validator = null;
                        group.controls.chase_transactions.validator = (control) => {
                            if (control.value.length == 0) {
                                return {minLength: true};
                            }
                            return null;
                        }
                        if (group.value.chase_transactions.length == 0) {
                            group.controls.chase_transactions.errors = {minLength: true};
                            group.controls.chase_transactions.status = "INVALID";
                        }
                    }

                    if (group.value.payment_type == group.value.payment_type_2) {
                        group.controls.payment_type_2.value = null;
                    }

                    if (group.value.payment_type == group.value.payment_type_3 
                            || group.value.payment_type2 == group.value.payment_type_3) {
                        group.controls.payment_type_3.value = null;
                    }

                    if (group.value.payment_type == group.value.payment_type_4 
                            || group.value.payment_type2 == group.value.payment_type_4 
                            || group.value.payment_type3 == group.value.payment_type_4) {
                        group.controls.payment_type_4.value = null;
                    }

                    return null;
                }
            }
            )
        });

        // this.loading$ = this.ordersService.isLoading$;
        // take user profiles
        this.sessionService.userPreference$
            .pipe(takeUntil(this._disposed$), filter(userPreference => userPreference !== null))
            .subscribe(userPreference => {
                this.userPreference = userPreference;
                this.showShippingCheckBox = !!(userPreference.ship_address || userPreference.ship_attention || userPreference.ship_city
                    || userPreference.ship_dest_type || userPreference.ship_name || userPreference.ship_phone
                    || userPreference.ship_state || userPreference.ship_zip);
                if (this.form.get('step1.office_number').value ==  null) {
                    this.form.patchValue({
                        step1: {
                            office_number: userPreference?.office_number
                        }
                    });
                }
            });
    }

    ngOnInit(): void {
        // setTimeout(() => this.appbar.selectByName('back'));
        this.appbar.selectByName('back')

        // update details on route change
        merge(
            this.route.paramMap,
            this._reload$.pipe(startWith(null), map(() => this.route.snapshot.paramMap)),
        ).pipe(
            takeUntil(this._disposed$),
            switchMap(pm => {
                const id = pm.get('id');
                this.form.disable({ emitEvent: false });
                if (id && id.match(/^[0-9a-fA-F]{6,32}$/)) {
                    this.editState$.next('edit');
                    return this.ordersService.ordersByIds([id]);
                } else {
                    return of(null);
                }
            }),
            switchMap(orders => this.sessionService.userProfile$.pipe(
                map(profile => {
                    if (orders && orders.length) {
                        this.mapOrderToForms(orders[0]);
                        // read organization
                        const orgId = this.selectedOrganization$.getValue();
                        if (orders[0] && orders[0].org_id && orgId !== orders[0].org_id) {
                            this.organizationDS.readOrganization(orders[0].org_id)
                                .subscribe(org => this.selectedOrganization$.next(org));
                        }
                        setTimeout(() => {
                            if (this.editState$.value === 'edit' && this.stepper) {
                                this.stepper.steps.forEach(s => s.interacted = true);
                            }
                        }, 0);
                    }
                    if (!UserProfile.inGroup(profile?.groups ?? [], [UserGroup.OE, UserGroup.AE, UserGroup.OETL, UserGroup.CS])
                        && (this._order?.status == VendorOrderStatus.InProgress || this._order == null)) {
                        this.form.enable({ emitEvent: false });
                        this.fillShippingData();
                        this.cancelButtonText = 'Cancel';
                        this.isSaveVisible = true;
                    } else {
                        this.cancelButtonText = 'Back';
                        this.isSaveVisible = false;
                    }



                    if (this.form.get('step1.rep_name').value == null) {
                        this.form.patchValue({
                            step1: {
                                rep_name: profile?.full_name
                            }
                        });
                    }
                    this.form.get('step1.id').disable();
                })
            ))
        ).subscribe();

        this.onStepChange(null);
    }

    ngOnDestroy(): void {
        this.editState$.complete();
        this._reload$.complete();
        this._disposed$.next();
        this._disposed$.complete();
        this.appbar.degeristerIcon('back');
    }

    mapFormsToOrder(): VendorOrder {
        let order = new VendorOrder();
        order = assign(order, this._order);
        this.form.enable();
        this.form.get('step1.id').disable();
        order = assign(order, this.form.value.step2, this.form.value.step3, this.form.value.step4);
        const org: Organization = this.form.value.step1.org;
        const f1v = this.form.value.step1;
        delete f1v.org;
        order = assign(order, f1v);
        if (f1v.code == VendorOrderCode.Other) {
            order.code = f1v.other_code;
        }
        order.org_id = org.id;
        order.org_name = org.name;
        order.org_number = org.number;
        order.org_tax_rate = org.taxe_rate;
        var paymentType3 = this.form.get('step4.payment_type_3').value;
        var paymentType4 = this.form.get('step4.payment_type_4').value;
        order.additional_payment_types = [];
        if (paymentType3 != null) {
            order.additional_payment_types.push(paymentType3);

            if (paymentType4 != null) {
                order.additional_payment_types.push(paymentType4);
            }
        }
        if (this._order) {
            order.id = this._order?.id;
            order.customer_order_ids = this._order?.customer_order_ids;
            order.total_price = this._order?.total_price;
            order.status = this._order.status;
            order.create_date = this._order?.create_date;
        } else {
            order.customer_order_ids = [];
            order.status = VendorOrderStatus.InProgress;
        }
        return order;
    }

    mapOrderToForms(order: VendorOrder): void {
        this._order = order;
        if (!order) { return; }
        const org = new Organization();
        org.id = order?.org_id;
        org.name = order?.org_name;
        org.number = order?.org_number;
        let other_code = (order?.code !== VendorOrderCode.Regular
            && order?.code !== VendorOrderCode.SOFD) ? order?.code : null;

        let code = (order?.code !== VendorOrderCode.Regular
            && order?.code !== VendorOrderCode.SOFD) ? VendorOrderCode.Other : order?.code;
        this.form.patchValue({
            step1: {
                routing: order?.routing ?? {
                    type: null,
                    trade_in_enclosed: false
                },
                id: order?.id,
                purchase_number: order?.purchase_number,
                office_number: order?.office_number,
                rep_name: order?.rep_name,
                org,
                type: order?.type,
                code: code,
                other_code: other_code,
                date_mailed: order?.date_mailed,
                request_ship_date: order?.request_ship_date,
                event_date: order?.event_date,
                ceremony_date: order?.ceremony_date,
                champ_short: order?.champ_short
            },
            step2: {
                bill_to: order?.bill_to,
                account_name: order?.account_name,
                account_number: order?.account_number,
                tax_exempt: order?.tax_exempt,
                ship_address: order?.ship_address,
                ship_name: order?.ship_name,
                ship_city: order?.ship_city,
                ship_state: order?.ship_state,
                ship_zip: order?.ship_zip,
                ship_attention: order?.ship_attention,
                ship_phone: order?.ship_phone,
                ship_dest_type: order?.ship_dest_type
            },
            step3: {
                count_of_orders: order?.count_of_orders,
                instructions: order?.instructions,
                verification: order?.verification ?? {
                    type: null,
                    cpa: false,
                    out_of_territory: false,
                },
            },
            step4: {
                wire_number: order?.wire_number,
                wire_deposit: order?.wire_deposit,
                check_number: order?.check_number,
                check_deposit: order?.check_deposit,
                bill_rep_office_deposit: order?.bill_rep_office_deposit,
                rep_gratis_deposit: order?.rep_gratis_deposit,
                payment_type: order?.payment_type,
                payment_type_2: order?.payment_type_2,
                payment_type_3: order?.additional_payment_types && order?.additional_payment_types.length > 0 ? order?.additional_payment_types[0] : null,
                payment_type_4: order?.additional_payment_types && order?.additional_payment_types.length > 1 ? order?.additional_payment_types[1] : null,
                chase_number: order?.chase_number,
                chase_transactions: cloneDeep(order?.chase_transactions) ?? []
            }
        });
        this.fillShippingData();
    }

    onCancel(): void {
        this.location.back();
    }

    saveVendorOrder(): void {
        if (this.form.valid) {
            const order = this.mapFormsToOrder();
            this._order ? this.ordersService.update(order) : this.ordersService.create(order);
        }
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
        this.form.get('step1.other_code').markAsUntouched();
        this.form.get('step1.other_code').markAsPristine({ onlySelf: true });
    }

    public onSelectOrganization() {
        this._dialog.open(OrganizationsAddDialogComponent, {
            minWidth: '50vw',
            panelClass: 'rp-relative-dialog'
        }).afterClosed().subscribe(result => {
            if (result) {
                this.selectedOrganization$.next(result);
                this.form.patchValue({
                    step1: {
                        org: result
                    }
                }, { emitEvent: false });
                this.form.get('step1').markAsTouched();
            }
        });
    }

    private isAddressEmpty(): boolean {
        const shipping = this.form.value.step2;

        return !(shipping.ship_address || shipping.ship_attention || shipping.ship_city
            || shipping.ship_name || shipping.ship_phone
            || shipping.ship_state || shipping.ship_zip);
    }

    public onTabChange($event): void {
        this.fillShippingData();
    }

    get chaseAmount() {
        var sum = sumBy(this.form.get('step4.chase_transactions').value, (t: ChaseTransaction) => { 
            return t.deposit || 0; 
        });

        return sum.toFixed(2);
    }

    get paymentTypes2() {
        return this.paymentTypes.filter(pt => pt[1] !== this.form.get('step4.payment_type').value);
    }

    get paymentTypes3() {
        return this.paymentTypes.filter(pt => pt[1] !== this.form.get('step4.payment_type').value 
            && pt[1] !== this.form.get('step4.payment_type_2').value);
    }

    get paymentTypes4() {
        return this.paymentTypes.filter(pt => pt[1] !== this.form.get('step4.payment_type').value 
            && pt[1] !== this.form.get('step4.payment_type_2').value 
            && pt[1] !== this.form.get('step4.payment_type_3').value);
    }

    get totalDeposist() {
        var sum = 0;

        if (this.form.get('step4.payment_type').value == VendorOrderPaymentType.Chase 
            || this.form.get('step4.payment_type_2').value == VendorOrderPaymentType.Chase
            || this.form.get('step4.payment_type_3').value == VendorOrderPaymentType.Chase
            || this.form.get('step4.payment_type_4').value == VendorOrderPaymentType.Chase) {
            var chaseSum = sumBy(this.form.get('step4.chase_transactions').value, (t: ChaseTransaction) => { 
                return t.deposit || 0; 
            }); 

            sum += (chaseSum || 0);
        }

        if (this.form.get('step4.payment_type').value == VendorOrderPaymentType.Check 
            || this.form.get('step4.payment_type_2').value == VendorOrderPaymentType.Check
            || this.form.get('step4.payment_type_3').value == VendorOrderPaymentType.Check
            || this.form.get('step4.payment_type_4').value == VendorOrderPaymentType.Check) {
            sum += (this.form.get('step4.check_deposit').value || 0);
        }

        if (this.form.get('step4.payment_type').value == VendorOrderPaymentType.Wire 
            || this.form.get('step4.payment_type_2').value == VendorOrderPaymentType.Wire
            || this.form.get('step4.payment_type_3').value == VendorOrderPaymentType.Wire
            || this.form.get('step4.payment_type_4').value == VendorOrderPaymentType.Wire) {
            sum += (this.form.get('step4.wire_deposit').value || 0);
        }

        if (this.form.get('step4.payment_type').value == VendorOrderPaymentType["Rep Gratis"] 
            || this.form.get('step4.payment_type_2').value == VendorOrderPaymentType["Rep Gratis"] 
            || this.form.get('step4.payment_type_3').value == VendorOrderPaymentType["Rep Gratis"] 
            || this.form.get('step4.payment_type_4').value == VendorOrderPaymentType["Rep Gratis"] ) {
            sum += (this.form.get('step4.rep_gratis_deposit').value || 0);
        }

        if (this.form.get('step4.payment_type').value == VendorOrderPaymentType["Bill Rep Office @ NET"]
            || this.form.get('step4.payment_type_2').value == VendorOrderPaymentType["Bill Rep Office @ NET"]
            || this.form.get('step4.payment_type_3').value == VendorOrderPaymentType["Bill Rep Office @ NET"]
            || this.form.get('step4.payment_type_4').value == VendorOrderPaymentType["Bill Rep Office @ NET"]) {
            sum += (this.form.get('step4.bill_rep_office_deposit').value || 0);
        }

        return sum.toFixed(2);
    }

    public addTransaction() {
        var current_transactions: ChaseTransaction[] = this.form.get('step4.chase_transactions').value;
        var chase_transactions = union([], current_transactions);
        chase_transactions.push(new ChaseTransaction());
        this.form.get('step4.chase_transactions').setValue(chase_transactions);
    }

    public deleteTransaction(index: number) {
        var current_transactions: ChaseTransaction[] = this.form.get('step4.chase_transactions').value;
        var chase_transactions = union([], current_transactions);
        chase_transactions.splice(index, 1);
        this.form.get('step4.chase_transactions').setValue(chase_transactions);
    }

    fillShippingData() {
        this.form.get('step2.ship_address').enable();
        this.form.get('step2.ship_name').enable();
        this.form.get('step2.ship_city').enable();
        this.form.get('step2.ship_state').enable();
        this.form.get('step2.ship_zip').enable();
        this.form.get('step2.ship_phone').enable();

        if (this.form.get('step2.ship_dest_type')?.value === VendorOrderShipDestType.Office) {
            this.autofillShippingByUserPrefsData();
        }
        if (this.form.get('step2.ship_dest_type')?.value === VendorOrderShipDestType.School) {
            this.autofillShippingByOrgData();
        }
        if (this.form.get('step2.ship_dest_type')?.value === VendorOrderShipDestType.Customer) {
            this.form.get('step2').patchValue({
                ship_address: '',
                ship_name: '',
                ship_city: '',
                ship_state: '',
                ship_zip: '',
                ship_attention: '',
                ship_phone: '',
                ship_dest_type: VendorOrderShipDestType.Customer
            });
            this.form.get('step2.ship_address').disable();
            this.form.get('step2.ship_name').disable();
            this.form.get('step2.ship_city').disable();
            this.form.get('step2.ship_state').disable();
            this.form.get('step2.ship_zip').disable();
            this.form.get('step2.ship_phone').disable();
        }
    }

    private autofillShippingByOrgData(): void {
        const org = this.selectedOrganization$.getValue();
        // auto fill address
        if (org && this.getOrganizationId() === org.id) {
            this.form.get('step2').patchValue({
                ship_address: org.address || '',
                ship_name: org.name || '',
                ship_city: org.city || '',
                ship_state: org.state || '',
                ship_zip: org.zip || '',
                ship_attention: '',
                ship_phone: '',
                ship_dest_type: VendorOrderShipDestType.School
            });
        }
    }

    private autofillShippingByUserPrefsData(): void {
        this._orderShipping = Object.assign({}, this.form.value.step2);
        const obj = Object.assign(this._orderShipping, this.userPreference);

        // set user settings
        this.form.get('step2').patchValue({
            ship_address: obj.ship_address || '',
            ship_name: obj.ship_name || '',
            ship_city: obj.ship_city || '',
            ship_state: obj.ship_state || '',
            ship_zip: obj.ship_zip || '',
            ship_attention: obj.ship_attention || '',
            ship_phone: obj.ship_phone || '',
            ship_dest_type: VendorOrderShipDestType.Office
        });
    }

    private getOrganizationId(): string {
        const org: Organization = this.form.value.step1.org;
        return org?.id;
    }

    public onStepChange($event: any): void {
        if ($event) {
            this.stepIndex = $event?.selectedIndex;
        }

        const ship_dest_type = this.form.value.step2.ship_dest_type;
        if (this.stepIndex === 1 && !!ship_dest_type &&
            (ship_dest_type === VendorOrderShipDestType.School) && this.isAddressEmpty()) {
            this.autofillShippingByOrgData();
        }
    }
}
