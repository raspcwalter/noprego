import { Component, EventEmitter, Output } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-put-no-prego-modal',
  templateUrl: './put-no-prego-modal.component.html',
  styleUrls: ['./put-no-prego-modal.component.scss']
})
export class PutNoPregoModalComponent {
  @Output() isPutProject = new EventEmitter<boolean>();

  value!: number;
  ativoValue!: number;

  constructor(private service: DashboardService){

  }

  handleIsPutProject(){
    this.isPutProject.emit(false);
  }

  putNoPrego(){
    let obj = {
      value: this.value,
      ativoValue: this.ativoValue
    }

    this.service.putNoPrego(obj);
  }
}
