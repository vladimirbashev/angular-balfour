import { Account } from 'msal';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { BroadcastService, MsalService } from '@azure/msal-angular';

import { isIE, SessionService } from '../../../features/session/index';

@Component({
    selector: 'app-root',
    templateUrl: './app-root.component.html',
    styleUrls: ['./app-root.component.scss']
})
export class AppRootComponent implements OnInit, OnDestroy {

    private _accountSubs: Subscription[] = [];
    private _disposed$ = new Subject();
    private _currentMcs = [];

    public isAuthenticated$: Observable<boolean>;

    private _setAccount = (account: Account) => (this.sessionService.setAccount(account), this._accountUnsubscribe());

    constructor(
        private broadcastService: BroadcastService,
        @Inject(DOCUMENT) private document: Document,
        private mediaObserver: MediaObserver,
        private msalService: MsalService,
        private renderer: Renderer2,
        private sessionService: SessionService
    ) {
        this.mediaObserver.asObservable()
            .pipe(takeUntil(this._disposed$))
            .subscribe(mcs => {
                const _newMcs = mcs.map(mc => mc.mqAlias);
                this._currentMcs.forEach(mc => _newMcs.includes(mc) ? null : this.renderer.removeClass(this.document.body, mc));
                this._currentMcs = _newMcs;
                _newMcs.forEach(mc => this.renderer.addClass(this.document.body, mc));
            });
        this.isAuthenticated$ = this.sessionService.isAuthenticated$.pipe(debounceTime(1000));
        this._accountSubs.push(...[
            this.broadcastService.subscribe('msal:loginSuccess', payload => this._setAccount(payload?.account)),
            this.broadcastService.subscribe('msal:acquireTokenSuccess', payload => this._setAccount(payload?.account))
        ]);
    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        this._disposed$.next();
        this._disposed$.complete();
        this.broadcastService.getMSALSubject().next(1);
        this._accountUnsubscribe();
    }

    private _accountUnsubscribe(): void {
        this._accountSubs.forEach(s => !s.closed && s.unsubscribe());
    }

    get isLoginInProgress(): boolean { return this.msalService.getLoginInProgress(); }

    get isLoadingInProgress(): boolean { return this.msalService.getAccount() !== null; }

    openLogin(): void {
        if (isIE) {
            this.msalService.loginRedirect();
        } else {
            this.msalService.loginPopup();
        }
    }
}
