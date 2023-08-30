import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'https://localhost:7099';
  token = localStorage.getItem('token');
  httpOptions = {headers: new HttpHeaders(
    {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
    })};

  constructor(private http: HttpClient) { }

    get(path: string): Observable<any> {
        return this.http.get(this.apiUrl + path, this.httpOptions);
    }

    post(path: string, payload: any): Observable<any> {
        return this.http.post(this.apiUrl + path, payload, this.httpOptions);
    }

    put(path: string, payload: any): Observable<any> {
        return this.http.put(this.apiUrl + path, payload, this.httpOptions);
    }

    delete(path: string): Observable<any> {
        return this.http.delete(this.apiUrl + path, this.httpOptions);
    }
}