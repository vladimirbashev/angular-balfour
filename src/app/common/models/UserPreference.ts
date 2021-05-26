import { NotificationPreference } from './NotificationPreference';

export class UserPreference {
    id: string;
    user_id: string;
    preferred_email: string;
    time_zone: string;
    language: string;
    theme: string;
    office_number: string;
    ship_dest_type: string;
    ship_address: string;
    ship_name: string;
    ship_city: string;
    ship_state: string;
    ship_zip: string;
    ship_attention: string;
    ship_phone: string;
    params: Map<string, any>;
    notifications: NotificationPreference[];
}
