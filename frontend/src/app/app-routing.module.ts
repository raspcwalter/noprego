import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardMainComponent } from './pages/dashboard/dashboard-main/dashboard-main.component';
import { InvestmentsComponent } from './pages/dashboard/investments/investments.component';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';
import { FirstAccessComponent } from './pages/first-access/first-access.component';
import { HomeModalComponent } from './pages/first-access/home-modal/home-modal.component';
import { NameModalComponent } from './pages/first-access/name-modal/name-modal.component';
import { CpfModalComponent } from './pages/first-access/cpf-modal/cpf-modal.component';
import { BirthDateComponent } from './pages/first-access/birth-date/birth-date.component';
import { AddressModalComponent } from './pages/first-access/address-modal/address-modal.component';
import { PhoneModalComponent } from './pages/first-access/phone-modal/phone-modal.component';
import { TermsModalComponent } from './pages/first-access/terms-modal/terms-modal.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardMainComponent },
      { path: 'dashboard-main', component: DashboardMainComponent },
      { path: 'investimentos', component: InvestmentsComponent },
      { path: 'perfil', component: ProfileComponent },
    ],
  },
  {
    path: 'cadastro',
    component: FirstAccessComponent,
    children: [
      { path: '', component: HomeModalComponent },
      { path: 'name', component: NameModalComponent },
      { path: 'cpf', component: CpfModalComponent },
      { path: 'data-de-nascimento', component: BirthDateComponent },
      { path: 'endereco', component: AddressModalComponent },
      { path: 'telefone', component: PhoneModalComponent },
      { path: 'termos-de-uso', component: TermsModalComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
