import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { CleaningPhase } from '../_models/cleaningPhase'
import { ProductionOrder } from '../_models/productionorder';
import { SettingPhase } from '../_models/settingPhase'
import { SystemPreparationPhase } from '../_models/systemPreparationPhase'
import { User } from '../_models/user';
import { ValidationPhase } from '../_models/validationPhase'
import { WorkingPhase } from '../_models/workingPhase'

import { AuthenticationService } from '../_services/authentication.service';
import { ProductionOrdersService } from '../_services/productionorders.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
  templateUrl: './phases.component.html'
})
export class PhasesComponent implements ComponentCanDeactivate,OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return true;
  }

  isLoading: boolean = true;
  currentUser: User;
  productionOrder: ProductionOrder;
  canAddPhase: boolean = true;
  backRoute = 'dashboard';

  constructor(private productionOrdersService: ProductionOrdersService, private authService: AuthenticationService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      if (id) {
        this.productionOrdersService.getProductionOrder(id).subscribe(
          (po_response) => {
            this.productionOrder = po_response;
            this.productionOrder.delivery_date_string = this.httpUtils.getLocaleDateString(this.productionOrder.delivery_date);
            if (this.productionOrder.setting_phases) {
              this.productionOrder.setting_phases.forEach(sf => {
                sf.start_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.start_time * 1000));
                if (sf.end_time != null) {
                  sf.end_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.end_time * 1000));
                } else {
                  sf.end_time_string = this.translate.instant('PHASES.ONGOING');
                  sf.current = true;
                  this.canAddPhase = false;
                }
              });
            }
            if (this.productionOrder.system_preparation_phases) {
              this.productionOrder.system_preparation_phases.forEach(sf => {
                sf.start_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.start_time * 1000));
                if (sf.end_time != null) {
                  sf.end_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.end_time * 1000));
                } else {
                  sf.end_time_string = this.translate.instant('PHASES.ONGOING');
                  sf.current = true;
                  this.canAddPhase = false;
                }
              });
            }
            if (this.productionOrder.cleaning_phases) {
              this.productionOrder.cleaning_phases.forEach(sf => {
                sf.start_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.start_time * 1000));
                if (sf.end_time != null) {
                  sf.end_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.end_time * 1000));
                } else {
                  sf.end_time_string = this.translate.instant('PHASES.ONGOING');
                  sf.current = true;
                  this.canAddPhase = false;
                }
              });
            }
            if (this.productionOrder.working_phases) {
              this.productionOrder.working_phases.forEach(sf => {
            	if (sf.shifts) {
                  sf.shifts.sort((a, b) => a.start_time < b.start_time ? -1 : a.start_time > b.start_time ? 1 : 0);
                  sf.start_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.shifts[0].start_time * 1000));
                  if (sf.shifts[sf.shifts.length - 1].end_time != null) {
                    sf.end_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.shifts[sf.shifts.length - 1].end_time * 1000));
                  } else {
                    sf.end_time_string = this.translate.instant('PHASES.ONGOING');
                    sf.current = true;
                    this.canAddPhase = false;
                  }
            	}
              });
            }
            if (this.productionOrder.validation_phases) {
              this.productionOrder.validation_phases.forEach(sf => {
                sf.start_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.start_time * 1000));
                sf.end_time_string = (sf.end_time != null) ? this.translate.instant('PHASES.ONGOING') : this.httpUtils.getLocaleDateTimeString(new Date(sf.end_time * 1000));
              });
            }
            this.isLoading = false;
          },
          (error) => {
            const dialogRef = this.httpUtils.errorDialog(error);
            dialogRef.afterClosed().subscribe(value => {
              this.router.navigate([this.backRoute]);
            });
          }
        );
      }
    });
  }

  close(): void {
    this.productionOrder.completed = true;
    this.productionOrdersService.updateProductionOrder(this.productionOrder).subscribe(
      (response) => {
        this.httpUtils.successSnackbar(this.translate.instant('PHASES.CLOSED'));
        this.router.navigate([this.backRoute]);
      },
      (error) => {
        const dialogRef = this.httpUtils.errorDialog(error);
        dialogRef.afterClosed().subscribe(value => {
          this.router.navigate([this.backRoute]);
        });
      }
    );
  }

  toPhase(type: string, sid: number | string): void {
	console.log('productionOrder/' + this.productionOrder.id + '/' + type + 's/' + sid);
    this.router.navigate(['productionOrder/' + this.productionOrder.id + '/' + type + 's/' + sid]);
  }

  newPhase(type: string): void {
    this.router.navigate(['productionOrder/' + this.productionOrder.id + '/' + type]);
  }
}
