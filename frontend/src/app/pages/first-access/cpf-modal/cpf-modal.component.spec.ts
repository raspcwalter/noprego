import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpfModalComponent } from './cpf-modal.component';

describe('CpfModalComponent', () => {
  let component: CpfModalComponent;
  let fixture: ComponentFixture<CpfModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CpfModalComponent]
    });
    fixture = TestBed.createComponent(CpfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
