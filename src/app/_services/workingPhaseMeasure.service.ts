import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { WorkingPhaseMeasure } from '../_models/workingPhaseMeasure';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class WorkingPhaseMeasureService {

  private poResource: string = 'productionOrders';
  private phaseResource: string = 'workingPhases';
  private measureResource: string = 'measures';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getWorkingPhaseMeasures(id: number | string, sid: number | string): Observable<WorkingPhaseMeasure[]> {
    return this.http.get<WorkingPhaseMeasure[]>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/'  + id + '/' + this.phaseResource + '/' + sid + '/' + this.measureResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getWorkingPhaseMeasure(id: number | string, sid: number | string, mid: number | string): Observable<WorkingPhaseMeasure> {
    return this.http.get<WorkingPhaseMeasure>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + sid + '/' + this.measureResource + '/' + mid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createWorkingPhaseMeasure(id: number | string, sid: number | string, measure: WorkingPhaseMeasure): Observable<any> {
    return this.http.post<WorkingPhaseMeasure>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + sid + '/measures', measure).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateWorkingPhaseMeasure(id: number | string, sid: number | string, mid: number | string, measure: WorkingPhaseMeasure): Observable<any> {
    return this.http.put(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + sid + '/' + this.measureResource + '/' + mid, measure).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteWorkingPhaseMeasure(id: number | string, sid: number | string, mid: number | string): Observable<WorkingPhaseMeasure> {
    return this.http.delete<WorkingPhaseMeasure>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.poResource + '/' + id + '/' + this.phaseResource + '/' + sid + '/' + this.measureResource + '/' + mid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
