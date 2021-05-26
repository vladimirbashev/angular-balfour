import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Option } from '../../models/Option';
import { Question } from '../../models/Question';

@Component({
    selector: 'rp-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

    @Input() ctrl: FormControl;
    @Input() question: Question;
    @Input() options?: Option[];

    constructor() {}

    ngOnInit(): void { }

}
