import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { CleaningPhase } from '../_models/cleaningPhase';
import { User } from '../_models/user';
import { ProductionOrder } from '../_models/productionorder';

import { CleaningPhaseService } from '../_services/cleaningPhase.service';
import { UsersService } from '../_services/users.service';
import { ProductionOrdersService } from '../_services/productionorders.service';
import { AuthenticationService } from '../_services/authentication.service'

import { HttpUtils } from '../_utils/http.utils';

/**
* TODO NOTEs:
* - JSON payloads: there's no need to serialize the whole ProductionOrder / User, yet we are forced to mantain backend consistency
*/
@Component({
  templateUrl: './cleaningPhase.component.html',
})
export class CleaningPhaseComponent implements ComponentCanDeactivate,OnInit {

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
	return true;
    }

    saved: boolean = false;
    isSaving: boolean = false;
    isLoading: boolean = true;
    cleaningPhase: CleaningPhase = new CleaningPhase();
    backRoute = 'dashboard';
    productionOrder: ProductionOrder;
    start_time: Date;

    constructor(private cleaningPhaseService: CleaningPhaseService,
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
				    this.cleaningPhaseService
					.getCleaningPhase(id, sid)
					.subscribe(
					(response) => {
						this.isLoading = false;
						this.cleaningPhase = response;
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
	var newCleaningPhase = new CleaningPhase();
	newCleaningPhase.start_time = Math.floor(this.start_time.getTime()/1000);
	newCleaningPhase.end_time = Math.floor(new Date().getTime()/1000);
	newCleaningPhase.productionOrder = this.productionOrder;
	if (this.cleaningPhase.id !== undefined) {
	    newCleaningPhase.id = this.cleaningPhase.id;
	    this.cleaningPhaseService
		.updateCleaningPhase(newCleaningPhase)
		.subscribe(
		(response) => {
		    this.cleaningPhase = response;
		    this.isSaving = false;
		    this.saved = true;
		    this.httpUtils
			.successSnackbar(
			    this.translate.instant('CLEANINGPHASE.SAVED'));
            this.router
                .navigate(
                    ['productionOrder/'
                        + this.cleaningPhase.productionOrder.id
                        + '/phases']);
		},
		(error) => {
		    this.isSaving = false;
		    this.httpUtils.errorDialog(error);
		}
	    );
	} else {
	    this.cleaningPhaseService
		.createCleaningPhase(newCleaningPhase)
		.subscribe(
		(response) => {
		    this.cleaningPhase = response;
		    this.isSaving = false;
		    this.saved = true;
		    this.httpUtils
			.successSnackbar(
			    this.translate.instant('CLEANINGPHASE.SAVED'));
            this.router
                .navigate(
                    ['productionOrder/'
                        + this.cleaningPhase.productionOrder.id
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
