import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { ProductionOrder } from '../_models/productionorder';
import { ValidationPhase } from '../_models/validationPhase';

import { ProductionOrdersService } from '../_services/productionorders.service';
import { ValidationPhaseService } from '../_services/validationPhase.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
  templateUrl: './validationPhase.component.html',
})
export class ValidationPhaseComponent implements ComponentCanDeactivate,OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return true;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  validationPhase: ValidationPhase = new ValidationPhase();
  productionOrder: ProductionOrder = new ProductionOrder();
  validationPhaseForm: FormGroup;
  backRoute: string = 'dashboard';

  constructor(private productionOrderService: ProductionOrdersService, private validationPhaseService: ValidationPhaseService, private route: ActivatedRoute, private router: Router, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe((params: any) => {
      var id = params.get('id');
      if (id) {
        this.productionOrderService.getProductionOrder(id).subscribe(
          (po_response: ProductionOrder) => {
            this.productionOrder = po_response;
            var sid = params.get('sid');
            if (sid) {
              if (this.productionOrder.validation_phases) {
                let sf = this.productionOrder.validation_phases.filter(phase => (phase.id === +sid))[0];
                if (sf) {
                  sf.productionOrder = new ProductionOrder();
                  sf.productionOrder.id = +id;
                  this.validationPhase = sf;
                  this.createForm();
                  this.isLoading = false;
                } else {
                  this.router.navigate([this.backRoute]);
                }
              } else {
                this.router.navigate([this.backRoute]);
              }
            } else {
              this.validationPhase.productionOrder = this.productionOrder;
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

  compareObjects(o1: any, o2: any): boolean {
    return (o2 != null) && (o1.id === o2.id);
  }

  get humidity_finished_product() { return this.validationPhaseForm.get('humidity_finished_product'); }
  get density_finished_product() { return this.validationPhaseForm.get('density_finished_product'); }
  get packaging_state() { return this.validationPhaseForm.get('packaging_state'); }
  get sieve_quantity() { return this.validationPhaseForm.get('sieve_quantity'); }
  get chimney_quantity() {  return this.validationPhaseForm.get('chimney_quantity'); }
  get tower_entry_temperature() { return this.validationPhaseForm.get('tower_entry_temperature'); }
  get tower_intern_temperature() { return this.validationPhaseForm.get('tower_intern_temperature'); }
  get cyclon_entry_temperature() { return this.validationPhaseForm.get('cyclon_entry_temperature'); }
  get note() { return this.validationPhaseForm.get('note'); }

  createForm() {
    this.validationPhaseForm = new FormGroup({
      'density_finished_product': new FormControl(this.validationPhase.density_finished_product, [ Validators.required ]),
      'humidity_finished_product': new FormControl(this.validationPhase.humidity_finished_product, [ Validators.required ]),
      'packaging_state': new FormControl(this.validationPhase.packaging_state, []),
      'sieve_quantity': new FormControl(this.validationPhase.sieve_quantity, []),
      'chimney_quantity': new FormControl(this.validationPhase.chimney_quantity, []),
      'tower_entry_temperature': new FormControl(this.validationPhase.tower_entry_temperature, []),
      'tower_intern_temperature': new FormControl(this.validationPhase.tower_intern_temperature,[]),
      'cyclon_entry_temperature': new FormControl(this.validationPhase.cyclon_entry_temperature, []),
      'note': new FormControl(this.validationPhase.note,[])
    });
  }

  getDataFromForm(s: ValidationPhase): void {
    s.density_finished_product = this.density_finished_product.value;
    s.humidity_finished_product = this.humidity_finished_product.value;
    s.packaging_state = this.packaging_state.value;
    s.sieve_quantity = this.sieve_quantity.value;
    s.chimney_quantity = this.chimney_quantity.value;
    s.tower_entry_temperature = this.tower_entry_temperature.value;
    s.tower_intern_temperature = this.tower_intern_temperature.value;
    s.cyclon_entry_temperature = this.cyclon_entry_temperature.value;
    s.note = this.note.value;
  }

  save(): void {
    this.isSaving = true;
    if (this.validationPhase.id) {
      this.getDataFromForm(this.validationPhase);
      this.validationPhase.end_time = Math.floor(new Date().getTime()/1000);
      this.validationPhaseService.updateValidationPhase(this.productionOrder.id, this.validationPhase).subscribe(
        (_response: ValidationPhase) => {
          this.isSaving = false;
          this.validationPhaseForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('VALIDATIONPHASE.SAVED'));
          this.router.navigate(['productionOrder/' + this.productionOrder.id + '/phases']);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
         }
      );
    } else {
      this.validationPhase.start_time = Math.floor(new Date().getTime()/1000);
      this.validationPhaseService.createValidationPhase(this.productionOrder.id, this.validationPhase).subscribe(
        (response: ValidationPhase) => {
          this.isSaving = false;
          this.validationPhase = response;
          this.router.navigate(['productionOrder/' + this.productionOrder.id + '/validationPhases/' + this.validationPhase.id]);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('VALIDATIONPHASE.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
        this.isDeleting = true;
        this.validationPhaseService.deleteValidationPhase(this.productionOrder.id, this.validationPhase).subscribe(
          (_response: ValidationPhase) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('VALIDATIONPHASE.DELETED'));
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
