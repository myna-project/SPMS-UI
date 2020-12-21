import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductionOrder } from '../_models/productionorder';
import { ProductionOrdersService } from '../_services/productionorders.service';
import { HttpUtils } from '../_utils/http.utils';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

import { MessageDialogModel, MessageDialogComponent } from '../_utils/message-dialog/message-dialog.component';

@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    constructor(private productionordersService: ProductionOrdersService,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private httpUtils: HttpUtils,
		private translate: TranslateService) {}

    isLoading: boolean = true;
    productionorders: ProductionOrder[] = [];
    filteredProductionOrders: ProductionOrder[];

    ngOnInit(): void {
	this.productionordersService.getProductionOrders().subscribe(
	    (productionorders) => {
		productionorders.sort((a, b) => a.production_order_date < b.production_order_date ? -1 : a.production_order_date > b.production_order_date ? 1 : 0);
		var pos = productionorders;
		pos.forEach((po) => {
            po.production_order_date_string = this.httpUtils
                .getLocaleDateString(po.production_order_date);
            po.delivery_date_string = this.httpUtils
                .getLocaleDateString(po.delivery_date);
		    this.productionorders.push(po);
		});
		this.filteredProductionOrders = this.productionorders;
		this.isLoading = false;
	    },
	    (error) => {
		this.httpUtils.errorDialog(error);
	    }
	);
    }

    start(id: number): void {
	// start a new Phase view (setting phase)
	var phaseRoute = 'productionOrder/' + id + '/phases';
	this.router.navigate([phaseRoute]);
    }
}
