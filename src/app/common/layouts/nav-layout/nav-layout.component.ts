import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppbarService, AppbarServiceAction } from '../../services/appbar.service';
import { SidenavService } from '../../services/sidenav.service';

@Component({
    selector: 'app-nav-layout',
    templateUrl: './nav-layout.component.html',
    styleUrls: ['./nav-layout.component.scss']
})
export class NavLayoutComponent implements OnInit, OnDestroy {

    public actions: AppbarServiceAction[];

    constructor(
        private router: Router,
        public appbar: AppbarService,
        public sidenav: SidenavService
    ) {
        this.appbar.registerIcon({
            name: 'menu',
            icon: 'menu',
            callback: () => this.sidenav.toggleOrExpand()
        }, true);
        this.actions = this.appbar.actions;
    }

    ngOnInit(): void { }

    ngOnDestroy(): void { }

    closeSidenav(): void { this.sidenav.close(); }

    goToUserSettings(): void {
        this.router.navigate(['user_settings/account']);
    }
}
