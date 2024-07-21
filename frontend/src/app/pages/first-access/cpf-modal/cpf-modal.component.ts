import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cpf-modal',
  templateUrl: './cpf-modal.component.html',
  styleUrls: ['./cpf-modal.component.scss']
})
export class CpfModalComponent {
  userCpf!: number;

  constructor(private router: Router){

  }

  submitCpf(){
    if(this.userCpf === null){
      alert("Digite um CPF válido.")
      return;
    }
    localStorage.setItem("cpf", this.userCpf.toString())
    this.router.navigate(['/cadastro/data-de-nascimento'])
  }

}
