import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { CleaningPhase } from '../_models/cleaningPhase';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class CleaningPhaseService {

    private poResource: string = 'productionOrders';
    private phaseResource: string = 'cleaningPhases';

    constructor(private http: HttpClient,
		private httpUtils: HttpUtils) {}

    getCleaningPhases(id: number | string): Observable<CleaningPhase[]> {
	return this.http.get<CleaningPhase[]>(
	    environment.apiEndPoint
		+ this.httpUtils.getAdminUrl()
		+ this.poResource + '/'
		+ id + '/'
		+ this.phaseResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

    getCleaningPhase(id: number | string, sid: number | string): Observable<CleaningPhase> {
	return this.http.get<CleaningPhase>(
	    environment.apiEndPoint
		+ this.httpUtils.getAdminUrl()
		+ this.poResource + '/'
		+ id + '/'
		+ this.phaseResource + '/'
		+ sid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createCleaningPhase(cleaningPhase: CleaningPhase): Observable<any> {
      return this.http.post<CleaningPhase>(
	  environment.apiEndPoint
	      + this.httpUtils.getAdminUrl()
	      + this.poResource + '/'
	      + cleaningPhase.productionOrder.id + '/'
	      + this.phaseResource, cleaningPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateCleaningPhase(cleaningPhase: CleaningPhase): Observable<any> {
      return this.http.put(
	  environment.apiEndPoint
	  + this.httpUtils.getAdminUrl()
	  + this.poResource + '/'
	  + cleaningPhase.productionOrder.id + '/'
	  + this.phaseResource + '/'
	      + cleaningPhase.id, cleaningPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteCleaningPhase(cleaningPhase: CleaningPhase): Observable<CleaningPhase> {
      return this.http.delete<CleaningPhase>(
	  environment.apiEndPoint
	  + this.httpUtils.getAdminUrl()
	  + this.poResource + '/'
	  + cleaningPhase.productionOrder.id + '/'
	  + this.phaseResource + '/'
	  + cleaningPhase.id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}