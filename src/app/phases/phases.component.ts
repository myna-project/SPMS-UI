import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ProductionOrder } from '../_models/productionorder';
import { ProductionOrdersService } from '../_services/productionorders.service';

import { SettingPhase } from '../_models/settingPhase'
import { SystemPreparationPhase } from '../_models/systemPreparationPhase'
import { CleaningPhase } from '../_models/cleaningPhase'
import { ValidationPhase } from '../_models/validationPhase'
import { WorkingPhase } from '../_models/workingPhase'

import { SettingPhaseService } from '../_services/settingPhase.service';
import { CleaningPhaseService } from '../_services/cleaningPhase.service';
import { SystemPreparationPhaseService } from '../_services/systemPreparationPhase.service';
import { ValidationPhaseService } from '../_services/validationPhase.service';
import { WorkingPhaseService } from '../_services/workingPhase.service';

import { HttpUtils } from '../_utils/http.utils';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';
import { MessageDialogModel, MessageDialogComponent } from '../_utils/message-dialog/message-dialog.component';

@Component({
    templateUrl: './phases.component.html'
})
export class PhasesComponent implements ComponentCanDeactivate,OnInit {

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        return true;
    }

    constructor(
	private productionordersService: ProductionOrdersService,
	private settingPhaseService: SettingPhaseService,
	private systemPreparationPhaseService: SystemPreparationPhaseService,
	private cleaningPhaseService: CleaningPhaseService,
	private validationPhaseService: ValidationPhaseService,
	private workingPhaseService: WorkingPhaseService,
	private route: ActivatedRoute,
	private router: Router,
	private location: Location,
	private httpUtils: HttpUtils,
	private translate: TranslateService) {}

    backRoute = 'dashboard';
    isLoading: boolean = true;
    productionorder: ProductionOrder;
    settingPhaseList: SettingPhase[] = [];
    systemPreparationPhaseList: SystemPreparationPhase[] = [];
    cleaningPhaseList: CleaningPhase[] = [];
    validationPhaseList: ValidationPhase[] = [];
    workingPhaseList: WorkingPhase[] = [];

    ngOnInit(): void {
        this.route.paramMap
            .subscribe(params => {
                var id = params.get('id');
                if(id) { // TODO what if id === undefined?
                    this.productionordersService
                        .getProductionOrder(id)
                        .subscribe(
                            (po_response) => {
                                this.productionorder = po_response;
                                this.productionorder.delivery_date_string = this.httpUtils
                                    .getLocaleDateString(this.productionorder.delivery_date);
                                this.isLoading = false;
                                this.processSettingPhases();
                                this.processSystemPreparationPhases();
                                this.processCleaningPhases();
                                this.processValidationPhases();
                                this.processWorkingPhases();
                            },
                            (error) => {
                                const dialogRef = this.httpUtils
                                    .errorDialog(error);
                                dialogRef
                                    .afterClosed()
                                    .subscribe(value => {
                                        this.router
                                            .navigate([this.backRoute]);
                                    });
                            }
                        );
                }
            });
    }

    processStartEndTime(sf) {
        console.log(sf);
        console.log(sf.start_time);
        console.log(sf.end_time);
        sf.start_time_string = new Date(sf.start_time*1000).toString();
        if(sf.end_time == null) {
            sf.end_time_string = this.translate.instant('PHASES.ONGOING');
        } else {
            sf.end_time_string = new Date(sf.end_time*1000).toString();
        }
        return sf;
    }

    processSettingPhases(): void {
        this.settingPhaseService
            .getSettingPhases(this.productionorder.id)
            .subscribe(
                (response) => {
                    var sfl = response;
                    sfl.forEach((sf) => {
                        sf = this.processStartEndTime(sf);
                        this.settingPhaseList.push(sf);
                   });
                },
                (error) => {
                    const dialogRef = this.httpUtils
                        .errorDialog(error);
                    dialogRef
                        .afterClosed()
                        .subscribe(value => {
                            this.router
                                .navigate([this.backRoute]);
                        });
                });

    }

    processSystemPreparationPhases(): void {
        this.systemPreparationPhaseService
            .getSystemPreparationPhases(this.productionorder.id)
            .subscribe(
                (response) => {
                    var sfl = response;
                    sfl.forEach((sf) => {
                        sf = this.processStartEndTime(sf);
                        this.systemPreparationPhaseList.push(sf);
                    });
                },
                (error) => {
                    const dialogRef = this.httpUtils
                        .errorDialog(error);
                    dialogRef
                        .afterClosed()
                        .subscribe(value => {
                            this.router
                                .navigate([this.backRoute]);
                        });
                });

    }

    processCleaningPhases(): void {
        this.cleaningPhaseService
            .getCleaningPhases(this.productionorder.id)
            .subscribe(
                (response) => {
                    var sfl = response;
                    sfl.forEach((sf) => {
                        sf = this.processStartEndTime(sf);
                        this.cleaningPhaseList.push(sf);
                   });
                },
                (error) => {
                    const dialogRef = this.httpUtils
                        .errorDialog(error);
                    dialogRef
                        .afterClosed()
                        .subscribe(value => {
                            this.router
                                .navigate([this.backRoute]);
                        });
                });

    }

    processValidationPhases(): void {
        this.validationPhaseService
            .getValidationPhases(this.productionorder.id)
            .subscribe(
                (response) => {
                    var sfl = response;
                    sfl.forEach((sf) => {
                        sf = this.processStartEndTime(sf);
                        this.validationPhaseList.push(sf);
                   });
                },
                (error) => {
                    const dialogRef = this.httpUtils
                        .errorDialog(error);
                    dialogRef
                        .afterClosed()
                        .subscribe(value => {
                            this.router
                                .navigate([this.backRoute]);
                        });
                });

    }

    processWorkingPhases(): void {
        this.workingPhaseService
            .getWorkingPhases(this.productionorder.id)
            .subscribe(
                (response) => {
                    var sfl = response;
                    sfl.forEach((sf) => {
                        this.workingPhaseList.push(sf);
                   });
                },
                (error) => {
                    const dialogRef = this.httpUtils
                        .errorDialog(error);
                    dialogRef
                        .afterClosed()
                        .subscribe(value => {
                            this.router
                                .navigate([this.backRoute]);
                        });
                });

    }

    close(): void {
        this.productionorder.completed = true;
        this.productionordersService
            .updateProductionOrder(this.productionorder)
            .subscribe(
                (response) => {
                    this.httpUtils
                        .successSnackbar(
                            this.translate.instant('PHASES.CLOSED'));
                    this.router.navigate([this.backRoute]);
                },
                (error) => {
                    const dialogRef = this.httpUtils.errorDialog(error);
                    dialogRef
                        .afterClosed()
                        .subscribe(value => {
                            this.router
                                .navigate([this.backRoute]);
                        });
                }
            );
    }

    toSettingPhase(sid: number | string): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/settingPhases/'
                + sid]);
    }

    newSettingPhase(): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/settingPhase']);
    }

    toSystemPreparationPhase(sid: number | string): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/systemPreparationPhases/'
                + sid]);
    }

    newSystemPreparationPhase(): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/systemPreparationPhase']);
    }

    toCleaningPhase(sid: number | string): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/cleaningPhases/'
                + sid]);
    }

    newCleaningPhase(): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/cleaningPhase']);
    }

    toValidationPhase(sid: number | string): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/validationPhases/'
                + sid]);
    }

    newValidationPhase(): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/validationPhase']);
    }

    toWorkingPhase(sid: number | string): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/workingPhases/'
                + sid]);
    }

    newWorkingPhase(): void {
        this.router.navigate(
            ['productionOrder/'
                + this.productionorder.id
                + '/workingPhase']);
    }
}
