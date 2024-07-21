import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-birth-date',
  templateUrl: './birth-date.component.html',
  styleUrls: ['./birth-date.component.scss'],
})
export class BirthDateComponent {
  day!: number;
  month!: number;
  year!: number;

  constructor(private router: Router) {}

  submitBirthDate() {
    if (this.day === null || this.month === null || this.year === null) {
      alert('Digite uma data válida.');
      return;
    }
    localStorage.setItem('birthDate', `${this.day}/${this.month}/${this.year}`);
    this.router.navigate(['/cadastro/endereco']);
  }
}
