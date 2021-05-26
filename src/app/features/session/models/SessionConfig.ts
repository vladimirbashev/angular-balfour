import { InjectionToken } from '@angular/core';

export interface ISessionConfigLsKeys {
    session: string;
    serverUrl: string;
}

export class SessionConfig {
    public authorizedUrl: string;
    public serverUrl: string;
    public lsKeys: ISessionConfigLsKeys;
}

export const SESSION_CONFIG = new InjectionToken<SessionConfig>('Session Config');

export const SESSION_CONFIG_DEFAULT: SessionConfig = {
    authorizedUrl: 'home',
    serverUrl: '',
    lsKeys: {
        session: 'session',
        serverUrl: 'serverUrl'
    }
};
