import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CleaningPhase } from '../_models/cleaningPhase';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class CleaningPhaseService {

  private poResource: string = 'productionOrders';
  private phaseResource: string = 'cleaningPhases';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getCleaningPhases(id: number | string): Observable<CleaningPhase[]> {
    return this.http.get<CleaningPhase[]>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getCleaningPhase(id: number | string, sid: number | string): Observable<CleaningPhase> {
    return this.http.get<CleaningPhase>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + sid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createCleaningPhase(id: number | string, cleaningPhase: CleaningPhase): Observable<any> {
    return this.http.post<CleaningPhase>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource, cleaningPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateCleaningPhase(id: number | string, cleaningPhase: CleaningPhase): Observable<any> {
    return this.http.put(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + cleaningPhase.id, cleaningPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteCleaningPhase(id: number | string, cleaningPhase: CleaningPhase): Observable<CleaningPhase> {
    return this.http.delete<CleaningPhase>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + cleaningPhase.id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
