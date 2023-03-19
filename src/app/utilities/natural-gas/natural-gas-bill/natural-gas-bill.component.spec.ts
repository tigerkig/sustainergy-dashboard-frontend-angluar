import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturalGasBillComponent } from './natural-gas-bill.component';

describe('NaturalGasBillComponent', () => {
  let component: NaturalGasBillComponent;
  let fixture: ComponentFixture<NaturalGasBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaturalGasBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturalGasBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
