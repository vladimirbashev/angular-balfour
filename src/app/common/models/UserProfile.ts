export enum UserGroup {
    Administrators = 'Administrators',
    RepsManagers = 'RepsManagers',
    Reps = 'Reps',
    OE = "OE",
    AE = "AE",
    OETL = "OETL",
    CS = "CS"
}

export class UserProfile {
    id: string;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    position: string;
    department: string;
    phone: string;
    groups: UserGroup[];

    static inGroup(groups: UserGroup[], group: UserGroup | UserGroup[], every: boolean = false): boolean {
        return groups && (Array.isArray(group)
            ? (every ? groups.filter(g => group.includes(g)).length === group.length : groups.some(g => group.includes(g)))
            : !!groups?.find(g => g === group));
    }
}
