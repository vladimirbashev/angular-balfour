export class VendorOrder {
    id: string;
    purchase_number: string;
    status: VendorOrderStatus;
    routing: VendorOrderRouting;
    office_number: string;
    rep_name: string;
    org_id: string;
    org_name: string;
    org_number: string;
    org_tax_rate: string;
    type: VendorOrderType;
    code: VendorOrderCode;
    date_mailed: Date;
    request_ship_date: Date;
    event_date: Date;
    ceremony_date: Date;
    champ_short: boolean;
    ship_address: string;
    ship_name: string;
    ship_city: string;
    ship_state: string;
    ship_attention: string;
    ship_phone: string;
    ship_dest_type: VendorOrderShipDestType;
    ship_zip: string;
    bill_to: string;
    account_number: string;
    account_name: string;
    tax_exempt: boolean;
    instructions: string;
    verification: VerificationData;
    wire_number: number;
    wire_deposit: number;
    check_number: number;
    check_deposit: number;
    rep_gratis_deposit: number;
    bill_rep_office_deposit: number;
    chase_number: number;
    chase_transactions: ChaseTransaction[];
    chase_info: string;
    payment_type: string;
    payment_type_2: string;
    additional_payment_types: string[];
    customer_order_ids: string[];
    customer_names: string[];
    customer_phones: string[];
    notes: VendorOrderNote[];
    total_price: number;
    owner_id: string;
    assignee_id: string;
    create_date: Date;
    update_date: Date;
    count_of_orders: number;
    attachments: VendorOrderAttachment[];
}

export class ChaseTransaction {
    number: number;
    deposit: number;
    date: Date;
}

export class VendorOrderNote {
    content: string;
    author_id: string;
    author_name: string;
    resolved: boolean;
}

export class VendorOrderRouting {
    type: VendorOrderRoutingType;
    trade_in_enclosed: boolean;
}

export class VerificationData {
    type: VerificationDataType;
    cpa: boolean;
    out_of_territory: boolean;
}

export class VendorOrderStatistics {
    statistics: {
        [key in VendorOrderStatus]: number
    };
}

export class VendorOrderAttachment {
    type: string;
    name: string;
    blob_id: string;
    uri: string;
    description: string;
    data: string;
}

export enum VendorOrderStatus {
    InProgress = 'in_progress',
    Submitted = 'submitted',
    Processed = 'processed',
    Incomplete = 'incomplete',
    Assigned = 'assigned',
    Completed = 'completed'
}

export const vendorOrderStatusNamesForReps: { [key in VendorOrderStatus]: string } = {
    [VendorOrderStatus.InProgress]: 'In progress',
    [VendorOrderStatus.Submitted]: 'Submitted',
    [VendorOrderStatus.Processed]: 'Processed',
    [VendorOrderStatus.Incomplete]: 'Incomplete',
    [VendorOrderStatus.Assigned]: 'Assigned',
    [VendorOrderStatus.Completed]: 'Completed'
};

export const vendorOrderStatusNamesForRepManagers: { [key in VendorOrderStatus]: string } = {
    [VendorOrderStatus.InProgress]: 'Filling by Sales Rep',
    [VendorOrderStatus.Submitted]: 'New',
    [VendorOrderStatus.Processed]: 'Processed',
    [VendorOrderStatus.Incomplete]: 'Incomplete',
    [VendorOrderStatus.Assigned]: 'Assigned',
    [VendorOrderStatus.Completed]: 'Completed'
};

export enum VendorOrderType {
    Original = 'Original',
    Add = 'Add'
}

export enum VendorOrderCode {
    Regular = 'Regular',
    SOFD = 'SOFD',
    Other = 'Other'
}

export enum VendorOrderShipDestType {
    Office = 'st',
    Customer = 'cu',
    School = 'sc',
    Other = 'ot'
}

export enum VendorOrderBillTo {
    Office = 'st',
    School = 'sc'
}

export enum VendorOrderRoutingType {
    HighSchool = 'High school',
    SpiritRings = 'Spirit Rings'
}

export enum VerificationDataType {
    TIER = 'TIER',
    NET = 'NET'
}

export enum VendorOrderPaymentType {
    Check = 'check',
    Wire = 'wire',
    Chase = 'chase',
    "Rep Gratis" = 'rep_gratis',
    "Bill Rep Office @ NET" = 'bill_rep_office'
}
