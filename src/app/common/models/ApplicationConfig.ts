import { InjectionToken } from '@angular/core';

import { SessionConfig } from '../../features/session/models/SessionConfig';

export interface ApplicationConfig {
    i18n?: {
        language?: string
    };
    session: SessionConfig;
    services: {
        [name: string]: {
            defaults?: any;
            timeout?: number;
            [key: string]: any;
        }
    };
    [key: string]: any;
}

export const APPLICATION_CONFIG = new InjectionToken<ApplicationConfig>('Application config');
