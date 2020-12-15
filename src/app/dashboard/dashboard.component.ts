import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductionOrder } from '../_models/productionorder';
import { ProductionOrdersService } from '../_services/productionorders.service';
import { HttpUtils } from '../_utils/http.utils';

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
    productionorders: ProductionOrder[];
    filteredProductionOrders: ProductionOrder[];

    ngOnInit(): void {
	this.productionordersService.getProductionOrders().subscribe(
	    (productionorders) => {
		productionorders.sort((a, b) => a.production_order_date < b.production_order_date ? -1 : a.production_order_date > b.production_order_date ? 1 : 0);
		this.productionorders = productionorders;
		this.filteredProductionOrders = productionorders;
		this.isLoading = false;
	    },
	    (error) => {
		this.httpUtils.errorDialog(error);
	    }
	);
    }

    start(id: number): void {
	// start a new Phase view (setting phase)
	var phaseRoute = 'settingPhases/' + id;
	this.router.navigate([phaseRoute]);
    }
}
