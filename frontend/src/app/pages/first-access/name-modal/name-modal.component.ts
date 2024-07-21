import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-name-modal',
  templateUrl: './name-modal.component.html',
  styleUrls: ['./name-modal.component.scss']
})
export class NameModalComponent {

  userName: string = "";

  constructor(private router: Router){

  }

  submitName(){
    if(this.userName === ""){
      alert("Digite um nome válido.")
      return;
    }

    localStorage.setItem("name", this.userName)
    this.router.navigate(['cadastro/cpf'])
  }

}
