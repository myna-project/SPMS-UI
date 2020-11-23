import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { Customer } from '../_models/customer';

import { HttpUtils } from '../_utils/http.utils';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {

  private apiResource: string = 'customers';

  constructor(private http: HttpClient, private httpUtils: HttpUtils) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  getCustomer(id: number | string): Observable<Customer> {
    return this.http.get<Customer>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + +id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource, customer).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + customer.id, customer).pipe(
      catchError((err) => { return throwError(err); })
    );
  }

  deleteCustomer(customer: Customer | number): Observable<Customer> {
    const id = typeof customer === 'number' ? customer : customer.id;
    return this.http.delete<Customer>(environment.apiEndPoint + this.httpUtils.getAdminUrl() + this.apiResource + '/' + id).pipe(
      catchError((err) => { return throwError(err); })
    );
  }
}
