import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ProductionOrder } from '../../_models/productionorder';

import { ProductionOrdersService } from '../../_services/productionorders.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './productionorders-list.component.html',
  styleUrls: ['./productionorders-list.component.scss']
})
export class ProductionOrdersComponent implements OnInit {

  isLoading: boolean = true;
  productionorders: ProductionOrder[] = [];
  filteredProductionOrders: ProductionOrder[];

  constructor(private productionordersService: ProductionOrdersService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.productionordersService.getProductionOrders().subscribe(
      (productionorders) => {
        productionorders.sort((a, b) => a.production_order_date < b.production_order_date ? -1 : a.production_order_date > b.production_order_date ? 1 : 0);
        var pos = productionorders;
        this.isLoading = false;
	  pos.forEach((po) => {
	      po.production_order_date_string = this.httpUtils
		  .getLocaleDateTimeString(po.production_order_date);
	      this.productionorders.push(po);
	  });
	  this.filteredProductionOrders = this.productionorders;
      },
      (error) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

    search(term: string): void {
	this.filteredProductionOrders = this.productionorders.filter(function(productionorder) {
	    return (productionorder.production_order_date.toLowerCase().indexOf(term.toLowerCase()) >= 0) || (productionorder.customer.name.toLowerCase().indexOf(term.toLowerCase()) >= 0) || (productionorder.production_order_code.toLowerCase().indexOf(term.toLowerCase()) >= 0) || (productionorder.production_number_lot.toLowerCase().indexOf(term.toLowerCase()) >= 0);
	});
    }

  edit(id: number): void {
    this.router.navigate(['productionorder/' + id]);
  }
}
