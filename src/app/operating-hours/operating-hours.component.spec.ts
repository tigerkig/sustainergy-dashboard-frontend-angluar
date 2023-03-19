import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingHoursComponent } from './operating-hours.component';

describe('OperatingHoursComponent', () => {
  let component: OperatingHoursComponent;
  let fixture: ComponentFixture<OperatingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatingHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
