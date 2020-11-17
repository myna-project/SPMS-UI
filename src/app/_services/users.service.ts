import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { User } from '../_models/user';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiResource: string = 'users';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getUsersByUsername(username: string): Observable<User[]> {
    return this.http.get<User[]>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '?username=' + username).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getUser(id: number | string): Observable<User> {
    return this.http.get<User>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + +id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource, user).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + user.id, user).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteUser(user: User | number): Observable<User> {
    const id = typeof user === 'number' ? user : user.id;
    return this.http.delete<User>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
