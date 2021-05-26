import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { LocalStorageModule } from 'angular-2-local-storage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppbarService, RepFormlyModule, FormlyWrapperAddons, addonsExtension } from './common';
import { AppRootComponent } from './common/layouts/app-root/app-root.component';
import { LayoutsModule } from './common/layouts/layouts.module';
import { AppSettingsService } from './common/services/appsettings.service';
import { SidenavService } from './common/services/sidenav.service';
import { WINDOW_PROVIDERS } from './common/services/window.service';
import { SessionModule } from './features/session/session.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    LocalStorageModule.forRoot({
      prefix: 'rp',
      storageType: 'localStorage'
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),

    AppRoutingModule,
    LayoutsModule,
    SessionModule.forRoot(),
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      extras: { lazyRender: true }, wrappers: [
        { name: 'addons', component: FormlyWrapperAddons },
      ],
      extensions: [
        { name: 'addons', extension: { onPopulate: addonsExtension } },
      ],
    }),
    RepFormlyModule
  ],
  declarations: [FormlyWrapperAddons],
  providers: [
    AppbarService,
    AppSettingsService,
    WINDOW_PROVIDERS,
    SidenavService,
    // mockProvidersAndServices
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
