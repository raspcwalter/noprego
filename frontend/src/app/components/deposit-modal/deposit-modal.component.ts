import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss']
})
export class DepositModalComponent {
  @Output() handleCloseModal = new EventEmitter<boolean>();

  value!: number;
  service: any;

  constructor() {}

  closeModal() {
    this.handleCloseModal.emit(false);
  }

  deposit(){
    let obj = {
      value: this.value
    }

    this.service.deposit(obj);
  }

}
