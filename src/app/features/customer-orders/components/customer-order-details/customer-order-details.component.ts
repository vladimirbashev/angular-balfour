import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import get from 'lodash-es/get';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { trackBy } from 'src/app/common';
import { CustomerOrder, CustomerOrderDetails, EntityState } from '../../../../common/models';
import { UserProfile } from '../../../../common/models/UserProfile';
import { CustomerOrdersService } from '../../../customer-orders/services/customer-orders.service';
import { SessionService } from '../../../session/services/session.service';

type PricingDetails = {
    prices: {
        title: string,
        price: number,
    }[],
    total: number
};

@Component({
    selector: 'rp-customer-order-details',
    templateUrl: './customer-order-details.component.html',
    styleUrls: ['./customer-order-details.component.scss']
})
export class CustomerOrderDetailsComponent implements OnInit, OnChanges {

    private _customerOrderId$ = new BehaviorSubject<string>(null);
    private _pricingTitles = {
        prod_ttl: 'Prod TTL',
        pkg_hdl: 'PKG/HDL',
        taxes: 'Taxes',
        amt_paid: 'Amt. Paid'
    };

    @Input() order: CustomerOrder;

    public ctx$: Observable<{
        orderDetails: CustomerOrderDetails,
        stateDetails: EntityState,
        pricingDetails: PricingDetails,
        profile: UserProfile
    }>;
    public error$: Observable<any>;
    public orderDetails$: Observable<CustomerOrderDetails>;
    public pricingDetails$: Observable<PricingDetails>;
    public inGroup = UserProfile.inGroup;
    public isLoading$: Observable<boolean>;
    public stateDetails$: Observable<EntityState>;

    public trackById = trackBy('id');

    constructor(
        private customerOrdersService: CustomerOrdersService,
        private router: Router,
        private sessionService: SessionService,
    ) { }

    ngOnInit(): void {
        this.error$ = this.customerOrdersService.errorDetails$.pipe(
            map(error => get(error, 'error.error.message', 'Unknown error'))
        );
        this.orderDetails$ = this.customerOrdersService.orderDetails$;
        this.stateDetails$ = this.customerOrdersService.stateDetails$;
        this.isLoading$ = this.customerOrdersService.isLoading$;
        this.pricingDetails$ = this.orderDetails$.pipe(
            map(details => {
                const pd: PricingDetails = {
                    prices: [],
                    total: 0
                };
                if (details && details?.product) {
                    const pricings = details?.order?.pricing ?? [];
                    const getPrice = (gid?: string): number => {
                        return pricings.find(p => p.question_group_id === gid)?.price ?? 0;
                    };
                    details?.product?.question_groups?.forEach((qg, idx) => {
                        pd.prices.push({
                            title: `${idx + 1}. ${qg.name}`,
                            price: getPrice(qg.id)
                        });
                    });
                    pricings
                        .filter(p => !p.question_group_id)
                        // make sure that taxes is the last field
                        .sort((a, b) => a.title === 'taxes' ? 1 : -1)
                        .forEach(p => {
                            if (p.title.startsWith('custom:')) {
                                pd.prices.push({
                                    title: p.title.replace(/^custom:/i, ''),
                                    price: p.price
                                });
                            } else {
                                pd.prices.push({
                                    title: this._pricingTitles.hasOwnProperty(p.title) ? this._pricingTitles[p.title] : p.title,
                                    price: p.price
                                });
                            }
                        });
                    pd.total = pd.prices.reduce((acc, curr) => acc + (curr.title !== this._pricingTitles['amt_paid'] ? curr.price : 0), 0);
                }
                return pd;
            })
        );
        this.ctx$ = combineLatest(
            this.orderDetails$,
            this.stateDetails$,
            this.pricingDetails$,
            this.sessionService.userProfile$
        ).pipe(map(([orderDetails, stateDetails, pricingDetails, profile]) => ({ orderDetails, stateDetails, pricingDetails, profile })));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.order && changes.order.currentValue?.id && changes.order.currentValue?.id !== changes.order.previousValue?.id) {
                this._customerOrderId$.next(changes.order.currentValue.id);
                this.customerOrdersService.readOne(changes.order.currentValue.id);
            }
        }
    }

    onEdit(): void {
        this.router.navigate(['customer_orders', this.order.id]);
    }

    onReload(): void {
        if (this._customerOrderId$.value) {
            this.customerOrdersService.readOne(this._customerOrderId$.value);
        }
    }

}
