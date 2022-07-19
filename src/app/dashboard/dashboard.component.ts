import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProductionOrder } from '../_models/productionorder';

import { ProductionOrdersService } from '../_services/productionorders.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  isLoading: boolean = true;
  productionorders: ProductionOrder[] = [];

  constructor(private productionordersService: ProductionOrdersService, private router: Router, private httpUtils: HttpUtils) {}

  ngOnInit(): void {
    this.productionordersService.getProductionOrders().subscribe(
      (productionorders: ProductionOrder[]) => {
        productionorders.sort((a, b) => a.production_order_date < b.production_order_date ? -1 : a.production_order_date > b.production_order_date ? 1 : 0);
        this.productionorders = productionorders.filter((po) => !po.completed);
        this.productionorders.forEach((po) => {
          if (po.production_order_date)
            po.production_order_date_string = this.httpUtils.getLocaleDateString(po.production_order_date);
          if (po.delivery_date)
            po.delivery_date_string = this.httpUtils.getLocaleDateString(po.delivery_date);
        });
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

  start(id: number): void {
    this.router.navigate(['productionOrder/' + id + '/phases']);
  }
}
