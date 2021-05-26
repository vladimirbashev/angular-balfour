import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatRadioGroup } from '@angular/material/radio';
import { ɵwrapProperty as wrapProperty } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-mat-radio',
  template: `
    <mat-radio-group
      [formControl]="formControl"
      [formlyAttributes]="field"
      [required]="to.required"
      [tabindex]="to.tabindex"
    >
      <mat-radio-button
        *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index"
        [id]="id + '_' + i"
        [color]="to.color"
        [labelPosition]="to.labelPosition"
        [value]="option.value"
        [checked]="option.value?.id === to?.defaultValue?.id"
      >
        {{ option.label }}
      </mat-radio-button>
    </mat-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-class-suffix
export class RepFormlyFieldRadio extends FieldType implements AfterViewInit, OnDestroy {
  @ViewChild(MatRadioGroup, { static: true }) radioGroup!: MatRadioGroup;
  defaultOptions = {
    templateOptions: {
      hideFieldUnderline: true,
      floatLabel: 'always',
      options: [],
      tabindex: -1,
    },
  };

  private focusObserver!: ReturnType<typeof wrapProperty>;
  ngAfterViewInit(): void {
    this.focusObserver = wrapProperty(this.field, 'focus', ({ currentValue }) => {
        if (this.to.tabindex === -1
            && currentValue
            && this.radioGroup._radios.length > 0) {
            const radio = this.radioGroup.selected
                ? this.radioGroup.selected
                : this.radioGroup._radios.first;
            radio.focus();
        }
    });
  }

  ngOnDestroy(): void {
    if (this.focusObserver) { this.focusObserver(); }
  }
}
