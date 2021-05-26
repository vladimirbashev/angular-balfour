import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DocumentLayoutComponent } from './document-layout.component';

@NgModule({
    declarations: [DocumentLayoutComponent],
    exports: [DocumentLayoutComponent],
    imports: [
        CommonModule
    ]
})
export class DocumentLayoutModule { }
