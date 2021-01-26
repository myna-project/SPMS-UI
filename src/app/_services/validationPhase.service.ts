import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { ValidationPhase } from '../_models/validationPhase';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class ValidationPhaseService {

    private poResource: string = 'productionOrders';
    private phaseResource: string = 'validationPhases';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getValidationPhases(id: number | string): Observable<ValidationPhase[]> {
    return this.http.get<ValidationPhase[]>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getValidationPhase(id: number | string, sid: number | string): Observable<ValidationPhase> {
    return this.http.get<ValidationPhase>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + sid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createValidationPhase(id: number | string, validationPhase: ValidationPhase): Observable<any> {
    return this.http.post<ValidationPhase>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource, validationPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateValidationPhase(id: number | string, validationPhase: ValidationPhase): Observable<any> {
    return this.http.put(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + validationPhase.id, validationPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteValidationPhase(id: number | string, validationPhase: ValidationPhase): Observable<ValidationPhase> {
    return this.http.delete<ValidationPhase>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + validationPhase.id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
