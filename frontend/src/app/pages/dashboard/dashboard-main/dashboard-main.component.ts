import { Component } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent {
  isPutProject: boolean = false;
  isPayLoan: boolean = false;
  obj: any[] = [];

  constructor(private service: DashboardService){
    this.getObj();
  }

  getObj(){
    this.obj = this.service.getObras();
  }

  pessoa: any = {
    emprestimos: 50,
    garantias: 100
  }

  handleIsPutProject(event: boolean) {
    this.isPutProject = event;
  }

  handleIsPayLoan(event: boolean){
    this.isPayLoan = event;
  }

  redirectObjectTypeform(){
    window.location.href = 'https://g7v0scf2v0s.typeform.com/to/eclE5bGB';
  }
}
