import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { addonsExtension } from './addons.extension';
import { FormlyWrapperAddons } from './addons.wrapper';
import { RepFormlyFieldRadio } from './types.radio';
import { RepFormlyFieldSelect } from './types.select';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
    declarations: [RepFormlyFieldRadio, RepFormlyFieldSelect],
    imports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatSelectModule,

        FormlyMatFormFieldModule,
        FormlySelectModule,
        FormlyModule.forChild({
            // wrappers: [
            //     { name: 'addons', component: FormlyWrapperAddons },
            // ],
            // extensions: [
            //     { name: 'addons', extension: { onPopulate: addonsExtension } },
            // ],
            types: [
                {
                    name: 'rep-radio',
                    component: RepFormlyFieldRadio,
                    wrappers: ['form-field'],
                },
                {
                    name: 'rep-select',
                    component: RepFormlyFieldSelect,
                    wrappers: ['form-field'],
                },
            ],
        }),
    ],
})
export class RepFormlyModule { }
