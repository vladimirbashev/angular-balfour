import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'formly-field-select',
  template: `
    <mat-select
      [formControl]="formControl"
      [formlyAttributes]="field"
      [required]="to.required"
      [tabindex]="to.tabindex"
      [ngModel]="to.defaultValue"
    >
      <mat-option
        *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index"
        [id]="id + '_' + i"
        [labelPosition]="to.labelPosition"
        [value]="option.value"
      >
        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="8px"> 
        <div style="height: 16px; width: 16px; background-color: {{ option.value.color }}; border-radius: 50%; border: 1px solid #aaa;"></div>
        <div>{{ option.label }}</div>
        </div>
      </mat-option>
    </mat-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-class-suffix
export class RepFormlyFieldSelect extends FieldType {
  @ViewChild(MatSelect, { static: true }) select!: MatSelect;
  defaultOptions = {
    templateOptions: {
      hideFieldUnderline: true,
      floatLabel: 'always',
      options: [],
      tabindex: -1,
    },
  };
}
