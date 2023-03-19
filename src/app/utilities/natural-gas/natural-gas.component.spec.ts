import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturalGasComponent } from './natural-gas.component';

describe('NaturalGasComponent', () => {
  let component: NaturalGasComponent;
  let fixture: ComponentFixture<NaturalGasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaturalGasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturalGasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
