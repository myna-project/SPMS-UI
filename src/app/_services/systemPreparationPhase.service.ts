import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { SystemPreparationPhase } from '../_models/systemPreparationPhase';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class SystemPreparationPhaseService {

    private poResource: string = 'productionOrders';
    private phaseResource: string = 'systemPreparationPhases';

    constructor(private http: HttpClient,
		private httpUtils: HttpUtils) {}

    getSystemPreparationPhases(id: number | string): Observable<SystemPreparationPhase[]> {
	return this.http.get<SystemPreparationPhase[]>(
	    environment.apiEndPoint
		+ this.httpUtils.getAdminUrl()
		+ this.poResource + '/'
		+ id + '/'
		+ this.phaseResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

    getSystemPreparationPhase(id: number | string, sid: number | string): Observable<SystemPreparationPhase> {
	return this.http.get<SystemPreparationPhase>(
	    environment.apiEndPoint
		+ this.httpUtils.getAdminUrl()
		+ this.poResource + '/'
		+ id + '/'
		+ this.phaseResource + '/'
		+ sid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createSystemPreparationPhase(systemPreparationPhase: SystemPreparationPhase): Observable<any> {
      return this.http.post<SystemPreparationPhase>(
	  environment.apiEndPoint
	      + this.httpUtils.getAdminUrl()
	      + this.poResource + '/'
	      + systemPreparationPhase.productionOrder.id + '/'
	      + this.phaseResource, systemPreparationPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateSystemPreparationPhase(systemPreparationPhase: SystemPreparationPhase): Observable<any> {
      return this.http.put(
	  environment.apiEndPoint
	  + this.httpUtils.getAdminUrl()
	  + this.poResource + '/'
	  + systemPreparationPhase.productionOrder.id + '/'
	  + this.phaseResource + '/'
	      + systemPreparationPhase.id, systemPreparationPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteSystemPreparationPhase(systemPreparationPhase: SystemPreparationPhase): Observable<SystemPreparationPhase> {
      return this.http.delete<SystemPreparationPhase>(
	  environment.apiEndPoint
	  + this.httpUtils.getAdminUrl()
	  + this.poResource + '/'
	  + systemPreparationPhase.productionOrder.id + '/'
	  + this.phaseResource + '/'
	  + systemPreparationPhase.id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
