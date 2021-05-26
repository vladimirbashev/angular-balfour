import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'rp-empty-state',
    templateUrl: './empty-state.component.html',
    styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent implements OnInit {

    @Input() title: string;
    @Input() text: string;
    @Input() isFilter: string;

    @Output() actionClick = new EventEmitter();
    @Output() resetFilterClick = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {

    }

    public onActionClick() {
        if (this.actionClick) {
            this.actionClick.emit();
        }
    }

    public onResetClick() {
        if (this.resetFilterClick) {
            this.resetFilterClick.emit();
        }
    }
}