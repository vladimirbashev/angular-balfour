import { Inject, Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import cloneDeep from 'lodash-es/cloneDeep';
import { ISessionConfigLsKeys, SessionConfig, SESSION_CONFIG } from '../models/index';

@Injectable()
export class SessionConfigService {

    private _config: SessionConfig;

    public constructor(
        @Inject(SESSION_CONFIG) config: SessionConfig,
        private router: Router
    ) { this._config = config; }

    public initRoutes(): Promise<any> {
        return new Promise((resolve, reject) => {
            const config: Routes = cloneDeep(this.router.config);
            const cfgIdx = config.findIndex(t => t.canActivate && t.path === '');
            if (cfgIdx < 0 || !config[cfgIdx]?.children?.length) { reject('Can\'t find \'\' path'); return; }
            const defaultPathIdx = config[cfgIdx].children.findIndex(p => p.path === '**');
            if (defaultPathIdx < 0) { reject('Can\'t default path'); return; }
            config[cfgIdx].children[defaultPathIdx].redirectTo = this.authorizedUrl;
            this.router.resetConfig(config);
            resolve();
        });
    }

    public getConfig(): SessionConfig { return this._config; }

    public get authorizedUrl(): string { return this._config && this._config.authorizedUrl; }
    public set authorizedUrl(val: string) { this._config.authorizedUrl = val; }

    public get serverUrl(): string { return this._config && this._config.serverUrl; }
    public set serverUrl(val: string) { this._config.serverUrl = val; }

    public get lsKeys(): ISessionConfigLsKeys {
        return this._config && this._config.lsKeys;
    }
}
