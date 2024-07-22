import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss'],
})
export class AddressModalComponent {

  userAddress: string = "";
  userAddress2: string = "";
  city: string = "";
  state: string = "";
  cep: string = "";
  country: string = "";

  constructor(private router: Router) {}

  submitAddress() {

    if (this.userAddress === '' || this.city === '' || this.state === '' || this.cep === '' || this.country === '') {
      alert('Preencha todos os campos!');
      return;
    }

    localStorage.setItem('mainAddress', this.userAddress);
    localStorage.setItem('complement', this.userAddress2);
    localStorage.setItem('city', this.city);
    localStorage.setItem('state', this.state);
    localStorage.setItem('cep', this.cep);
    localStorage.setItem('country', this.country);

    this.router.navigate(['/cadastro/telefone']);
  }
}
