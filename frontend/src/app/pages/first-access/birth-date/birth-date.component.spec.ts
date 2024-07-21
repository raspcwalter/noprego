import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthDateComponent } from './birth-date.component';

describe('BirthDateComponent', () => {
  let component: BirthDateComponent;
  let fixture: ComponentFixture<BirthDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BirthDateComponent]
    });
    fixture = TestBed.createComponent(BirthDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
