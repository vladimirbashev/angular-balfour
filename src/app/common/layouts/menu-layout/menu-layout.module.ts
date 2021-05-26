import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MenuLayoutComponent } from './menu-layout.component';

@NgModule({
    declarations: [MenuLayoutComponent],
    exports: [MenuLayoutComponent],
    imports: [CommonModule]
})
export class MenuLayoutModule {}
