import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMeterComponentComponent } from './panel-meter-component.component';

describe('PanelMeterComponentComponent', () => {
  let component: PanelMeterComponentComponent;
  let fixture: ComponentFixture<PanelMeterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelMeterComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelMeterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
