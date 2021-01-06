import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { WorkingPhase } from '../_models/workingPhase';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class WorkingPhaseService {

    private poResource: string = 'productionOrders';
    private phaseResource: string = 'workingPhases';

    constructor(private http: HttpClient,
		private httpUtils: HttpUtils) {}

    getWorkingPhases(id: number | string): Observable<WorkingPhase[]> {
	return this.http.get<WorkingPhase[]>(
	    environment.apiEndPoint
		+ this.httpUtils.getAdminUrl()
		+ this.poResource + '/'
		+ id + '/'
		+ this.phaseResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

    getWorkingPhase(id: number | string, sid: number | string): Observable<WorkingPhase> {
	return this.http.get<WorkingPhase>(
	    environment.apiEndPoint
		+ this.httpUtils.getAdminUrl()
		+ this.poResource + '/'
		+ id + '/'
		+ this.phaseResource + '/'
		+ sid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createWorkingPhase(workingPhase: WorkingPhase): Observable<any> {
      return this.http.post<WorkingPhase>(
	  environment.apiEndPoint
	      + this.httpUtils.getAdminUrl()
	      + this.poResource + '/'
	      + workingPhase.productionOrder.id + '/'
	      + this.phaseResource, workingPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateWorkingPhase(workingPhase: WorkingPhase): Observable<any> {
      return this.http.put(
	  environment.apiEndPoint
	  + this.httpUtils.getAdminUrl()
	  + this.poResource + '/'
	  + workingPhase.productionOrder.id + '/'
	  + this.phaseResource + '/'
	      + workingPhase.id, workingPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteWorkingPhase(workingPhase: WorkingPhase): Observable<WorkingPhase> {
      return this.http.delete<WorkingPhase>(
	  environment.apiEndPoint
	  + this.httpUtils.getAdminUrl()
	  + this.poResource + '/'
	  + workingPhase.productionOrder.id + '/'
	  + this.phaseResource + '/'
	  + workingPhase.id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
