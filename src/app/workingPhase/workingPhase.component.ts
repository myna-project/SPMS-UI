import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { ProductionOrder } from '../_models/productionorder';
import { WorkingPhase } from '../_models/workingPhase';
import { WorkingPhaseMeasure } from '../_models/workingPhaseMeasure';
import { WorkingPhaseUser } from '../_models/workingPhaseUser';

import { ProductionOrdersService } from '../_services/productionorders.service';
import { WorkingPhaseService } from '../_services/workingPhase.service';
import { WorkingPhaseMeasureService } from '../_services/workingPhaseMeasure.service';
import { WorkingPhaseUserService } from '../_services/workingPhaseUser.service';

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
    productionOrder: ProductionOrder;
    workingPhase: WorkingPhase = new WorkingPhase();
    workingPhaseMeasures: WorkingPhaseMeasure[] = [];
    workingPhaseUser: WorkingPhaseUser = new WorkingPhaseUser();
    finished_product_quantity: string = '0';
    backRoute = 'dashboard';
    start_time: Date;

    constructor(private productionOrdersService: ProductionOrdersService,
                private workingPhaseService: WorkingPhaseService,
                private workingPhaseMeasureService: WorkingPhaseMeasureService,
                private workingPhaseUserService: WorkingPhaseUserService,
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
                            if (response.length > 0) {
                                this.workingPhase = response[0];
                            } else {
                                var nwp = this.newWorkingPhase();
                                this.workingPhaseService
                                    .createWorkingPhase(nwp)
                                    .subscribe(
                                        (response) => {
                                            this.workingPhase = response;
                                        },
                                        (error) => {
                                            const dialogRef = this.httpUtils.errorDialog(error);
                                            dialogRef.afterClosed().subscribe(value => {
                                                this.router.navigate([this.backRoute]);
                                            });
                                        });
                            }
                            var nwpu = this.newWorkingPhaseUser();
                            nwpu.workingPhase = this.workingPhase;
                            nwpu.start_time = Math.floor(this.start_time.getTime()/1000);
                            this.workingPhaseUserService
                                .createWorkingPhaseUser(nwpu)
                                .subscribe(
                                    (response) => {
                                        this.workingPhaseUser = response;
                                    },
                                    (error) => {
                                        const dialogRef = this.httpUtils.errorDialog(error);
                                        dialogRef.afterClosed().subscribe(value => {
                                            this.router.navigate([this.backRoute]);
                                        });
                                    });
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
        (this.finished_product_quantity === '0') ?
            this.finished_product_quantity = v :
            this.finished_product_quantity += v;
    }

    getDecimal() {
        if (!this.finished_product_quantity.includes('.'))
            this.finished_product_quantity += '.';
    }

    clear() {
        this.finished_product_quantity = '0';
    }

    addMeasure() {
        var wpm = new WorkingPhaseMeasure();
        wpm.time = Math.floor(new Date().getTime()/1000);
        wpm.finished_product_quantity = this.httpUtils.convertToNumber(this.finished_product_quantity);
        wpm.workingPhase = this.workingPhase;
        this.saveMeasure(wpm);
        this.workingPhaseMeasures.push(wpm);
        this.clear();
    }

    removeMeasure(i: number) {
        this.workingPhaseMeasures.splice(i, 1);
    }

    newWorkingPhase() {
        var nwp = new WorkingPhase();
        nwp.productionOrder = this.productionOrder;
        return nwp;
    }

    newWorkingPhaseUser() {
        var nwp = new WorkingPhaseUser();
        return nwp;
    }

    save(): void {
        this.isSaving = true;
        var nwp = this.newWorkingPhase();
        nwp.productionOrder = this.productionOrder;
        if (this.workingPhase.id !== undefined) {
            nwp.id = this.workingPhase.id;
            this.workingPhaseService
                .updateWorkingPhase(nwp)
                .subscribe(
                    (response) => {
                        this.workingPhase = response;
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
                    }
                );
        } else {
            this.workingPhaseService
                .createWorkingPhase(nwp)
                .subscribe(
                    (response) => {
                        this.workingPhase = response;
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
                    }
                );
        }
    }

    saveMeasure(measure): void {
            measure.workingPhase.productionOrder = this.productionOrder;
            this.workingPhaseMeasureService
                .createWorkingPhaseMeasure(measure)
                .subscribe(
                    (response) => {
                        this.httpUtils
                            .successSnackbar(
                                this.translate.instant('WORKINGPHASE.MEASURE_SAVED'));
		            },
		            (error) => {
		                this.isSaving = false;
		                this.httpUtils.errorDialog(error);
		            });
    }

    saveShift(): void {
        this.workingPhase.productionOrder = this.productionOrder;
        this.workingPhaseUser.start_time = Math.floor(this.start_time.getTime()/1000);
        this.workingPhaseUser.end_time = Math.floor(new Date().getTime()/1000);
        this.workingPhaseUser.workingPhase = this.workingPhase;
        this.workingPhaseUserService
            .updateWorkingPhaseUser(this.workingPhaseUser)
            .subscribe(
                (response) => {
                        this.httpUtils
                            .successSnackbar(
                                this.translate.instant('WORKINGPHASE.ENDSHIFT'));
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
    }
}
