import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Additive } from '../_models/additive';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class AdditivesService {

  private apiResource: string = 'additives';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getAdditives(): Observable<Additive[]> {
    return this.http.get<Additive[]>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getAdditive(id: number | string): Observable<Additive> {
    return this.http.get<Additive>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource + '/' + +id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createAdditive(additive: Additive): Observable<Additive> {
    return this.http.post<Additive>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource, additive).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateAdditive(additive: Additive): Observable<any> {
    return this.http.put(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource + '/' + additive.id, additive).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteAdditive(additive: Additive | number): Observable<Additive> {
    const id = typeof additive === 'number' ? additive : additive.id;
    return this.http.delete<Additive>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource + '/' + id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
