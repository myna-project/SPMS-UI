import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { SystemPreparationPhase } from '../_models/systemPreparationPhase';
import { User } from '../_models/user';
import { ProductionOrder } from '../_models/productionorder';
import { SystemPreparationPhaseService } from '../_services/systemPreparationPhase.service';
import { UsersService } from '../_services/users.service';
import { ProductionOrdersService } from '../_services/productionorders.service';

import { HttpUtils } from '../_utils/http.utils';

import { AuthenticationService } from '../_services/authentication.service'

/**
* TODO NOTEs:
* - JSON payloads: there's no need to serialize the whole ProductionOrder / User, yet we are forced to mantain backend consistency
*/
@Component({
  templateUrl: './systemPreparationPhase.component.html',
})
export class SystemPreparationPhaseComponent implements ComponentCanDeactivate,OnInit {

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
	return true;
    }

    saved: boolean = false;
    isSaving: boolean = false;
    isLoading: boolean = true;
    systemPreparationPhase: SystemPreparationPhase = new SystemPreparationPhase();
    backRoute = 'dashboard';
    productionOrder: ProductionOrder;
    start_time: Date;

    constructor(private systemPreparationPhaseService: SystemPreparationPhaseService,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private httpUtils: HttpUtils,
		private productionOrderService: ProductionOrdersService,
		private authService: AuthenticationService,
		private userService: UsersService,
		private translate: TranslateService) {}

    ngOnInit(): void {
	this.start_time = new Date();
	this.route.paramMap
	    .subscribe(params => {
		var id = params.get('id');
		if(id) {
		    this.productionOrderService
			.getProductionOrder(id)
			.subscribe(
			    (po_response) => {
				this.productionOrder = po_response;
				var sid = params.get('sid');
				if(sid) {
				    this.systemPreparationPhaseService
					.getSystemPreparationPhase(id, sid)
					.subscribe(
					(response) => {
						this.isLoading = false;
						this.systemPreparationPhase = response;
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
			    },
			    (error) => {
				const dialogRef = this.httpUtils.errorDialog(error);
				dialogRef.afterClosed().subscribe(value => {
				    this.router.navigate([this.backRoute]);
				});
			    });
		}
	    });
    }

    save(): void {
	this.isSaving = true;
	var newSystemPreparationPhase = new SystemPreparationPhase();
	newSystemPreparationPhase.start_time = Math.floor(this.start_time.getTime()/1000);
	newSystemPreparationPhase.end_time = Math.floor(new Date().getTime()/1000);
	newSystemPreparationPhase.productionOrder = this.productionOrder;
	if (this.systemPreparationPhase.id !== undefined) {
	    newSystemPreparationPhase.id = this.systemPreparationPhase.id;
	    this.systemPreparationPhaseService
		.updateSystemPreparationPhase(newSystemPreparationPhase)
		.subscribe(
		(response) => {
		    this.systemPreparationPhase = response;
		    this.isSaving = false;
		    this.saved = true;
		    this.httpUtils
			.successSnackbar(
			    this.translate.instant('SYSTEMPREPARATIONPHASE.SAVED'));
            this.router
                .navigate(
                    ['productionOrder/'
                        + this.systemPreparationPhase.productionOrder.id
                        + '/phases']);
		},
		(error) => {
		    this.isSaving = false;
		    this.httpUtils.errorDialog(error);
		}
	    );
	} else {
	    this.systemPreparationPhaseService
		.createSystemPreparationPhase(newSystemPreparationPhase)
		.subscribe(
		(response) => {
		    this.systemPreparationPhase = response;
		    this.isSaving = false;
		    this.saved = true;
		    this.httpUtils
			.successSnackbar(
			    this.translate.instant('SYSTEMPREPARATIONPHASE.SAVED'));
            this.router
                .navigate(
                    ['productionOrder/'
                        + this.systemPreparationPhase.productionOrder.id
                        + '/phases']);
		},
		(error) => {
		    this.isSaving = false;
		    this.httpUtils.errorDialog(error);
		}
	    );
	}
    }
}
