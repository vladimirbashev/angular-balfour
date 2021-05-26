import { Inject, Injectable } from '@angular/core';
import get from 'lodash-es/get';
import { ApplicationConfig, APPLICATION_CONFIG } from '../models/index';

@Injectable()
export class AppSettingsService {
    public constructor(
        @Inject(APPLICATION_CONFIG) private _config: ApplicationConfig
    ) { }

    public get config(): ApplicationConfig {
        return this._config;
    }

    public getProperty(path: string | string[], defaultValue?: any): any {
        return get(this._config, path, defaultValue);
    }
}
