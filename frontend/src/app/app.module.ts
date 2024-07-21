import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardMainComponent } from './pages/dashboard/dashboard-main/dashboard-main.component';
import { FooterComponent } from './pages/dashboard/footer/footer.component';
import { InvestmentsComponent } from './pages/dashboard/investments/investments.component';
import { NavbarComponent } from './pages/dashboard/navbar/navbar.component';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';
import { FirstAccessComponent } from './pages/first-access/first-access.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { DepositModalComponent } from './components/deposit-modal/deposit-modal.component';
import { InvestmentsCardComponent } from './components/investments-card/investments-card.component';
import { PayLoanModalComponent } from './components/pay-loan-modal/pay-loan-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { PutNoPregoModalComponent } from './components/put-no-prego-modal/put-no-prego-modal.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { NameModalComponent } from './pages/first-access/name-modal/name-modal.component';
import { HomeModalComponent } from './pages/first-access/home-modal/home-modal.component';
import { CpfModalComponent } from './pages/first-access/cpf-modal/cpf-modal.component';
import { BirthDateComponent } from './pages/first-access/birth-date/birth-date.component';
import { AddressModalComponent } from './pages/first-access/address-modal/address-modal.component';
import { PhoneModalComponent } from './pages/first-access/phone-modal/phone-modal.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchCountryField } from 'ngx-intl-tel-input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsModalComponent } from './pages/first-access/terms-modal/terms-modal.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardMainComponent,
    FooterComponent,
    InvestmentsComponent,
    NavbarComponent,
    ProfileComponent,
    FirstAccessComponent,
    LoginComponent,
    DashboardCardComponent,
    DepositModalComponent,
    InvestmentsCardComponent,
    PayLoanModalComponent,
    PutNoPregoModalComponent,
    AppComponent,
    NameModalComponent,
    HomeModalComponent,
    CpfModalComponent,
    BirthDateComponent,
    AddressModalComponent,
    PhoneModalComponent,
    TermsModalComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    AngularFireAuthModule,
    FormsModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyD35gyxDyIdU_PLku98rRdOqnRnU3WHUVU',
      authDomain: 'noprego-1f175.firebaseapp.com',
      projectId: 'noprego-1f175',
      storageBucket: 'noprego-1f175.appspot.com',
      messagingSenderId: '394102833164',
      appId: '1:394102833164:web:0dfd354aa2369b9baf2e29',
      measurementId: 'G-8H2GH03S47',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
