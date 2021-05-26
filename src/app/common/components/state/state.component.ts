import { EntityState } from 'src/app/common/models';

import { Component, Input } from '@angular/core';

@Component({
    selector: 'rp-state',
    template: '<img [attr.src]="stateImage"><ng-content></ng-content>',
    styleUrls: ['./state.component.scss']
})
export class StateComponent {

    @Input() state: EntityState;

    constructor() { }

    get stateImage(): string {
        switch (this.state) {
            case EntityState.Empty:
                return 'assets/images/states/empty.svg';
            case EntityState.Progress:
                return 'assets/images/states/progress.svg';
            default:
                return 'assets/images/states/error.svg';
        }
    }

}
