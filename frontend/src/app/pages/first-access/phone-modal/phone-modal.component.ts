import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phone-modal',
  templateUrl: './phone-modal.component.html',
  styleUrls: ['./phone-modal.component.scss']
})
export class PhoneModalComponent {
  phoneNumber: string = ""

  constructor(private router: Router){

  }

  submitPhone(){
    if(this.phoneNumber === ""){
      alert("Digite um número de telefone!")
      return;
    }

    localStorage.setItem('phoneNumber', this.phoneNumber);
    this.router.navigate(["/cadastro/termos-de-uso"])
  }

}
