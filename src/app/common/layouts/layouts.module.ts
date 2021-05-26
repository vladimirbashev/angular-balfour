import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { CommonComponentsModule } from '../components/common-components.module';
import { AppRootComponent } from './app-root/app-root.component';
import { NavLayoutComponent } from './nav-layout/nav-layout.component';

const layouts = [
    AppRootComponent,
    NavLayoutComponent
];

@NgModule({
    declarations: layouts,
    exports: layouts,
    imports: [
        CommonModule,
        RouterModule,

        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        CommonComponentsModule,
        MatTooltipModule,
        MatProgressSpinnerModule
    ]
})
export class LayoutsModule { }
