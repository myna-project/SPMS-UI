import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { ProductionOrder } from '../_models/productionorder';
import { User } from '../_models/user';

import { AuthenticationService } from '../_services/authentication.service';
import { ProductionOrdersService } from '../_services/productionorders.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss']
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
  backRoute: string = 'dashboard';

  constructor(private productionOrdersService: ProductionOrdersService, private authService: AuthenticationService, private route: ActivatedRoute, private router: Router, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.route.paramMap.subscribe((params: any) => {
      var id = params.get('id');
      if (id) {
        this.productionOrdersService.getProductionOrder(id).subscribe(
          (po_response: ProductionOrder) => {
            this.productionOrder = po_response;
            if (this.productionOrder.delivery_date)
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
            if (this.productionOrder.validation_phases) {
              this.productionOrder.validation_phases.forEach(sf => {
                sf.start_time_string = this.httpUtils.getLocaleDateTimeString(new Date(sf.start_time * 1000));
                sf.end_time_string = (sf.end_time == null) ? this.translate.instant('PHASES.ONGOING') : this.httpUtils.getLocaleDateTimeString(new Date(sf.end_time * 1000));
              });
            }
            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            const dialogRef = this.httpUtils.errorDialog(error);
            dialogRef.afterClosed().subscribe((_value: any) => {
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
      (_response: ProductionOrder) => {
        this.httpUtils.successSnackbar(this.translate.instant('PHASES.CLOSED'));
        this.router.navigate([this.backRoute]);
      },
      (error: HttpErrorResponse) => {
        const dialogRef = this.httpUtils.errorDialog(error);
        dialogRef.afterClosed().subscribe((_value: any) => {
          this.router.navigate([this.backRoute]);
        });
      }
    );
  }

  toPhase(type: string, sid: number | string): void {
    this.router.navigate(['productionOrder/' + this.productionOrder.id + '/' + type + 's/' + sid]);
  }

  newPhase(type: string): void {
    this.router.navigate(['productionOrder/' + this.productionOrder.id + '/' + type]);
  }
}
