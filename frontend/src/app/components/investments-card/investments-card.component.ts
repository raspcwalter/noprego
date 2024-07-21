import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-investments-card',
  templateUrl: './investments-card.component.html',
  styleUrls: ['./investments-card.component.scss']
})
export class InvestmentsCardComponent {
  constructor() {}

  @Input() arr: any[] = [];
  @Output() isWithdraw = new EventEmitter<boolean>()
  @Output() isDeposit = new EventEmitter<boolean>()


  handleWithdraw() {
    this.isWithdraw.emit(true)
  }
  handleDeposit() {
    this.isDeposit.emit(true);
  }
}
