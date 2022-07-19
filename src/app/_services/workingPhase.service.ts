import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { WorkingPhase } from '../_models/workingPhase';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class WorkingPhaseService {

  private poResource: string = 'productionOrders';
  private phaseResource: string = 'workingPhases';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getWorkingPhases(id: number | string): Observable<WorkingPhase[]> {
    return this.http.get<WorkingPhase[]>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getWorkingPhase(id: number | string, sid: number | string): Observable<WorkingPhase> {
    return this.http.get<WorkingPhase>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + sid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createWorkingPhase(id: number | string, workingPhase: WorkingPhase): Observable<any> {
    return this.http.post<WorkingPhase>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource, workingPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateWorkingPhase(id: number | string, workingPhase: WorkingPhase): Observable<any> {
    return this.http.put(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + workingPhase.id, workingPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteWorkingPhase(id: number | string, workingPhase: WorkingPhase): Observable<WorkingPhase> {
    return this.http.delete<WorkingPhase>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + workingPhase.id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
