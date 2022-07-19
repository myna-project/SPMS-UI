import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../../_guards/pending-changes.guard';

import { Customer } from '../../_models/customer';

import { CustomersService } from '../../_services/customers.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.customerForm.touched;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  customer: Customer = new Customer();
  customerForm: FormGroup;
  backRoute: string = 'customers';

  constructor(private customersService: CustomersService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe((params: any) => {
      var customerId = params.get('id');
      if (customerId) {
        this.customersService.getCustomer(customerId).subscribe(
          (response: Customer) => {
            this.customer = response;
            this.createForm();
            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            const dialogRef = this.httpUtils.errorDialog(error);
            dialogRef.afterClosed().subscribe((_value: any) => {
              this.router.navigate([this.backRoute]);
            });
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  get name() { return this.customerForm.get('name'); }

  createForm() {
    this.customerForm = new FormGroup({
      'name': new FormControl(this.customer.name, [ Validators.required ])
    });
  }

  save(): void {
    this.isSaving = true;
    let newCustomer: Customer = this.customerForm.value;
    if (this.customer.id !== undefined) {
      newCustomer.id = this.customer.id;
      this.customersService.updateCustomer(newCustomer).subscribe(
        (response: Customer) => {
          this.customer = response;
          this.isSaving = false;
          this.customerForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('CUSTOMER.SAVED'));
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.customersService.createCustomer(newCustomer).subscribe(
        (response: Customer) => {
          this.customer = response;
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('CUSTOMER.SAVED'));
          this.customerForm.markAsUntouched();
          this.router.navigate(['customer/' + this.customer.id]);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('CUSTOMER.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
        this.isDeleting = true;
        this.customersService.deleteCustomer(this.customer).subscribe(
          (_response: Customer) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('CUSTOMER.DELETED'));
            this.customerForm.markAsUntouched();
            this.router.navigate([this.backRoute]);
          },
          (error: HttpErrorResponse) => {
            this.isDeleting = false;
            this.httpUtils.errorDialog(error);
          }
        );
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
