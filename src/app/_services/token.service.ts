import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  constructor(private http: HttpClient) {}

  getToken(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(environment.apiEndPoint + 'token', {  observe: 'response' });
  }
}
