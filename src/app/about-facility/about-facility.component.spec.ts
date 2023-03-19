import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutFacilityComponent } from './about-facility.component';

describe('AboutFacilityComponent', () => {
  let component: AboutFacilityComponent;
  let fixture: ComponentFixture<AboutFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutFacilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
