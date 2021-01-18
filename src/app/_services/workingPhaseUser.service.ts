import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { WorkingPhaseUser } from '../_models/workingPhaseUser';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class WorkingPhaseUserService {

    private poResource: string = 'productionOrders';
    private phaseResource: string = 'workingPhases';
    private userResource: string = 'shifts';

    constructor(private http: HttpClient,
		private httpUtils: HttpUtils) {}

    getWorkingPhaseUsers(id: number | string, sid: number | string): Observable<WorkingPhaseUser[]> {
        return this.http.get<WorkingPhaseUser[]>(
            environment.apiEndPoint
                + this.httpUtils.getAdminUrl()
                + this.poResource + '/'
                + id + '/'
                + this.phaseResource + '/'
                + sid + '/'
                + this.userResource
        ).pipe(
            catchError((err) => { return throwError(err); })
        );
    }

    getWorkingPhaseUser(id: number | string, sid: number | string, uid: number | string): Observable<WorkingPhaseUser> {
        return this.http.get<WorkingPhaseUser>(
            environment.apiEndPoint
                + this.httpUtils.getAdminUrl()
                + this.poResource + '/'
                + id + '/'
                + this.phaseResource + '/'
                + sid + '/'
                + this.userResource + '/'
                + uid).pipe(
                    catchError((err) => { return throwError(err); })
                );
    }

    createWorkingPhaseUser(user: WorkingPhaseUser): Observable<any> {
        return this.http.post<WorkingPhaseUser>(
            environment.apiEndPoint
                + this.httpUtils.getAdminUrl()
                + this.poResource + '/'
                + user.workingPhase.productionOrder.id + '/'
                + this.phaseResource + '/'
                + user.workingPhase.id + '/'
                + this.userResource
            , user).pipe(
                catchError((err) => { return throwError(err); })
            );
    }

    updateWorkingPhaseUser(user: WorkingPhaseUser): Observable<any> {
        return this.http.put(
            environment.apiEndPoint
                + this.httpUtils.getAdminUrl()
                + this.poResource + '/'
                + user.workingPhase.productionOrder.id + '/'
                + this.phaseResource + '/'
                + user.workingPhase.id + '/'
                + this.userResource + '/'
                + user.id
            , user).pipe(
                catchError((err) => { return throwError(err); })
            );
    }

    deleteWorkingPhaseUser(user: WorkingPhaseUser): Observable<WorkingPhaseUser> {
        return this.http.delete<WorkingPhaseUser>(
            environment.apiEndPoint
                + this.httpUtils.getAdminUrl()
                + this.poResource + '/'
                + user.workingPhase.productionOrder.id + '/'
                + this.phaseResource + '/'
                + user.workingPhase.id + '/'
                + this.userResource + '/'
                + user.id
        ).pipe(
            catchError((err) => { return throwError(err); })
        );
    }
}
