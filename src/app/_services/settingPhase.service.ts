import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { SettingPhase } from '../_models/settingPhase';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class SettingPhaseService {

    private poResource: string = 'productionOrders';
    private phaseResource: string = 'settingPhases';

    constructor(private http: HttpClient,
		private httpUtils: HttpUtils) {}

    getSettingPhases(id: number | string): Observable<SettingPhase[]> {
	return this.http.get<SettingPhase[]>(
	    environment.apiEndPoint
		+ this.httpUtils.getAdminUrl()
		+ this.poResource + '/'
		+ id + '/'
		+ this.phaseResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

    getSettingPhase(id: number | string, sid: number | string): Observable<SettingPhase> {
	return this.http.get<SettingPhase>(
	    environment.apiEndPoint
		+ this.httpUtils.getAdminUrl()
		+ this.poResource + '/'
		+ id + '/'
		+ this.phaseResource + '/'
		+ sid).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createSettingPhase(settingPhase: SettingPhase): Observable<any> {
      return this.http.post<SettingPhase>(
	  environment.apiEndPoint
	      + this.httpUtils.getAdminUrl()
	      + this.poResource + '/'
	      + settingPhase.productionOrder.id + '/'
	      + this.phaseResource, settingPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateSettingPhase(settingPhase: SettingPhase): Observable<any> {
      return this.http.put(
	  environment.apiEndPoint
	  + this.httpUtils.getAdminUrl()
	  + this.poResource + '/'
	  + settingPhase.productionOrder.id + '/'
	  + this.phaseResource + '/'
	      + settingPhase.id, settingPhase).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteSettingPhase(settingPhase: SettingPhase): Observable<SettingPhase> {
      return this.http.delete<SettingPhase>(
	  environment.apiEndPoint
	  + this.httpUtils.getAdminUrl()
	  + this.poResource + '/'
	  + settingPhase.productionOrder.id + '/'
	  + this.phaseResource + '/'
	  + settingPhase.id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
