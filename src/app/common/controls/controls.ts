import { Type } from '@angular/core';

import { QuestionControls } from '../models/Question';
import { InputRadioComponent } from './input-radio/input-radio.component';
import { TextInputComponent } from './text-input/text-input.component';
import { DropdownComponent } from './dropdown/dropdown.component';

export class RpControlMeta {
    type: Type<any>;
    parentOptions: string[];
    options?: { [key: string]: any };
}

export const CONTROLS: any[] = [
    InputRadioComponent,
    TextInputComponent,
    DropdownComponent
];

export const controlsMeta: { [component in QuestionControls]?: RpControlMeta } = {
    [QuestionControls.INPUT_RADIO]: {
        type: InputRadioComponent,
        parentOptions: ['ctrl', 'question', 'options']
    },
    [QuestionControls.DROPDOWN_SELECT]: {
        type: DropdownComponent,
        parentOptions: ['ctrl', 'question', 'options']
    },
    [QuestionControls.TEXT_INPUT]: {
        type: TextInputComponent,
        parentOptions: ['ctrl', 'question']
    }
};
