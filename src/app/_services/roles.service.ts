import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Role } from '../_models/role';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class RolesService {

  private apiResource: string = 'roles';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getRole(id: number | string): Observable<Role> {
    return this.http.get<Role>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource + '/' + +id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
