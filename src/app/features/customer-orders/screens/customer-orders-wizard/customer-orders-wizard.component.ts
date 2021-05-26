import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import cloneDeep from 'lodash-es/cloneDeep';
import get from 'lodash-es/get';
import merge from 'lodash-es/merge';
import { BehaviorSubject, Observable, of, Subject, queueScheduler } from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil, tap, debounceTime, debounce } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import {
    Answer, AppbarService,
    Constraint,
    Constraints, CustomerOrder, CustomerOrderStatus, CustomerOrderDetails, Person, EntityState,
    Option, Organization, Question, questionControlFormlyType, QuestionControls, trackBy, VendorOrderStatus, Customer, VendorOrder, CustomerPaymentType, CustomerDiscountTypes
} from '../../../../common';
import { ProductPrice } from '../../../../common/models/ProductPrice';
import { SelectionPart } from '../../../../common/models/SelectionPart';
import { UserGroup, UserProfile } from '../../../../common/models/UserProfile';
import { OrganizationsDataService } from '../../../organizations/services/organizations.data.service';
import { ProductsDataService } from '../../../products';
import { SessionService } from '../../../session/services/session.service';
import { CustomerOrdersService } from '../../services/customer-orders.service';
import { OrganizationsAddDialogComponent } from '../../../organizations/components/organizations-add-dialog/organizations-add-dialog.component';
import { OrdersDataService } from 'src/app/features/orders/services';

@Component({
    selector: 'rp-customer-orders-wizard',
    templateUrl: './customer-orders-wizard.component.html',
    styleUrls: ['./customer-orders-wizard.component.scss']
})
export class CustomerOrdersWizardComponent implements OnInit, OnDestroy {

    private _createState$ = new Subject<EntityState>();
    private _disposed$ = new Subject();
    private _questionQuestionGroupMap: { [questionId: string]: string };
    private _reload$ = new Subject();
    private _vendor_order_id: string;
    private _questionsOrder: any = {};

    private subscription$;

    public cancelButtonText = 'Cancel';
    public details: CustomerOrderDetails;
    public vendorOrder: VendorOrder;
    public org: Organization;
    public tax_rate: number;
    public handling_fee: number;
    public tax_fixed: boolean = false;
    public form: FormGroup;
    public state$: Observable<EntityState>;
    public paymentTypes = Object.entries(CustomerPaymentType);
    public discountTypes = Object.entries(CustomerDiscountTypes);
    public paymentTypeTitles = CustomerPaymentType;
    public editState$ = new BehaviorSubject<'create' | 'edit'>('create');
    public error$: Observable<any>;
    public isSaveVisible = true;
    public stepIndex = 0;
    public trackById = trackBy('id');
    public formlyForm: FormGroup;
    public formlyModel: any = {};
    public formlyOptions: { [groupId: string]: FormlyFormOptions };
    public formlySteps: { [groupId: string]: { label: string, fields: FormlyFieldConfig[] } };

    @ViewChild('stepper') stepper: MatStepper;
    @HostListener('selectionChange', ['$event'])
    selectionChanged($event): void {
        this.stepIndex = $event?.selectedIndex;
        const stepId = this.stepper._getStepContentId($event.selectedIndex);
        const stepElement = document.getElementById(stepId);
        // if (stepElement) {
        //     setTimeout(() => {
        //         stepElement.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
        //     }, 500);
        // }
    }

    constructor(
        private appbar: AppbarService,
        private mediaObserver: MediaObserver,
        private fb: FormBuilder,
        private location: Location,
        private ordersService: CustomerOrdersService,
        private productsDataService: ProductsDataService,
        private route: ActivatedRoute,
        private sessionService: SessionService,
        private _dialog: MatDialog,
        private orgDataService: OrganizationsDataService,
        private vendorOrdersDataService: OrdersDataService
    ) {
        this.appbar.registerIcon({
            name: 'back',
            icon: 'arrow_back',
            callback: () => {
                this.appbar.selectByName('menu');
                this.location.back();
            }
        });

        this.form = fb.group({
            customer: fb.group({
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                address: [''],
                apt_num: [''],
                city: [''],
                state: [''],
                zip: ['', [Validators.pattern('[0-9]{3,6}')]],
                phone: ['', [Validators.required, Validators.pattern('[0-9]{10,13}')]],
                email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]$')]],
                additional_phone: ['', [Validators.pattern('[0-9]{10,13}')]],
                additional_email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]$')]],

                order_date: [new Date(), Validators.required],
                promo_code: null,
                design_number: null
            }),
            pricing: fb.group({
                prod_ttl: null,
                discount: fb.group({
                    name: '',
                    value: null
                }),
                pkg_hdl: null,
                taxes: null,
                amt_paid: null
            }),
            payment: fb.group({
                cash: null,
                check_money_order: null,
                check_number: null,
                deposit_only: null,
                fully_prepaid: null,
                payment_count: 3,
                wire_number: null,
                payment_type: null,
                rep_gratis_amount: null,
                chase_rep_gratis_amount: null,
                check_rep_gratis_amount_cust: null,
                chase_rep_gratis_amount_cust: null
            }),
        });
        this.formlyForm = fb.group({});

        this.error$ = this.ordersService.error$.pipe(
            map(error => get(error, 'error.error.message', 'Unknown error'))
        );
        this.state$ = this.editState$.pipe(
            startWith(this.editState$.value),
            switchMap(state => state === 'create'
                ? this._createState$.asObservable().pipe(startWith(EntityState.Progress))
                : this.ordersService.stateDetails$));
    }

    ngOnInit(): void {
        this.appbar.selectByName('back');
        // update details on route change
        this.subscription$ = merge(
            this.route.paramMap,
            this._reload$.pipe(startWith(null), map(() => this.route.snapshot.paramMap))
        ).pipe(
            takeUntil(this._disposed$),
            switchMap(pm => {
                const id = pm.get('id');
                this.form.disable({ emitEvent: false });
                if (id && id.match(/^[0-9a-fA-F]{9,32}$/)) {
                    this.editState$.next('edit');
                    return this.ordersService.orderWithDetails(id);
                } else {
                    this.editState$.next('create');
                    this._createState$.next(EntityState.Progress);
                    if (this.route.snapshot.queryParamMap.has('vendor_order_id')) {
                        this._vendor_order_id = this.route.snapshot.queryParamMap.get('vendor_order_id');
                    }
                    // TODO hadrcoded product id
                    return this.productsDataService.readSalesProduct('1').pipe(
                        map(product => ({
                            order: null,
                            product
                        } as CustomerOrderDetails)),
                        tap(() => this._createState$.next(EntityState.Data)),
                        catchError((error) => (this._createState$.next(EntityState.Error), of(null)))
                    );
                }
            }),
            switchMap(details => this.sessionService.userProfile$.pipe(
                map(profile => {
                    if (details) {
                        this.mapOrderToForm(details);
                        setTimeout(() => {
                            if (this.editState$.value === 'edit' && this.stepper) {
                                this.stepper.steps.forEach(s => s.interacted = true);
                            }
                        }, 0);
                        if (!UserProfile.inGroup(profile?.groups ?? [], [UserGroup.OE, UserGroup.AE, UserGroup.OETL, UserGroup.CS])
                            && (this.details.order?.vendor_order_status === VendorOrderStatus.InProgress
                                || this.details.order?.vendor_order_status === VendorOrderStatus.Incomplete
                                || this.details.order?.vendor_order_status == null)) {
                            this.form.enable({ emitEvent: false });
                            this.formlyForm.enable({ emitEvent: false });
                            this.cancelButtonText = 'Cancel';
                            this.isSaveVisible = true;
                        } else {
                            this.cancelButtonText = 'Back';
                            this.isSaveVisible = false;
                        }
                    }
                })
            ))
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.appbar.resetTitle();
        this._disposed$.next(null);
        this._disposed$.complete();
        this._reload$.next(null);
        this._reload$.complete();
        this.subscription$.unsubscribe();
        this.appbar.degeristerIcon('back');
    }

    get reviewGroupValues(): { group: string, values: { question: string, value: string }[] }[] {
        const res = [];
        const qv = this.formlyForm.value;
        const questionsMap = this.details?.product?.questions.reduce((acc, cur) => (acc[cur.id] = cur, acc), {});
        for (const g of (this.details?.product?.question_groups ?? [])) {
            const groupInfo: { group: string, values: { question: string, value: string }[] } = {
                group: g.name,
                values: []
            };
            this._questionsOrder[g.id].forEach(qid => {
                if (!!qv[g.id][qid]) {
                    groupInfo.values
                        .push({ 
                            question: questionsMap[qid]?.name, 
                            value: typeof qv[g.id][qid] === 'object' ? qv[g.id][qid].name : qv[g.id][qid] 
                        })
                }
            });
            if (groupInfo.values.length > 0) {
                res.push(groupInfo);
            }
        }

        return res;
    }

    get productTotal(): number {
        let res = 0;
        const questionsFormValue = this.formlyForm.value;
        Object.keys(questionsFormValue).forEach(k => res += questionsFormValue[k]?.price ?? 0);
        return res;
    }

    get subtotal(): number {
        const formValue = this.form.value;
        return this.productTotal + (isNaN(formValue.pricing.pkg_hdl) ? 0 : formValue.pricing.pkg_hdl);
    }

    get total(): number {
        return this.subtotal + this.form.value.pricing.taxes;
    }

    get balDue(): number {
        const formValue = this.form.value;
        return this.total + (isNaN(formValue.pricing.discount.value) ? 0 : formValue.pricing.discount.value)  - formValue.pricing.amt_paid;
    }

    get tax(): number {
        let tax = isNaN(this.tax_rate) ? 0 : this.subtotal * this.tax_rate / 100;
        return parseFloat(tax.toFixed(2));
    }

    mapFormToOrder(): CustomerOrder {
        const order = this.editState$.value === 'edit' ? cloneDeep(this.details.order) : new CustomerOrder();
        const formValue = this.form.value;
        const questionsFormValue = this.formlyForm.value;
        let ppid = 1;
        const pricing: ProductPrice[] = this.details.product.question_groups
            .filter(qg => questionsFormValue[qg.id].price)
            .map(qg => ({
                id: (ppid++).toString(),
                price: questionsFormValue[qg.id].price,
                question_group_id: qg.id,
                question_group_name: qg.name
            } as ProductPrice));

        if (formValue?.customer) {
            if (!order.customer) {
                order.customer = new Customer();
            }

            order.customer.first_name = formValue?.customer?.first_name;
            order.customer.last_name = formValue?.customer?.last_name;
            order.customer.organization_id = formValue?.customer?.org?.id || this.vendorOrder?.org_id;
            order.customer.organization_name = formValue?.customer?.org?.name || this.vendorOrder?.org_name;
            order.customer.organization_number = formValue?.customer?.org?.number || this.vendorOrder?.org_name;
            order.customer.address = formValue?.customer?.address;
            order.customer.apt_num = formValue?.customer?.apt_num;
            order.customer.city = formValue?.customer?.city;
            order.customer.state = formValue?.customer?.state;
            order.customer.zip = formValue?.customer?.zip;
            order.customer.phone = formValue?.customer?.phone;
            order.customer.additional_phone = formValue?.customer?.additional_phone;
            order.customer.email = formValue?.customer?.email;
            order.customer.additional_email = formValue?.customer?.additional_email;

        }
        if (this.editState$.value === 'create') {
            this.sessionService.userProfile$.pipe(
                takeUntil(this._disposed$)
            ).subscribe(profile => order.owner_id = profile.id);
        }
        order.order_date = formValue?.customer?.order_date;
        let pid = 1;
        order.parts = Object.keys(questionsFormValue).reduce((acc, cur) => {
            const answers = Object.keys(questionsFormValue[cur]).reduce((ansAcc, ansCur) => {
                if (ansCur === 'price') { return ansAcc; }
                const ans = questionsFormValue[cur][ansCur];
                if (ans) {
                    ansAcc.push({
                        id: (pid++).toString(),
                        question: ansCur,
                        answer: typeof ans === 'object' ? ans.id : null,
                        value: typeof ans === 'object' ? null : ans,
                    } as SelectionPart);
                }
                return ansAcc;
            }, []);
            acc.push(...answers);
            return acc;
        }, []);
        order.payment_info = {
            cash: formValue?.payment?.deposit_only,
            check_money_order: formValue?.payment?.check_money_order,
            check_number: formValue?.payment?.check_number,
            deposit_only: formValue?.payment?.deposit_only,
            rep_gratis_amount: formValue?.payment?.rep_gratis_amount,
            chase_rep_gratis_amount: formValue?.payment?.chase_rep_gratis_amount,
            check_rep_gratis_amount_cust: formValue?.payment?.check_rep_gratis_amount_cust,
            chase_rep_gratis_amount_cust: formValue?.payment?.check_rep_gratis_amount_cust,
            fully_prepaid: formValue?.payment?.fully_prepaid,
            payment_count: formValue?.payment?.payment_count,
            wire_number: formValue?.payment?.wire_number,
            payment_type: formValue?.payment?.payment_type
        };
        // Discount pricing
        for (const name of Object.keys(this.form.value.pricing)) {
            if (name.startsWith('custom') || name.startsWith('discount')) {
                if (formValue.pricing.discount.value) {
                    pricing.push({
                        id: (ppid++).toString(),
                        price: formValue.pricing.discount.value,
                        title: 'discount:' + formValue.pricing.discount.name,
                        question_group_id: null,
                        question_group_name: null
                    } as ProductPrice);
                }
            } else {
                if (formValue.pricing[name]) {
                    pricing.push({
                        id: (ppid++).toString(),
                        price: formValue.pricing[name],
                        title: name,
                        question_group_id: null,
                        question_group_name: null
                    } as ProductPrice);
                }
            }
        }
        order.pricing = pricing;
        order.total_price = this.total;
        order.promo_code = formValue?.customer?.promo_code;
        order.design_number = formValue?.customer?.design_number;
        order.vendor_order_id = order.vendor_order_id ?? this._vendor_order_id;
        order.vendor_order_status = order.vendor_order_status ?? VendorOrderStatus.InProgress;
        order.status = this.form.valid && this.formlyForm.valid ? CustomerOrderStatus.Complete : CustomerOrderStatus.Incomplete;
        return order;
    }

    mapOrderToForm(details: CustomerOrderDetails): void {
        if (details?.order?.vendor_order_id) {
            this.appbar.title = 'Envelope: ' + details?.order?.vendor_order_id;
            this._vendor_order_id = details?.order?.vendor_order_id;
        } else {
            if (this._vendor_order_id) { this.appbar.title = 'Envelope: ' + this._vendor_order_id; }
        }
        this.setTaxRateFromOrganization();
        const getValue = (id: string): SelectionPart => {
            return details?.order?.parts?.find(p => p.question === id) ?? null;
        };
        const getPrice = (gid?: string): number => {
            return details?.order?.pricing?.find(p => p.question_group_id === gid)?.price ?? null;
        };
        this.details = details;
        if (details.product) {
            /* Formly */
            this._questionQuestionGroupMap = details.product.questions.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.group_id }), {});
            this.formlySteps = details.product.question_groups.reduce((acc, qg) => {
                this._questionsOrder[qg.id] = [];
                const fields: FormlyFieldConfig[] = [];
                fields.push({
                    fieldGroupClassName: 'rp-flex rp-flex-align-items-center rp-flex-justify-content-space-between',
                    fieldGroup: [
                        {
                            template: `<h3 class="rp-flex-grow">${qg.name}</h3>`
                        },
                        {
                            key: qg.id + '.price',
                            type: 'input',
                            defaultValue: getPrice(qg.id),
                            templateOptions: {
                                appearance: 'outline',
                                addonLeft: {
                                    text: '$',
                                },
                                label: 'Price',
                                type: 'number'
                            },
                            parsers: [(val) => (this.formlyForm.get(qg.id + '.price').setValue(val), val)]
                        }
                    ]
                } as FormlyFieldConfig);
                details.product.questions.filter(q => q.group_id === qg.id).forEach(q => {
                    this._questionsOrder[qg.id].push(q.id);
                    const ftm = questionControlFormlyType.hasOwnProperty(q.control)
                        ? questionControlFormlyType[q.control]
                        : questionControlFormlyType[QuestionControls.TEXT_INPUT];
                    const part = getValue(q.id);
                    let value = null;
                    if (ftm.hasOptions && part?.answer) {
                        value = q.answers.length > 0
                            ? details.product.options.find(o => o.id === part?.answer)
                            : (part?.value ?? null);
                    } else if (part?.value) {
                        value = part?.value ?? null;
                    } else {
                        if (q.answers.length > 0) {
                            const daid = q.answers.find(ans => ans.default);
                            if (daid) {
                                value = details.product.options.find(o => o.id === daid.id);
                            }
                        }
                    }
                    const fc: FormlyFieldConfig = {
                        className: 'rp-order-input',
                        key: qg.id + '.' + q.id,
                        type: ftm.formlyType,
                        defaultValue: value,
                        templateOptions: {
                            appearance: 'outline',
                            // This one is for custom radio buttons, don't dare to remove it :)
                            defaultValue: value,
                            description: q.extra_note ?? '',
                            options: ftm.hasOptions ? this.optionsForQuestion(q.answers ?? []).map(o => ({ value: o, label: o.name })) : [],
                            label: q.name,
                            required: coerceBooleanProperty(q.required),
                            change: (field, $event) => {
                                // Temporary hack for Stone cuts (when 47th Stone cut is selected then 49th should be null)
                                if (field.key.toString().split('.')[1] == '47') {
                                    this.formlyForm.get('4.49').setValue(null);
                                }
                                // Temporary hack for Stone cuts (when 49th Stone cut question is selected then 47th should be null)
                                if (field.key.toString().split('.')[1] == '49') {
                                    this.formlyForm.get('4.47').setValue(null);
                                }

                                // Temporary hack for Stone colors (when 43th Stone color question is selected then 44th should be null)
                                if (field.key.toString().split('.')[1] == '43' && this.formlyForm.get('4.44').value?.id !== '64') {
                                    this.formlyForm.get('4.44').setValue(null);
                                }

                                // Temporary hack for Stone colors (when 44th Stone color question is selected then 43th should be null)
                                if (field.key.toString().split('.')[1] == '44' && this.formlyForm.get('4.44').value?.id !== '64') {
                                    this.formlyForm.get('4.43').setValue(null);
                                }
                            }
                        }
                    };
                    this._applyConstraintsToConfig(fc, q.constraints);
                    fields.push(fc);
                });
                return { ...acc, [qg.id]: { label: qg.name, fields } };
            }, {});
            this.formlyForm = this.fb.group(details.product.question_groups
                .reduce((acc, curr) => ({ ...acc, [curr.id]: this.fb.group({}) }), {}));
            this.formlyOptions = details.product.question_groups
                .reduce((acc, curr) => ({ ...acc, [curr.id]: {} as FormlyFormOptions }), {});
            this.formlyForm.disable({ emitEvent: false });
            /* /Formly */
        }

        if (details?.order) {
            this.form.patchValue({
                customer: {
                    first_name: details.order?.customer?.first_name || '',
                    last_name: details.order?.customer?.last_name || '',
                    address: details.order?.customer?.address || '',
                    apt_num: details.order?.customer?.apt_num || '',
                    city: details.order?.customer?.city || '',
                    state: details.order?.customer?.state || '',
                    zip: details.order?.customer?.zip || '',
                    phone: details.order?.customer?.phone || '',
                    email: details.order?.customer?.email || '',
                    additional_phone: details.order?.customer?.additional_phone || '',
                    additional_email: details.order?.customer?.additional_email || '',
                    order_date: new Date(details.order?.order_date),
                    promo_code: details.order?.promo_code,
                    design_number: details.order?.design_number
                },
                pricing: details?.order?.pricing?.filter(p => !p.question_group_id).reduce((acc, curr) => {
                    if (curr.title.startsWith('discount:') || curr.title.startsWith('custom:')) {
                        acc.discount = {
                            name: curr.title.includes('custom') ? curr.title.replace(/^custom:/i, '') : curr.title.replace(/^discount:/i, ''),
                            value: curr.price
                        };
                    } else {
                        acc[curr.title] = curr.price;
                    }
                    return acc;
                }, {} as any),
                payment: {
                    cash: details.order.payment_info?.cash,
                    check_money_order: details.order.payment_info?.check_money_order,
                    check_number: details.order.payment_info?.check_number,
                    deposit_only: details.order.payment_info?.deposit_only,
                    fully_prepaid: details.order.payment_info?.fully_prepaid,
                    payment_count: details.order.payment_info?.payment_count,
                    wire_number: details.order.payment_info?.wire_number,
                    payment_type: details.order.payment_info?.payment_type,
                    rep_gratis_amount: details.order.payment_info?.rep_gratis_amount
                }
            });
        }
    }

    onCancel(): void {
        this.location.back();
    }

    onReload(): void {
        this._reload$.next();
    }

    setTaxRateFromOrganization() {
        if (this._vendor_order_id) {
            this.vendorOrdersDataService.readOrder(this._vendor_order_id)
                .subscribe(vo => {
                    this.vendorOrder = vo;
                    this.orgDataService.readOrganization(this.vendorOrder.org_id).subscribe(org => {
                        this.org = org;
                        this.tax_rate = this.org ? parseFloat(org.taxe_rate) : 0.0;
                        this.handling_fee = this.org ? parseFloat(org.handling_fee) : null;
                        this.form.get('pricing.pkg_hdl').setValue(isNaN(this.handling_fee) ? null : this.handling_fee);
                        this.tax_fixed = this.taxValidation();
                        this.setTaxes();
                    });
                });
        }
    }

    setTaxes() {
        if (!this.tax_fixed) {
            this.form.patchValue({
                pricing: {
                    taxes: this.tax
                }
            });
        }
    }

    setTaxesAsFixed() {
        this.tax_fixed = true;
    }

    optionsForQuestion(answers: Answer[] = []): Option[] {
        const oids = answers.map(a => a.option_id);
        return this?.details?.product?.options?.filter(o => oids.includes(o.id));
    }

    questionsInGroup(id: string): Question[] {
        return this?.details?.product?.questions?.filter(q => q.group_id === id) ?? [];
    }

    saveCustomerOrder(): void {
        const order = this.mapFormToOrder();
        console.log('order: ', order);
        this.editState$.value === 'edit' ?
            this.ordersService.update(order, order.vendor_order_id)
            : this.ordersService.create(order, order.vendor_order_id);
    }

    public hasError(field: string, error: string): boolean {
        return this.form.get(field).getError(error) && this.form.get(field).touched;
    }

    _applyConstraintsToConfig(fc: FormlyFieldConfig, constraints: Constraint[]): void {
        if (!constraints || !constraints.length) { return; }
        type hideExpressionFn = (model: any, formState: any) => boolean;
        const hideExpressions: hideExpressionFn[] = [];
        for (const c of constraints) {
            switch (c.name) {
                case Constraints.ShowIfQuestionSelectionIs:
                    const cValue: { question: string[], part: string[] } =
                        JSON.parse(c.values[Constraints.ShowIfQuestionSelectionIs]);
                    hideExpressions.push((model: any, formState: any) => !cValue.question.every(
                        q => cValue.part.includes((get(model, `${this._questionQuestionGroupMap[q]}.${q}`) ?? { id: -1 }).id)
                    ));
                    break;
                default:
                    break;
            }
        }
        if (hideExpressions.length) {
            fc.hideExpression = (model: any, formState: any) => hideExpressions.some(hs => hs(model, formState));
        }
    }

    public taxValidation(): boolean {
        return this.form.get('pricing.taxes').value !== this.tax;
    }

    public onSelectOrganization() {
        this._dialog.open(OrganizationsAddDialogComponent, {
            minWidth: '50vw',
            panelClass: 'rp-relative-dialog'
        }).afterClosed().subscribe(result => {
            if (result) {
                this.form.patchValue({
                    customer: {
                        org: result
                    }
                }, { emitEvent: false });
                this.form.markAsTouched();
            }
        });
    }
}
