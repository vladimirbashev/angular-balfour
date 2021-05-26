import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Question } from '../../models/Question';

@Component({
    selector: 'rp-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {

    @HostBinding('class.rp-text-input') get klass(): boolean { return true; }
    @Input() ctrl: FormControl;
    @Input() question: Question;
    @ViewChild('ti', { static: true }) ti: ElementRef<HTMLInputElement>;
    public type: string;

    constructor() { this.ctrl = new FormControl(); }

    ngOnInit(): void {
        this.type = this.question && this.question.input_validation ? this.question.input_validation : "text";
    }
}
