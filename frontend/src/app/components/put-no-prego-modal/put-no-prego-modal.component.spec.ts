import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutNoPregoModalComponent } from './put-no-prego-modal.component';

describe('PutNoPregoModalComponent', () => {
  let component: PutNoPregoModalComponent;
  let fixture: ComponentFixture<PutNoPregoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PutNoPregoModalComponent]
    });
    fixture = TestBed.createComponent(PutNoPregoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
