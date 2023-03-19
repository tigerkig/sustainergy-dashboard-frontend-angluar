import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordSentComponent } from './reset-password-sent.component';

describe('ResetPasswordSentComponent', () => {
  let component: ResetPasswordSentComponent;
  let fixture: ComponentFixture<ResetPasswordSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordSentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
