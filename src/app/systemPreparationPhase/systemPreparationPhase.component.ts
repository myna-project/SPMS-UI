import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { ProductionOrder } from '../_models/productionorder';
import { SystemPreparationPhase } from '../_models/systemPreparationPhase';

import { ProductionOrdersService } from '../_services/productionorders.service';
import { SystemPreparationPhaseService } from '../_services/systemPreparationPhase.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
  templateUrl: './systemPreparationPhase.component.html',
})
export class SystemPreparationPhaseComponent implements ComponentCanDeactivate,OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return true;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  systemPreparationPhase: SystemPreparationPhase = new SystemPreparationPhase();
  productionOrder: ProductionOrder = new ProductionOrder();
  backRoute = 'dashboard';

  constructor(private systemPreparationPhaseService: SystemPreparationPhaseService, private productionOrderService: ProductionOrdersService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      if (id) {
        this.productionOrderService.getProductionOrder(id).subscribe(
          (po_response) => {
            this.productionOrder = po_response;
            this.productionOrder.delivery_date_string = this.httpUtils.getLocaleDateString(this.productionOrder.delivery_date);
            var sid = params.get('sid');
            if (sid) {
              if (this.productionOrder.system_preparation_phases) {
                let sf = this.productionOrder.system_preparation_phases.filter(phase => (phase.id === +sid))[0];
                if (sf) {
                  sf.productionOrder = new ProductionOrder();
                  sf.productionOrder.id = +id;
                  this.systemPreparationPhase = sf;
                  this.isLoading = false;
                } else {
                  this.router.navigate([this.backRoute]);
                }
              } else {
                this.router.navigate([this.backRoute]);
              }
            } else {
              this.systemPreparationPhase.productionOrder = this.productionOrder;
              this.save();
              this.isLoading = false;
            }
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

  save(): void {
    this.isSaving = true;
    if (this.systemPreparationPhase.id) {
      this.systemPreparationPhase.end_time = Math.floor(new Date().getTime()/1000);
      this.systemPreparationPhaseService.updateSystemPreparationPhase(this.productionOrder.id, this.systemPreparationPhase).subscribe(
        (response) => {
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('SYSTEMPREPARATIONPHASE.SAVED'));
          this.router.navigate(['productionOrder/' + this.productionOrder.id + '/phases']);
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.systemPreparationPhase.start_time = Math.floor(new Date().getTime()/1000);
      this.systemPreparationPhaseService.createSystemPreparationPhase(this.productionOrder.id, this.systemPreparationPhase).subscribe(
        (response) => {
          this.isSaving = false;
          this.systemPreparationPhase = response;
          this.router.navigate(['productionOrder/' + this.productionOrder.id + '/systemPreparationPhases/' + this.systemPreparationPhase.id]);
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('SYSTEMPREPARATIONPHASE.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isDeleting = true;
        this.systemPreparationPhaseService.deleteSystemPreparationPhase(this.productionOrder.id, this.systemPreparationPhase).subscribe(
          (response) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('SYSTEMPREPARATIONPHASE.DELETED'));
            this.router.navigate(['productionOrder/' + this.productionOrder.id + '/phases']);
          },
          (error) => {
            this.isDeleting = false;
            this.httpUtils.errorDialog(error);
          }
        );
      }
    });
  }
}
