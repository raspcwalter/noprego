import { Component } from '@angular/core';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss']
})
export class InvestmentsComponent {
  constructor() {}

  isDeposit: boolean = false;
  isWithDraw: boolean = false;

  handleIsWithdraw(event: boolean) {
    this.isWithDraw = event;
  }
  handleIsDeposit(event: boolean) {
    this.isDeposit = event;
  }
}
