import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

import { SessionService } from '../../../features/session/services/session.service';
import { UserGroup, UserProfile } from '../../models/UserProfile';
import { SidenavService } from '../../services/sidenav.service';

class MenuItem {
    icon: string;
    fontSet?: string;
    title: string;
    route?: string;
    callback?: () => void;
}

@Component({
    selector: 'rp-applications-sidenav',
    templateUrl: './applications-sidenav.component.html',
    styleUrls: ['./applications-sidenav.component.scss']
})
export class ApplicationsSidenavComponent implements OnInit, OnDestroy {

    private _disposed$ = new Subject();

    public sections$: Observable<MenuItem[][]>;

    constructor(
        private msalService: MsalService,
        private sessionService: SessionService,
        public sidenav: SidenavService,
    ) {
        this.sections$ = this.sessionService.userProfile$.pipe(
            map(profile => {
                const sections: MenuItem[][] = [
                    [
                        {
                            icon: 'home_outline',
                            title: 'Home',
                            route: '/home'
                        }
                    ],
                    [],
                    [
                        {
                            icon: 'exit_to_app',
                            title: 'Logout',
                            callback: () => this.msalService.logout()
                        }
                    ]
                ];
                if (profile?.groups?.length > 0) {
                    if (!UserProfile.inGroup(profile.groups, [UserGroup.AE, UserGroup.OE, UserGroup.OETL, UserGroup.CS])) {
                        sections[1].splice(0, 0, 
                        // {
                        //     icon: 'people_outline',
                        //     title: 'Customers',
                        //     route: '/customers'
                        // },
                            {
                                icon: 'account_balance_outline',
                                title: 'Schools/Organizations',
                                route: '/organizations'
                            });
                    }
                    sections[1].push(...[
                        {
                            icon: 'list_outline',
                            title: 'Envelopes',
                            route: '/envelopes'
                        },
                        {
                            icon: 'shopping_cart_outline',
                            title: 'Customer orders',
                            route: '/customer_orders'
                        },
                        {
                          icon: 'email',
                          title: 'Email Marketing',
                          route: '/email_marketing'
                        }
                    ]);
                }
                return sections;
            })
        );
    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        this._disposed$.next();
        this._disposed$.complete();
    }

    closeSidenav(): void {
        this.sidenav.mediaState$.pipe(
            takeUntil(this._disposed$),
            map(ms => ms.expandable)
        ).subscribe(e => {
            if (!e) {
                this.sidenav.close();
            }
        });
    }

}
