import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { CleaningPhase } from '../_models/cleaningPhase';
import { ProductionOrder } from '../_models/productionorder';
import { User } from '../_models/user';

import { CleaningPhaseService } from '../_services/cleaningPhase.service';
import { UsersService } from '../_services/users.service';
import { ProductionOrdersService } from '../_services/productionorders.service';
import { AuthenticationService } from '../_services/authentication.service'

import { HttpUtils } from '../_utils/http.utils';

@Component({
  templateUrl: './cleaningPhase.component.html',
})
export class CleaningPhaseComponent implements ComponentCanDeactivate,OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return true;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  cleaningPhase: CleaningPhase = new CleaningPhase();
  productionOrder: ProductionOrder = new ProductionOrder();
  backRoute = 'dashboard';

  constructor(private cleaningPhaseService: CleaningPhaseService, private productionOrderService: ProductionOrdersService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

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
              if (this.productionOrder.cleaning_phases) {
                let sf = this.productionOrder.cleaning_phases.filter(phase => (phase.id === +sid))[0];
                if (sf) {
                  this.cleaningPhase = sf;
                  this.isLoading = false;
                } else {
                  this.router.navigate([this.backRoute]);
                }
              } else {
                this.router.navigate([this.backRoute]);
              }
            } else {
              this.cleaningPhase.productionOrder = this.productionOrder;
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
    if (this.cleaningPhase.id) {
      this.cleaningPhase.end_time = Math.floor(new Date().getTime()/1000);
      this.cleaningPhaseService.updateCleaningPhase(this.productionOrder.id, this.cleaningPhase).subscribe(
        (response) => {
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('CLEANINGPHASE.SAVED'));
          this.router.navigate(['productionOrder/' + this.productionOrder.id + '/phases']);
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.cleaningPhase.start_time = Math.floor(new Date().getTime()/1000);
      this.cleaningPhaseService.createCleaningPhase(this.productionOrder.id, this.cleaningPhase).subscribe(
   	    (response) => {
          this.isSaving = false;
   	      this.cleaningPhase = response;
   	      this.router.navigate(['productionOrder/' + this.productionOrder.id + '/cleaningPhase/' + this.cleaningPhase.id]);
   	    },
   	    (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
   	    }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('CLEANINGPHASE.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isDeleting = true;
        this.cleaningPhaseService.deleteCleaningPhase(this.productionOrder.id, this.cleaningPhase).subscribe(
          (response) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('CLEANINGPHASE.DELETED'));
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
