import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { ValidationPhase } from '../_models/validationPhase';
import { User } from '../_models/user';
import { ProductionOrder } from '../_models/productionorder';

import { ValidationPhaseService } from '../_services/validationPhase.service';
import { UsersService } from '../_services/users.service';
import { ProductionOrdersService } from '../_services/productionorders.service';
import { AuthenticationService } from '../_services/authentication.service'

import { HttpUtils } from '../_utils/http.utils';

/**
* TODO NOTEs:
* - JSON payloads: there's no need to serialize the whole ProductionOrder / User, yet we are forced to mantain backend consistency
*/
@Component({
  templateUrl: './validationPhase.component.html',
})
export class ValidationPhaseComponent implements ComponentCanDeactivate,OnInit {

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
	return true;
    }

    saved: boolean = false;
    isSaving: boolean = false;
    isLoading: boolean = true;
    validationPhase: ValidationPhase = new ValidationPhase();
    validationPhaseForm: FormGroup;
    backRoute = 'dashboard';
    productionOrder: ProductionOrder;
    start_time: Date;

    constructor(private validationPhaseService: ValidationPhaseService,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private httpUtils: HttpUtils,
		private productionOrderService: ProductionOrdersService,
		private authService: AuthenticationService,
		private userService: UsersService,
		private translate: TranslateService) {}

    ngOnInit(): void {
        this.createForm();
        this.start_time = new Date();
        this.route.paramMap
            .subscribe(params => {
                var id = params.get('id');
                if(id) {
                    this.productionOrderService
                        .getProductionOrder(id)
                        .subscribe(
                            (po_response) => {
                                this.productionOrder = po_response;
                                var sid = params.get('sid');
                                if(sid) {
                                    this.validationPhaseService
                                        .getValidationPhase(id, sid)
                                        .subscribe(
                                            (response) => {
                                                this.isLoading = false;
                                                this.validationPhase = response;
                                            },
                                            (error) => {
                                                const dialogRef = this.httpUtils.errorDialog(error);
                                                dialogRef.afterClosed().subscribe(value => {
                                                    this.router.navigate([this.backRoute]);
						                        });
					                        }
					                    );
				                } else {
				                    this.isLoading = false;
				                }
			                },
			                (error) => {
				                const dialogRef = this.httpUtils.errorDialog(error);
				                dialogRef.afterClosed().subscribe(value => {
				                    this.router.navigate([this.backRoute]);
				                });
			                });
		        }
	        });
    }


    compareObjects(o1: any, o2: any): boolean {
        return (o2 != null) && (o1.id === o2.id);
    }

    createForm() {
        // let patterns = this.httpUtils.getPatterns();
        this.validationPhaseForm = new FormGroup({
            'density_finished_product': new FormControl(
                this.validationPhase.density_finished_product,
                [ Validators.required ]),
            'humidity_finished_product': new FormControl(
                this.validationPhase.humidity_finished_product,
                [ Validators.required ]),
            'packaging_state': new FormControl(
                this.validationPhase.packaging_state,
                [ ]),
            'sieve_quantity': new FormControl(
                this.validationPhase.sieve_quantity,
                [ ]),
            'chimney_quantity': new FormControl(
                this.validationPhase.chimney_quantity,
                [ ]),
            'tower_entry_temperature': new FormControl(
                this.validationPhase.tower_entry_temperature,
                [ ]),
            'tower_intern_temperature': new FormControl(
                this.validationPhase.tower_intern_temperature,
                [ ]),
            'cyclon_entry_temperature': new FormControl(
                this.validationPhase.cyclon_entry_temperature,
                [ ]),
            'note': new FormControl(
                this.validationPhase.note,
                [ ])
	    });
    }

    getDataFromForm(s: ValidationPhase): ValidationPhase {
	    s.density_finished_product = this.density_finished_product.value;
	    s.humidity_finished_product = this.humidity_finished_product.value; // form entry type is number
	    s.packaging_state = this.packaging_state.value;
	    s.sieve_quantity = this.sieve_quantity.value;
	    s.chimney_quantity = this.chimney_quantity.value;
	    s.tower_entry_temperature = this.tower_entry_temperature.value;
	    s.tower_intern_temperature = this.tower_intern_temperature.value;
	    s.cyclon_entry_temperature = this.cyclon_entry_temperature.value;
	    s.note = this.note.value;
	    return s;
    }

    save(): void {
        this.isSaving = true;
        var newValidationPhase = this.getDataFromForm(new ValidationPhase());
        newValidationPhase.start_time = Math.floor(this.start_time.getTime()/1000);
        newValidationPhase.end_time = Math.floor(new Date().getTime()/1000);
        newValidationPhase.productionOrder = this.productionOrder;
        if (this.validationPhase.id !== undefined) {
            newValidationPhase.id = this.validationPhase.id;
            this.validationPhaseService
                .updateValidationPhase(newValidationPhase)
                .subscribe(
                    (response) => {
                        this.validationPhase = response;
                        this.isSaving = false;
                        this.saved = true;
                        this.httpUtils
                            .successSnackbar(
                                this.translate.instant('VALIDATIONPHASE.SAVED'));
                        this.router
                            .navigate(
                                ['productionOrder/'
                                    + this.validationPhase.productionOrder.id
                                    + '/phases']);
                    },
                    (error) => {
                        this.isSaving = false;
                        this.httpUtils.errorDialog(error);
                    }
                );
        } else {
            this.validationPhaseService
                .createValidationPhase(newValidationPhase)
                .subscribe(
                    (response) => {
                        this.validationPhase = response;
                        this.isSaving = false;
                        this.saved = true;
                        this.httpUtils
                            .successSnackbar(
                                this.translate.instant('VALIDATIONPHASE.SAVED'));
                        this.router
                            .navigate(
                                ['productionOrder/'
                                    + this.validationPhase.productionOrder.id
                                    + '/phases']);
                    },
                    (error) => {
                        this.isSaving = false;
                        this.httpUtils.errorDialog(error);
                    }
                );
        }
    }

    get humidity_finished_product() {
	    return this.validationPhaseForm.get('humidity_finished_product');
    }
    get density_finished_product() {
	    return this.validationPhaseForm.get('density_finished_product');
    }
    get packaging_state() {
	    return this.validationPhaseForm.get('packaging_state');
    }
    get sieve_quantity() {
	    return this.validationPhaseForm.get('sieve_quantity');
    }
    get chimney_quantity() {
	    return this.validationPhaseForm.get('chimney_quantity');
    }
    get tower_entry_temperature() {
	    return this.validationPhaseForm.get('tower_entry_temperature');
    }
    get tower_intern_temperature() {
	    return this.validationPhaseForm.get('tower_intern_temperature');
    }
    get cyclon_entry_temperature() {
	    return this.validationPhaseForm.get('cyclon_entry_temperature');
    }
    get note() {
	    return this.validationPhaseForm.get('note');
    }
}
