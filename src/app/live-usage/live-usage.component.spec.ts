import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveUsageComponent } from './live-usage.component';

describe('LiveUsageComponent', () => {
  let component: LiveUsageComponent;
  let fixture: ComponentFixture<LiveUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveUsageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
