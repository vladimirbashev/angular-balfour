import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
    selector: 'rp-document-layout',
    templateUrl: './document-layout.component.html',
    styleUrls: ['./document-layout.component.scss']
})
export class DocumentLayoutComponent implements OnInit {

    @HostBinding('class.rp-document-layout') get klassRpDocumentLayout(): boolean { return true; }

    constructor() { }

    ngOnInit(): void { }

}
