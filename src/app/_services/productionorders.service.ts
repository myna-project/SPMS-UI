import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { ProductionOrder } from '../_models/productionorder';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class ProductionOrdersService {

  private apiResource: string = 'productionOrders';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getProductionOrders(): Observable<ProductionOrder[]> {
    return this.http.get<ProductionOrder[]>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getProductionOrder(id: number | string): Observable<ProductionOrder> {
    return this.http.get<ProductionOrder>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + +id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createProductionOrder(order: ProductionOrder): Observable<ProductionOrder> {
    return this.http.post<ProductionOrder>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource, order).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateProductionOrder(order: ProductionOrder): Observable<any> {
    return this.http.put(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + order.id, order).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteProductionOrder(order: ProductionOrder | number): Observable<ProductionOrder> {
    const id = typeof order === 'number' ? order : order.id;
    return this.http.delete<ProductionOrder>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
