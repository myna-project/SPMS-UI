import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';

import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) {}

  public getCurrentUser(): User {
    let currentUser = <User>JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser === null || currentUser === undefined) {
      return null;
    } else {
      if (currentUser.isLogged)
        return currentUser;
    }
    return null;
  }

  login(username: string, password: string): Observable<HttpResponse<any>> {
    const payload = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post(environment.apiEndPoint + 'authenticate', payload, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  observe: 'response' });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.http.post(environment.apiEndPoint + 'logout', null).pipe().subscribe();
    this.router.navigate(['/login']);
  }
}
