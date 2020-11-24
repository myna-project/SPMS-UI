import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { RawMaterial } from '../_models/rawmaterial';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class RawMaterialsService {

  private apiResource: string = 'rawMaterials';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getRawMaterial(id: number | string): Observable<RawMaterial> {
    return this.http.get<RawMaterial>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + +id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createRawMaterial(material: RawMaterial): Observable<RawMaterial> {
    return this.http.post<RawMaterial>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource, material).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateRawMaterial(material: RawMaterial): Observable<any> {
    return this.http.put(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + material.id, material).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteRawMaterial(material: RawMaterial | number): Observable<RawMaterial> {
    const id = typeof material === 'number' ? material : material.id;
    return this.http.delete<RawMaterial>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
