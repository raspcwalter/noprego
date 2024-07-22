import { Component, EventEmitter, Output } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-pay-loan-modal',
  templateUrl: './pay-loan-modal.component.html',
  styleUrls: ['./pay-loan-modal.component.scss']
})
export class PayLoanModalComponent {
  @Output() isPayLoan = new EventEmitter<boolean>();

  value!: number;

  constructor(private service: DashboardService){

  }

  handleIsPayLoan() {
      this.isPayLoan.emit(false);
  }

  payLoan(){
    let obj = {
      value: this.value
    }

    this.service.payLoan(obj);
  }
}
