import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { ProductionOrder } from '../_models/productionorder';
import { WorkingPhase } from '../_models/workingPhase';
import { WorkingPhaseMeasure } from '../_models/workingPhaseMeasure';

import { ProductionOrdersService } from '../_services/productionorders.service';
import { WorkingPhaseService } from '../_services/workingPhase.service';
import { WorkingPhaseMeasureService } from '../_services/workingPhaseMeasure.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
  templateUrl: './workingPhase.component.html',
  styleUrls: ['./workingPhase.component.scss']
})
export class WorkingPhaseComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return true;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  productionOrder: ProductionOrder;
  workingPhase: WorkingPhase = new WorkingPhase();
  workingPhaseMeasures: WorkingPhaseMeasure[] = [];
  finished_product_quantity: string = '0';
  backRoute: string = 'dashboard';

  constructor(private productionOrderService: ProductionOrdersService, private workingPhaseService: WorkingPhaseService, private workingPhaseMeasureService: WorkingPhaseMeasureService, private route: ActivatedRoute, private router: Router, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      var id = params.get('id');
      if (id) {
        this.productionOrderService.getProductionOrder(id).subscribe(
          (po_response: ProductionOrder) => {
            this.productionOrder = po_response;
            var sid = params.get('sid');
            if (sid) {
              if (this.productionOrder.working_phases) {
                let sf = this.productionOrder.working_phases.filter(phase => (phase.id === +sid))[0];
                if (sf) {
                  sf.productionOrder = new ProductionOrder();
                  sf.productionOrder.id = +id;
                  this.workingPhase = sf;
                  this.workingPhaseMeasures = sf.measures;
                  if (this.workingPhaseMeasures) {
                    this.workingPhaseMeasures.forEach(m => {
                      m.time_string = this.httpUtils.getLocaleDateTimeString(new Date(m.time * 1000));
                    });
                  }
                  this.isLoading = false;
                } else {
                  this.router.navigate([this.backRoute]);
                }
              } else {
                this.router.navigate([this.backRoute]);
              }
            } else {
              this.workingPhase.productionOrder = this.productionOrder;
              this.save();
              this.isLoading = false;
            }
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
    let wpm = new WorkingPhaseMeasure();
    wpm.workingPhase = this.workingPhase;
    wpm.time = Math.floor(new Date().getTime()/1000);
    wpm.finished_product_quantity = this.httpUtils.convertToNumber(this.finished_product_quantity);
    this.workingPhaseMeasureService.createWorkingPhaseMeasure(this.productionOrder.id, this.workingPhase.id, wpm).subscribe(
      (response: WorkingPhaseMeasure) => {
        this.httpUtils.successSnackbar(this.translate.instant('WORKINGPHASE.MEASURESAVED'));
        response.time_string = this.httpUtils.getLocaleDateTimeString(new Date(response.time * 1000));
        if (this.workingPhaseMeasures)
          this.workingPhaseMeasures.push(response);
        else
          this.workingPhaseMeasures = [response];
        this.clear();
      },
      (error: HttpErrorResponse) => {
        this.isSaving = false;
        this.httpUtils.errorDialog(error);
      }
    );
  }

  removeMeasure(i: number) {
    this.workingPhaseMeasureService.deleteWorkingPhaseMeasure(this.productionOrder.id, this.workingPhase.id, this.workingPhaseMeasures[i].id).subscribe(
      (_response: WorkingPhaseMeasure) => {
        this.httpUtils.successSnackbar(this.translate.instant('WORKINGPHASE.MEASUREDELETED'));
        this.workingPhaseMeasures.splice(i, 1);
      },
      (error: HttpErrorResponse) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

  save(): void {
    this.isSaving = true;
    if (this.workingPhase.id) {
      this.workingPhase.end_time = Math.floor(new Date().getTime()/1000);
      this.workingPhaseService.updateWorkingPhase(this.productionOrder.id, this.workingPhase).subscribe(
        (_response: WorkingPhase) => {
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('WORKINGPHASE.SAVED'));
          this.router.navigate(['productionOrder/' + this.productionOrder.id + '/phases']);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.workingPhase.start_time = Math.floor(new Date().getTime()/1000);
      this.workingPhaseService.createWorkingPhase(this.productionOrder.id, this.workingPhase).subscribe(
        (response: WorkingPhase) => {
          this.isSaving = false;
          this.workingPhase = response;
          this.router.navigate(['productionOrder/' + this.productionOrder.id + '/workingPhases/' + this.workingPhase.id]);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('WORKINGPHASE.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
        this.isDeleting = true;
        this.workingPhaseService.deleteWorkingPhase(this.productionOrder.id, this.workingPhase).subscribe(
          (_response: WorkingPhase) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('WORKINGPHASE.DELETED'));
            this.router.navigate(['productionOrder/' + this.productionOrder.id + '/phases']);
          },
          (error: HttpErrorResponse) => {
            this.isDeleting = false;
            this.httpUtils.errorDialog(error);
          }
        );
      }
    });
  }
}
