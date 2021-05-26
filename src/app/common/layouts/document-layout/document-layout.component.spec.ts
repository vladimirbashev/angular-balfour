import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLayoutComponent } from './document-layout.component';

describe('DocumentLayoutComponent', () => {
  let component: DocumentLayoutComponent;
  let fixture: ComponentFixture<DocumentLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
