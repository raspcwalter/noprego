import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService, private route: Router){}

  signInWithGoogle() {
    this.authService.googleSignIn();
  }

  signOut() {
    this.authService.signOut();
  }

}
