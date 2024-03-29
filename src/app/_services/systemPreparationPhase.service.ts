import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SystemPreparationPhase } from '../_models/systemPreparationPhase';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class SystemPreparationPhaseService {

  private poResource: string = 'productionOrders';
  private phaseResource: string = 'systemPreparationPhases';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getSystemPreparationPhases(id: number | string): Observable<SystemPreparationPhase[]> {
    return this.http.get<SystemPreparationPhase[]>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getSystemPreparationPhase(id: number | string, sid: number | string): Observable<SystemPreparationPhase> {
    return this.http.get<SystemPreparationPhase>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + sid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createSystemPreparationPhase(id: number | string, systemPreparationPhase: SystemPreparationPhase): Observable<any> {
    return this.http.post<SystemPreparationPhase>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource, systemPreparationPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateSystemPreparationPhase(id: number | string, systemPreparationPhase: SystemPreparationPhase): Observable<any> {
    return this.http.put(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + systemPreparationPhase.id, systemPreparationPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteSystemPreparationPhase(id: number | string, systemPreparationPhase: SystemPreparationPhase): Observable<SystemPreparationPhase> {
    return this.http.delete<SystemPreparationPhase>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + systemPreparationPhase.id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
