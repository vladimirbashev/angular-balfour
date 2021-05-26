import { ConfigurationSurcharge, SurchargeTypes } from '../models/ConfigurationSurcharge';

export function validateSurcharge(surcharge: ConfigurationSurcharge, value: any): boolean {
    switch (surcharge.surcharges_type) {
        case SurchargeTypes.GREEK_ROYALTY:
            return /[α-ωΑ-Ω]+/.test(value);
        default:
            return true;
    }
}
