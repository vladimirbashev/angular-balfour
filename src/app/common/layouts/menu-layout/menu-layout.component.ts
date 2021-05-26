import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input
} from '@angular/core';

@Component({
    selector: 'rp-menu-layout',
    styleUrls: ['./menu-layout.component.scss'],
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuLayoutComponent {
    private _single = false;

    @Input()
    get single(): boolean { return this._single; }
    set single(value) {
        this._single = coerceBooleanProperty(value);
        this.cd.markForCheck();
    }

    @HostBinding('class.menu-layout') get klassMenuLayout(): boolean { return true; }
    @HostBinding('class.single-content') get klassSingleContent(): boolean { return this._single; }

    constructor(private cd: ChangeDetectorRef) { }
}
