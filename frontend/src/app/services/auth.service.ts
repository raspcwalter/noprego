import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private route: Router) { }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const credential = await this.afAuth.signInWithPopup(provider);
      if(!credential.additionalUserInfo?.isNewUser){
        const address =  await this.isNoPregoUser(credential.user?.email);
        if (address) {
          this.route.navigate(['/dashboard'])
        } else {
          window.location.href = 'https://g7v0scf2v0s.typeform.com/to/WFJHQOvh#email='+credential.user?.email;
        }
        return;
      }      
      console.log('User signed in: ', credential.additionalUserInfo);
    } catch (error) {
      console.error('Error during sign in: ', error);
    }
  }

  async isNoPregoUser(gmail:any) {
    try {
      const response = await fetch('https://noprego-api-test.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: gmail }),
      });
      const data = await response.json();
      return data.address;
    } catch (error) {
      console.error('Error checking email in database: ', error);
      return false; 
    }
  }

  async signOut() {
    try {
      await this.afAuth.signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Error during sign out: ', error);
    }
  }
}
