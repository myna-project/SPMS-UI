import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { MixtureMode } from '../_models/mixturemode';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class MixtureModesService {

  private apiResource: string = 'mixtureModes';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getMixtureModes(): Observable<MixtureMode[]> {
    return this.http.get<MixtureMode[]>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getMixtureMode(id: number | string): Observable<MixtureMode> {
    return this.http.get<MixtureMode>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource + '/' + +id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createMixtureMode(mixturemode: MixtureMode): Observable<MixtureMode> {
    return this.http.post<MixtureMode>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource, mixturemode).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateMixtureMode(mixturemode: MixtureMode): Observable<any> {
    return this.http.put(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource + '/' + mixturemode.id, mixturemode).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteMixtureMode(mixturemode: MixtureMode | number): Observable<MixtureMode> {
    const id = typeof mixturemode === 'number' ? mixturemode : mixturemode.id;
    return this.http.delete<MixtureMode>(this.httpUtils.getAPIEndpoint() + this.httpUtils.getAdminUrl() + this.apiResource + '/' + id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
