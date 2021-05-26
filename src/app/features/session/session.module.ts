import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { MsalInterceptor, MsalModule, MsalService, MSAL_CONFIG, MSAL_CONFIG_ANGULAR } from '@azure/msal-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import get from 'lodash-es/get';
import has from 'lodash-es/has';
import merge from 'lodash-es/merge';
import remove from 'lodash-es/remove';
import { Logger, LogLevel } from 'msal';
import { ApplicationConfig, APPLICATION_CONFIG } from '../../common/models/ApplicationConfig';
import { SessionConfig, SESSION_CONFIG, SESSION_CONFIG_DEFAULT } from './models/SessionConfig';
import { SessionConfigService, SessionDataService, SessionEditService, SessionService } from './services';
import { SessionEffects } from './store/session.effects';
import { sessionReducer } from './store/session.reducer';

export const isIE = window?.navigator?.userAgent?.indexOf('MSIE ') > -1 || window?.navigator?.userAgent?.indexOf('Trident/') > -1;

export function sessionConfigFactory(appConfig: ApplicationConfig): SessionConfig {
    console.log('provide session config');
    return appConfig && appConfig.session
        ? merge({}, SESSION_CONFIG_DEFAULT, appConfig.session)
        : SESSION_CONFIG_DEFAULT;
}

export function MSALConfigFactory(appConfig: ApplicationConfig): any {
    const msalConfig = get(appConfig, 'msal.config', {});
    if (has(msalConfig, 'system.logger')) {
        if (get(appConfig, 'msal.enableLogger', false)) {
            const loggerCallback = (logLevel, message, piiEnabled) => {
                console.log('[msal] ' + message);
            };
            const logger = new Logger(
                loggerCallback,
                { correlationId: '1234', level: LogLevel.Info, piiLoggingEnabled: true });
            msalConfig.system.logger = logger;
        } else {
            remove(msalConfig, 'system.logger');
        }
    }
    if (has(msalConfig, 'cache.storeAuthStateInCookie') && msalConfig.cache.storeAuthStateInCookie === true) {
        msalConfig.cache.storeAuthStateInCookie = isIE;
    }
    return merge({}, msalConfig);
}

export function MSALAngularConfigFactory(appConfig: ApplicationConfig): any {
    const msalAngularConfig = get(appConfig, 'msal.configAngular', {});
    if (has(msalAngularConfig, 'popUp') && msalAngularConfig.popUp === true) {
        msalAngularConfig.popUp = !isIE;
    }
    return merge({}, msalAngularConfig);
}

export function initRoutes(scs: SessionConfigService): () => void {
    return () => scs.initRoutes();
}

@NgModule({
    imports: [
        // Angular and vendors
        CommonModule,
        StoreModule.forFeature('auth', sessionReducer),
        EffectsModule.forFeature([SessionEffects]),
        MsalModule
    ],
})
export class SessionModule {
    static forRoot(): ModuleWithProviders<SessionModule> {
        return {
            ngModule: SessionModule,
            providers: [
                SessionConfigService,
                SessionDataService,
                SessionEditService,
                SessionService,
                {
                    provide: SESSION_CONFIG,
                    useFactory: sessionConfigFactory,
                    deps: [APPLICATION_CONFIG]
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MsalInterceptor,
                    multi: true
                },
                {
                    provide: MSAL_CONFIG,
                    useFactory: MSALConfigFactory,
                    deps: [APPLICATION_CONFIG]
                },
                {
                    provide: MSAL_CONFIG_ANGULAR,
                    useFactory: MSALAngularConfigFactory,
                    deps: [APPLICATION_CONFIG]
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: initRoutes,
                    multi: true,
                    deps: [SessionConfigService]
                },
                MsalService
            ]
        };
    }
}
