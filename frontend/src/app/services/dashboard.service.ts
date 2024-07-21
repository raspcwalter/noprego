import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  

  constructor(private http: HttpClient) {}

  obras = [
    {
      id: 1,
      name: 'Obra1',
      value: 10.0,
      status: true,
      cofre: '001',
      time: '16/08/1997',
      valueEmp: 8.0,
      performance: '7%',
    },
    {
      id: 2,
      name: 'Teste de obra com nome maior, testando se vai quebrar a linha',
      value: 10.0,
      status: false,
      cofre: '001',
      time: '16/08/1997',
      valueEmp: 8.0,
      performance: '7%',
    },
  ];

  getObras(): any[] {
    return this.obras;
  }

  putNoPrego(obj: any){
    if(!obj) return;
    this.http.post<any>(`${environment.apiUrl}endpoint`, obj).subscribe(res => {
      console.log(res);
    });
  }

  payLoan(obj: any) {
    if(!obj) return;
    this.http.post<any>(`${environment.apiUrl}endpoint`, obj).subscribe(res => {
      console.log(res);
    })
  }

  deposit(obj: any){
    this.http.post<any>(`${environment.apiUrl}endpoint`, obj).subscribe(res => {
      console.log(res)
    })
  }

}
