import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDataStreamComponent } from './inventory-data-stream.component';

describe('InventoryDataStreamComponent', () => {
  let component: InventoryDataStreamComponent;
  let fixture: ComponentFixture<InventoryDataStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryDataStreamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryDataStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
