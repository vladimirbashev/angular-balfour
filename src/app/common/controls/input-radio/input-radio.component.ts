import { Question } from 'src/app/common/models/Question';

import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Option } from '../../models/Option';

@Component({
    selector: 'rp-input-radio',
    templateUrl: './input-radio.component.html'
})
export class InputRadioComponent {

    @Input() ctrl: FormControl;
    @Input() question: Question;
    @Input() options: Option[];

    constructor() { }

    isDefault(id: string): boolean {
        return !this?.ctrl?.value && this.question.answers.some(a => a.id === id && a.default);
    }

}
