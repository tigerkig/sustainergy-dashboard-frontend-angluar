import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchFacilitiesComponent } from './switch-facilities.component';

describe('SwitchFacilitiesComponent', () => {
  let component: SwitchFacilitiesComponent;
  let fixture: ComponentFixture<SwitchFacilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchFacilitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
