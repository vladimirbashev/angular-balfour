import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDrawerMode } from '@angular/material/sidenav';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SimpleStore } from '../models/SimpleStore';

export interface ISidenavState {
    opened: boolean;
    expanded: boolean;
}

class SidenavMediaState {
    mode?: MatDrawerMode;
    fixedInViewport?: boolean;
    expandable?: boolean;
}

@Injectable()
export class SidenavService {
    private _mediaStates: { [key: string]: SidenavMediaState } = {
        'lt-sm': {
            mode: 'over',
            fixedInViewport: true,
            expandable: false
        },
        'lt-md': {
            expandable: true
        }
    };
    private _mediaStateDefault: Required<SidenavMediaState> = {
        mode: 'side',
        fixedInViewport: false,
        expandable: false
    };
    private _store = new SimpleStore<ISidenavState>({
        opened: false,
        expanded: false,
    });
    public mode$: Observable<MatDrawerMode>;
    public mediaState$: Observable<Required<SidenavMediaState>>;

    constructor(
        private mediaObserver: MediaObserver
    ) {
        this.mediaState$ = this.mediaObserver.asObservable().pipe(
            startWith([]),
            map((mc) => {
                for (const mqAlias of Object.keys(this._mediaStates)) {
                    if (mc.some(m => m.mqAlias === mqAlias)) {
                        return defaultsDeep(this._mediaStates[mqAlias], this._mediaStateDefault);
                    }
                }
                return this._mediaStateDefault;
            })
        );
    }

    set opened(opened: boolean) { this._store.setState({ opened }); }
    get opened(): boolean { return this._store.getStateSnapshot().opened; }
    get opened$(): Observable<boolean> { return this._store.select('opened'); }

    set expanded(expanded: boolean) { this._store.setState({ expanded }); }
    get expanded(): boolean { return this._store.getStateSnapshot().expanded; }
    get expanded$(): Observable<boolean> { return this._store.select('expanded'); }

    open(): void { this.opened = true; }
    close(): void { this.opened = false; }
    toggle(): void { this.opened = !this.opened; }

    expand(): void { this.expanded = true; }
    collapse(): void { this.expanded = false; }
    toggleExpanded(): void { this.expanded = !this.expanded; }

    toggleOrExpand(): void {
        let state: SidenavMediaState;
        for (const mqAlias of Object.keys(this._mediaStates)) {
            if (this.mediaObserver.isActive(mqAlias)) {
                state = defaultsDeep(this._mediaStates[mqAlias], this._mediaStateDefault);
                break;
            }
        }
        if (!state) { state = this._mediaStateDefault; }
        state.expandable ? this.toggleExpanded() : this.toggle();
    }
}
