import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsSidenavComponent } from './applications-sidenav.component';

describe('ApplicationsSidenavComponent', () => {
    let component: ApplicationsSidenavComponent;
    let fixture: ComponentFixture<ApplicationsSidenavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ApplicationsSidenavComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationsSidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
