import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ProductionOrder } from '../_models/productionorder';

import { ProductionOrdersService } from '../_services/productionorders.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private productionordersService: ProductionOrdersService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  isLoading: boolean = true;
  productionorders: ProductionOrder[] = [];

  ngOnInit(): void {
    this.productionordersService.getProductionOrders().subscribe(
      (productionorders) => {
        productionorders.sort((a, b) => a.production_order_date < b.production_order_date ? -1 : a.production_order_date > b.production_order_date ? 1 : 0);
        this.productionorders = productionorders.filter((po) => !po.completed);
        this.productionorders.forEach((po) => {
          po.production_order_date_string = this.httpUtils.getLocaleDateString(po.production_order_date);
          po.delivery_date_string = this.httpUtils.getLocaleDateString(po.delivery_date);
        });
        this.isLoading = false;
      },
      (error) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

  start(id: number): void {
    this.router.navigate(['productionOrder/' + id + '/phases']);
  }
}
