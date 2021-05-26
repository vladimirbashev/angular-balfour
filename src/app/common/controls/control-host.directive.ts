import {
    ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Host, Inject, Input, OnDestroy,
    OnInit, Optional, Output, Self, SkipSelf, ViewContainerRef
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

import { Question } from '../models/Question';
import { controlsMeta } from './controls';
import { QuestionComponent } from './question/question.component';

export function normalizeValidator(validator: ValidatorFn | Validator): ValidatorFn {
    if ((validator as Validator).validate) {
        return (c: AbstractControl) => (validator as Validator).validate(c);
    } else {
        return validator as ValidatorFn;
    }
}

@Directive({
    selector: '[rpControl]',
})
export class RpControlDirective implements OnInit, OnDestroy {
    component: ComponentRef<any>;

    @Input() rpControl: string;
    @Output() ngModelChange = new EventEmitter();


    constructor(
        @Optional() @Host() @SkipSelf() private parent: QuestionComponent,
        @Optional() @Self() @Inject(NG_VALIDATORS) private validators: Array<Validator | ValidatorFn>,
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef) { }

    ngOnInit(): void {
        const meta = Object.keys(controlsMeta).includes(this.rpControl) ? controlsMeta[this.rpControl] : null;
        if (meta) {
            type T = typeof meta.type;
            const componentFactory = this.resolver.resolveComponentFactory<T>(meta.type);
            this.component = this.container.createComponent(componentFactory);
            for (const option of meta.parentOptions) {
                this.component.instance[option] = this.parent[option];
            }
            if (meta.options) {
                for (const option of Object.keys(meta.options)) {
                    this.component.instance[option] = meta.options[option];
                }
            }
        } else {
            console.log('Control missing!', this.rpControl);
        }
    }

    ngOnDestroy(): void {
        if (this.component) {
            this.component.destroy();
        }
    }
}
