export class NotificationPreference {
    area: string;
    show_min_severity: MinNotificationSeverity;
    email_min_severity: MinNotificationSeverity;
}

export enum MinNotificationSeverity {
    None = -1,
    Critical = 0,
    Important = 1,
    Informational = 2,
    All = 3
}
