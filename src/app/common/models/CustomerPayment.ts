export class CustomerPayment {
    deposit_only: string; // Only deposit
    fully_prepaid: string;
    rep_gratis_amount: string;
    chase_rep_gratis_amount: string;
    check_rep_gratis_amount_cust: string;
    chase_rep_gratis_amount_cust: string;
    payment_count: number;
    cash: string;
    check_money_order: string;
    payment_type: string;
    check_number: number;
    wire_number: number;
}

export enum CustomerPaymentType {
    'check' = 'Check',
    'chase' = 'Chase',
    'rep_gratis' = 'Partial Rep Gratis',
    'full_rep_gratis' = 'Full Rep Gratis',
    'bill_rep_office' = 'Bill Rep Office @ NET'
}

export enum CustomerDiscountTypes {
    'jr_high_trade_in' = 'Jr High Trade-In',
    'other' = 'Other'
}
