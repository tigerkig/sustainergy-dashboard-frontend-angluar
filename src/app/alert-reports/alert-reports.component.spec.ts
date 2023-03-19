import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertReportsComponent } from './alert-reports.component';

describe('AlertReportsComponent', () => {
  let component: AlertReportsComponent;
  let fixture: ComponentFixture<AlertReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
