import { Component, OnDestroy, OnInit, Injectable, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, retry, map, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileUploadResult, SilverPopUpload, GetConfigResult } from '../models/AzureSilverPop';
import { SessionService } from '../../session';
import { CommonModule } from "@angular/common";

@Component({
    selector: 'rp-email-marketing-screen',
    templateUrl: './email-marketing-screen.component.html',
    styleUrls: ['./email-marketing-screen.component.scss']
})

@Injectable()
export class EmailMarketingScreenComponent implements OnInit, OnDestroy {
    private apiEndPoint: string = 'https://prod-dfw-mkt-api.azure-api.net/aac-balfour-backend-silverpop/';
    private entityId: string = 'RepPortal';

    private userId: string = '';
    private _disposed$ = new Subject();

    public requiredColumns: string = '';
    public optionalColumns: string = '';

    public StartDate: Date;
    public EndDate: Date;

    public FileUploadStatus: string = '';

    public SilverPopUploads = [];

    public uploadState: string = '';

    constructor(private http: HttpClient, private sessionService: SessionService) {
      this.StartDate = new Date();
      this.StartDate.setUTCDate(this.StartDate.getUTCDate() - 7);

      this.EndDate = new Date();
      this.EndDate.setUTCDate(this.EndDate.getUTCDate() + 1);

      let parentThis = this;

      this.sessionService.userProfile$.pipe(takeUntil(this._disposed$)).subscribe(profile => parentThis.userId = profile.id);

      this.getColumnInfo();

      this.getQueueStatus();
    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
      this._disposed$.next(null);
      this._disposed$.complete();
    }

    getColumnInfo() {
      let parentThis = this;

      let url = this.apiEndPoint + 'GetConfig';

      let request = {
        EntityId: this.entityId,
        FileUploadType: 0
      }

      this.http.post<GetConfigResult>(url, request, { headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' } })
        .subscribe(
          data => {
            parentThis.requiredColumns = data.requiredColumns.join(', ');
            parentThis.optionalColumns = data.optionalColumns.join(', ');

            console.log(data);
          },
          error => {
            console.log(error);
          }
        );
    }

    getQueueStatus() {
      let parentThis = this;

      let url = this.apiEndPoint + 'GetQueueStatus';

      let request = {
        StartDate: this.StartDate,
        EndDate: this.EndDate,
        EntityId: this.entityId,
        UserId: this.userId
      };

      this.http.post<SilverPopUpload[]>(url, request, { headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' } })
          .subscribe(
            data => {
              parentThis.SilverPopUploads = data;

              console.log(data);
            },
            error => {
              console.log(error);
            }
          );
    }

    fileChange(event) {
      this.uploadState = '';

      let fileList: FileList = event.target.files;
      let parentThis = this;

      if (fileList.length > 0) {
          this.FileUploadStatus = 'Uploading...';

          event.target.disabled = true;

          let file: File = fileList[0];

          let url = this.apiEndPoint + 'UploadFile';

          let reader = new FileReader();
          let fileByteArray = [];
          reader.readAsArrayBuffer(file);
          reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
              let arrayBuffer = evt.target.result as ArrayBuffer;
              let array = new Uint8Array(arrayBuffer);
              for (var i = 0; i < array.length; i++) {
                fileByteArray.push(array[i]);
              }

              let request = {
                EntityId: parentThis.entityId,
                UserId: parentThis.userId,
                FileUploadType: 0,
                FileName: file.name,
                FileBytes: fileByteArray
              };

              parentThis.http.post<FileUploadResult>(url, request, { headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' } })
                .subscribe(
                  data => {
                    parentThis.FileUploadStatus = 'File is being imported to SilverPop.'
                    event.target.disabled = false;
                    parentThis.uploadState = 'Success';

                    parentThis.getQueueStatus();
                  },
                  error => {
                    parentThis.FileUploadStatus = 'There was an error sending your file to SilverPop: ' + error.error.message;
                    event.target.disabled = false;
                    parentThis.uploadState = 'Failed';

                    console.log(error);
                  }
                );
          }
        }
      }
    }
}
