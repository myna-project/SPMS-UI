import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { MixtureMode } from '../_models/mixturemode';
import { ProductionOrder } from '../_models/productionorder';
import { SettingPhase } from '../_models/settingPhase';

import { MixtureModesService } from '../_services/mixturemodes.service';
import { ProductionOrdersService } from '../_services/productionorders.service';
import { SettingPhaseService } from '../_services/settingPhase.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
  templateUrl: './settingPhase.component.html',
})
export class SettingPhaseComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.settingPhaseForm.touched;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  settingPhase: SettingPhase = new SettingPhase();
  productionOrder: ProductionOrder = new ProductionOrder();
  settingPhaseForm: FormGroup;
  allMixtureModes: MixtureMode[];
  backRoute = 'dashboard';

  constructor(private settingPhaseService: SettingPhaseService, private productionOrderService: ProductionOrdersService, private mixtureModesService: MixtureModesService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.mixtureModesService.getMixtureModes().subscribe(
      (response) => {
        this.allMixtureModes = response;
      },
      (error) => {
        const dialogRef = this.httpUtils.errorDialog(error);
        dialogRef.afterClosed().subscribe(value => {
          this.router.navigate([this.backRoute]);
        });
      }
    );
    this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      if (id) {
        this.productionOrderService.getProductionOrder(id).subscribe(
          (po_response) => {
            this.productionOrder = po_response;
            this.productionOrder.delivery_date_string = this.httpUtils.getLocaleDateString(this.productionOrder.delivery_date);
            var sid = params.get('sid');
            if (sid) {
              if (this.productionOrder.setting_phases) {
                let sf = this.productionOrder.setting_phases.filter(phase => (phase.id === +sid))[0];
                if (sf) {
                  this.settingPhase = sf;
                  this.createForm();
                  this.isLoading = false;
                } else {
                  this.router.navigate([this.backRoute]);
                }
              } else {
                this.router.navigate([this.backRoute]);
              }
            } else {
              this.settingPhase.productionOrder = this.productionOrder;
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

  get effective_mixture_temperature() { return this.settingPhaseForm.get('effective_mixture_temperature'); }
  get effective_mixture_mode() { return this.settingPhaseForm.get('effective_mixture_mode'); }

  createForm() {
    this.settingPhaseForm = new FormGroup({
      'effective_mixture_mode': new FormControl(this.settingPhase.effective_mixture_mode ? this.settingPhase.effective_mixture_mode : this.productionOrder.expected_mixture_mode, [ Validators.required ]),
      'effective_mixture_temperature': new FormControl(this.settingPhase.effective_mixture_temperature ? this.settingPhase.effective_mixture_temperature : this.productionOrder.expected_mixture_temperature, [ Validators.required ])
    });
  }

  compareObjects(o1: any, o2: any): boolean {
      return (o2 != null) && (o1.id === o2.id);
  }

  getDataFromForm(s: SettingPhase): void {
    s.effective_mixture_mode = this.effective_mixture_mode.value;
    s.effective_mixture_temperature = this.effective_mixture_temperature.value;
  }

  save(): void {
    this.isSaving = true;
    if (this.settingPhase.id) {
      this.getDataFromForm(this.settingPhase);
      this.settingPhase.end_time = Math.floor(new Date().getTime()/1000);
      this.settingPhaseService.updateSettingPhase(this.productionOrder.id, this.settingPhase).subscribe(
        (response) => {
          this.isSaving = false;
          this.settingPhaseForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('SETTINGPHASE.SAVED'));
          this.router.navigate(['productionOrder/' + this.productionOrder.id + '/phases']);
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.settingPhase.start_time = Math.floor(new Date().getTime()/1000);
      this.settingPhaseService.createSettingPhase(this.productionOrder.id, this.settingPhase).subscribe(
        (response) => {
          this.isSaving = false;
          this.settingPhase = response;
          this.router.navigate(['productionOrder/' + this.productionOrder.id + '/settingPhases/' + this.settingPhase.id]);
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('SETTINGPHASE.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isDeleting = true;
        this.settingPhaseService.deleteSettingPhase(this.productionOrder.id, this.settingPhase).subscribe(
          (response) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('SETTINGPHASE.DELETED'));
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
