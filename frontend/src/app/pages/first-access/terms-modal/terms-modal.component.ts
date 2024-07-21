import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CadastroService } from 'src/app/services/cadastro.service';

@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.scss']
})
export class TermsModalComponent {

  constructor(private router: Router, private service: CadastroService){

  }

  submitForm(){
    let obj = {
      name: localStorage.getItem("name"),
      cep: localStorage.getItem("cep"),
      complement: localStorage.getItem("complement"),
      state: localStorage.getItem("state"),
      cpf: localStorage.getItem("cpf"),
      mainAddress: localStorage.getItem("mainAddress"),
      city: localStorage.getItem("city"),
      country: localStorage.getItem("country"),
      phoneNumber: localStorage.getItem("phoneNumber"),
    }
    console.log(localStorage)
    
    this.service.submitUser(obj);
    // this.router.navigate(['/dashboard'])
  }

}
