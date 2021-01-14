import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { ProductionOrder } from '../_models/productionorder';
import { WorkingPhase } from '../_models/workingPhase';

import { ProductionOrdersService } from '../_services/productionorders.service';
import { WorkingPhaseService } from '../_services/workingPhase.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
  templateUrl: './workingPhase.component.html',
  styleUrls: ['./workingPhase.component.scss']
})
export class WorkingPhaseComponent implements ComponentCanDeactivate,OnInit {

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        return true;
    }

    isLoading: boolean = true;
    isSaving: boolean = false;
    saved: boolean = false;
    productionOrder: ProductionOrder = new ProductionOrder();
    workingPhase: WorkingPhase = new WorkingPhase();
    workingPhaseMeasures = [];
    finished_product_quantity: string = '0';
    backRoute = 'dashboard';
    start_time: Date;

    constructor(private productionOrdersService: ProductionOrdersService,
                private workingPhaseService: WorkingPhaseService,
                private route: ActivatedRoute,
                private router: Router,
                private location: Location,
                private httpUtils: HttpUtils,
                private translate: TranslateService) {}

    ngOnInit(): void {
	this.start_time = new Date();
        this.route.paramMap.subscribe(params => {
            this.productionOrdersService.getProductionOrder(params.get('id')).subscribe(
                (po_response) => {
                    this.productionOrder = po_response;

                    this.workingPhaseService.getWorkingPhases(this.productionOrder.id).subscribe(
                        (response) => {
                            this.isLoading = false;
                            if (response.length > 0)
                                this.workingPhase = response[0];
                        },
                        (error) => {
                            const dialogRef = this.httpUtils.errorDialog(error);
                            dialogRef.afterClosed().subscribe(value => {
                                this.router.navigate([this.backRoute]);
                            });
                        }
                    );
                },
                (error) => {
                    const dialogRef = this.httpUtils.errorDialog(error);
                    dialogRef.afterClosed().subscribe(value => {
                        this.router.navigate([this.backRoute]);
                    });
                }
            );
        });
    }

    getNumber(v: string) {
        (this.finished_product_quantity === '0') ? this.finished_product_quantity = v : this.finished_product_quantity += v;
    }

    getDecimal() {
        if (!this.finished_product_quantity.includes('.'))
            this.finished_product_quantity += '.';
    }

    clear() {
        this.finished_product_quantity = '0';
    }

    addMeasure() {
        this.workingPhaseMeasures.push({ time: Math.floor(new Date().getTime()/1000), finished_product_quantity: this.finished_product_quantity });
        this.clear();
    }

    removeMeasure(i: number) {
        this.workingPhaseMeasures.splice(i, 1);
    }

    save(): void {
	this.isSaving = true;
	var newWorkingPhase = new WorkingPhase();
	newWorkingPhase.start_time = Math.floor(this.start_time.getTime()/1000);
	newWorkingPhase.end_time = Math.floor(new Date().getTime()/1000);
	newWorkingPhase.productionOrder = this.productionOrder;
	if (this.workingPhase.id !== undefined) {
	    newWorkingPhase.id = this.workingPhase.id;
	    this.workingPhaseService
		.updateWorkingPhase(newWorkingPhase)
		.subscribe(
		(response) => {
		    this.workingPhase = response;
		    this.saveMeasures();
		},
		(error) => {
		    this.isSaving = false;
		    this.httpUtils.errorDialog(error);
		}
	    );
	} else {
	    this.workingPhaseService
		.createWorkingPhase(newWorkingPhase)
		.subscribe(
		(response) => {
		    this.workingPhase = response;
		    this.saveMeasures();
		},
		(error) => {
		    this.isSaving = false;
		    this.httpUtils.errorDialog(error);
		}
	    );
	}
    }

    saveMeasures(): void {
	// TODO handle workingPhaseUser?
	this.workingPhaseMeasures.forEach(measure => {
	    this.workingPhaseService
		.createWorkingPhaseMeasure(this.workingPhase, measure)
		.subscribe(
		(response) => {
		    this.workingPhase = response;
		    this.isSaving = false;
		    this.saved = true;
		    this.httpUtils
			.successSnackbar(
			    this.translate.instant('WORKINGPHASE.SAVED'));
		    this.router
			.navigate(
			    ['productionOrder/'
				+ this.workingPhase.productionOrder.id
				+ '/phases']);
		},
		(error) => {
		    this.isSaving = false;
		    this.httpUtils.errorDialog(error);
		});
	});
    }
}
