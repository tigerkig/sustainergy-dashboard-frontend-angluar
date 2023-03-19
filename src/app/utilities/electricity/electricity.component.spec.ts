import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityComponent } from './electricity.component';

describe('ElectricityComponent', () => {
  let component: ElectricityComponent;
  let fixture: ComponentFixture<ElectricityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
