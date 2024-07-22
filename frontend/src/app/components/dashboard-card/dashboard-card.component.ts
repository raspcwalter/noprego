import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {
  isNoPrego: boolean = true;
  isProject: boolean = true;
  arr!: any[];

  constructor(){
  }

  @Input() thList: string[] = [];
  @Input() name: string = "";
  @Input() valor: string = "";
  @Input() status: string = "";
  @Input() obras: any[] = [];
  @Input() title: string = "";
  @Output() valueIsPutProject = new EventEmitter<boolean>();
  @Output() IsPayLoan = new EventEmitter<boolean>();

  handleIsPutProject(){
    this.valueIsPutProject.emit(true);
  }

  handleIsPayLoan(){
    this.IsPayLoan.emit(true);
  }
}
