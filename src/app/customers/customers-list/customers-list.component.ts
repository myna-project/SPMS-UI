import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Customer } from '../../_models/customer';

import { CustomersService } from '../../_services/customers.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersComponent implements OnInit {

  isLoading: boolean = true;
  customers: Customer[];
  filteredCustomers: Customer[];

  constructor(private customersService: CustomersService, private router: Router, private httpUtils: HttpUtils) {}

  ngOnInit(): void {
    this.customersService.getCustomers().subscribe(
      (customers: Customer[]) => {
        customers.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        this.customers = customers;
        this.filteredCustomers = customers;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

  search(term: string): void {
    this.filteredCustomers = this.customers.filter(function(customer) {
      return (customer.name.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    });
  }

  edit(id: number): void {
    this.router.navigate(['customer/' + id]);
  }
}
