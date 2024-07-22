import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLoanModalComponent } from './pay-loan-modal.component';

describe('PayLoanModalComponent', () => {
  let component: PayLoanModalComponent;
  let fixture: ComponentFixture<PayLoanModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayLoanModalComponent]
    });
    fixture = TestBed.createComponent(PayLoanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
