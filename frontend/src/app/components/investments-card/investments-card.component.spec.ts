import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsCardComponent } from './investments-card.component';

describe('InvestmentsCardComponent', () => {
  let component: InvestmentsCardComponent;
  let fixture: ComponentFixture<InvestmentsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentsCardComponent]
    });
    fixture = TestBed.createComponent(InvestmentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
