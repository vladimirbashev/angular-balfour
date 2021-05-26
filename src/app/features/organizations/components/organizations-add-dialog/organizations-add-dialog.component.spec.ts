import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsAddDialogComponent } from './organizations-add-dialog.component';

describe('OrganizationsAddDialogComponent', () => {
  let component: OrganizationsAddDialogComponent;
  let fixture: ComponentFixture<OrganizationsAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationsAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
