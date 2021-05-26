import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { APPLICATION_CONFIG, ApplicationConfig } from './app/common/models/ApplicationConfig';
import { environment } from './environments/environment';

fetch('./config.json')
  .then((response) => response.json())
  .then((config: ApplicationConfig) => {
    if (environment.production) {
      enableProdMode();
    }
    platformBrowserDynamic(
      [{ provide: APPLICATION_CONFIG, useValue: config }]
    )
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  });
