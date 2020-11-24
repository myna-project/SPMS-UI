import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { Packaging } from '../_models/packaging';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class PackagingsService {

  private apiResource: string = 'packagings';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getPackagings(): Observable<Packaging[]> {
    return this.http.get<Packaging[]>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getPackaging(id: number | string): Observable<Packaging> {
    return this.http.get<Packaging>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + +id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createPackaging(packaging: Packaging): Observable<Packaging> {
    return this.http.post<Packaging>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource, packaging).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updatePackaging(packaging: Packaging): Observable<any> {
    return this.http.put(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + packaging.id, packaging).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deletePackaging(packaging: Packaging | number): Observable<Packaging> {
    const id = typeof packaging === 'number' ? packaging : packaging.id;
    return this.http.delete<Packaging>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
