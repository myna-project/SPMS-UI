import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
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
  backRoute = 'customers';

  constructor(private customersService: CustomersService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe(params => {
      var customerId = params.get('id');
      if (customerId) {
        this.customersService.getCustomer(customerId).subscribe(
          (response) => {
            this.customer = response;
            this.createForm();
            this.isLoading = false;
          },
          (error) => {
            const dialogRef = this.httpUtils.errorDialog(error);
            dialogRef.afterClosed().subscribe(value => {
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
        (response) => {
          this.customer = response;
          this.isSaving = false;
          this.customerForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('CUSTOMER.SAVED'));
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.customersService.createCustomer(newCustomer).subscribe(
        (response) => {
          this.customer = response;
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('CUSTOMER.SAVED'));
          this.customerForm.markAsUntouched();
          this.router.navigate(['customer/' + this.customer.id]);
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('CUSTOMER.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isDeleting = true;
        this.customersService.deleteCustomer(this.customer).subscribe(
          (response) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('CUSTOMER.DELETED'));
            this.customerForm.markAsUntouched();
            this.router.navigate([this.backRoute]);
          },
          (error) => {
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