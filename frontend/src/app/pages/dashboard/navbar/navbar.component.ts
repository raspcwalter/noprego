import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  email = localStorage.getItem("email");  
  url: string = `https://g7v0scf2v0s.typeform.com/to/eclE5bGB#email=${this.email}`
}
