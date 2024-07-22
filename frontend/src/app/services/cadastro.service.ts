import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(private http: HttpClient) { }

  submitUser(obj: any){
    if(!obj) return;
    this.http.post<any>(`${environment.apiUrl}endpoint`, obj).subscribe(res => {
      console.log(res);
    })
  }
}
