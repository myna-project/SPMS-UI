import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductionOrder } from '../_models/productionorder';
import { ProductionOrdersService } from '../_services/productionorders.service';
import { SettingPhase } from '../_models/settingPhase'
import { SettingPhaseService } from '../_services/settingPhase.service';
import { SystemPreparationPhase } from '../_models/systemPreparationPhase'
import { SystemPreparationPhaseService } from '../_services/systemPreparationPhase.service';
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
    // TODO other phases

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
                                this.settingPhaseService
                                    .getSettingPhases(this.productionorder.id)
                                    .subscribe(
                                        (response) => {
                                            var sfl = response;
                                            sfl.forEach((sf) => {
                                                sf.start_time_string = sf
						    .start_time.toString();
                                                if(sf.end_time == null) {
						    sf.end_time_string = this.translate.instant('SETTINGPHASE.ONGOING');
						} else {
						    sf.end_time_string = sf
							.end_time.toString();
						}
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
                                this.systemPreparationPhaseService
                                    .getSystemPreparationPhases(this.productionorder.id)
                                    .subscribe(
                                        (response) => {
                                            this.systemPreparationPhaseList = response;
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
}
