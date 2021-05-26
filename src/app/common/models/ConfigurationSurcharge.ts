export class ConfigurationSurcharge {
    surcharges_type: SurchargeTypes;
    surcharges_rate: number;
    qo_pairs: { question_id: string, option_id: string }[];
    validate: boolean;
}

export enum SurchargeTypes {
    GREEK_ROYALTY = 'greek_royalty',
    OTHER = 'other'
}