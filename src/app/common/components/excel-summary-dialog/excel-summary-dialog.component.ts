import { Component, OnInit, OnDestroy} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export interface OptionsAddDialogData {
    exclude_ids: string[];
}

@Component({
    selector: 'rp-excel-summary-dialog',
    templateUrl: './excel-summary-dialog.component.html',
    styleUrls: ['./excel-summary-dialog.component.scss']
})
export class ExcelSummaryDialogComponent implements OnInit, OnDestroy {

    public allStatuses = ['All', 'New', 'Incomplete', 'Assigned', 'Completed', 'Processed'];
    public status: string;

    constructor(
        private _dialogRef: MatDialogRef<ExcelSummaryDialogComponent>
    ) {
        this.status = this.allStatuses[this.allStatuses.length - 1];
    }

    ngOnInit() { }

    ngOnDestroy() { }

    public chooseStatus() {
        this._dialogRef.close(this.status.toLowerCase());
    }

    public closeDialog() {
        this._dialogRef.close(null);
    }
}
