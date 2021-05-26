import { Directive, HostListener } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';


@Directive({
  selector: '[stepperScrollUp]',
})
export class StepperScrollUpDirective {
  constructor(private stepper: MatStepper) {
    console.log('stepper: ', stepper);
   }

  @HostListener('selectionChange', ['$event'])
  selectionChanged(selection: StepperSelectionEvent) {
    const stepId = this.stepper._getStepLabelId(selection.selectedIndex - 1);
    const stepElement = document.getElementById(stepId);
    const contentContainer = document.getElementsByClassName('mat-horizontal-content-container')[0];
    if (stepElement) {
      setTimeout(() => {
        stepElement.scrollIntoView(true);
        contentContainer.scrollTo(0, 0);
      }, 250);
    }
  }
}
