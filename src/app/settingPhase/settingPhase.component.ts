import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { SettingPhase } from '../_models/settingPhase';
import { User } from '../_models/user';
import { MixtureMode } from '../_models/mixturemode';
import { ProductionOrder } from '../_models/productionorder';
import { SettingPhaseService } from '../_services/settingPhase.service';
import { UsersService } from '../_services/users.service';
import { MixtureModesService } from '../_services/mixturemodes.service';
import { ProductionOrdersService } from '../_services/productionorders.service';

import { HttpUtils } from '../_utils/http.utils';

import { AuthenticationService } from '../_services/authentication.service'

/**
* TODO NOTEs:
* - why is authService.getCurrentUser() stored without the associated ID?
* - JSON payloads: there's no need to serialize the whole ProductionOrder / User, yet we are forced to mantain backend consistency
*/
@Component({
  templateUrl: './settingPhase.component.html',
})
export class SettingPhaseComponent implements ComponentCanDeactivate, OnInit {

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
	return !this.settingPhaseForm.touched;
    }

    isSaving: boolean = false;
    isLoading: boolean = true;
    settingPhase: SettingPhase = new SettingPhase();
    backRoute = 'dashboard';
    settingPhaseForm: FormGroup;
    allMixtureModes: MixtureMode[];
    productionOrder: ProductionOrder;
    start_time: Date;
    currentUser: User;

    constructor(private settingPhaseService: SettingPhaseService,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private httpUtils: HttpUtils,
		private mixtureModesService: MixtureModesService,
		private productionOrderService: ProductionOrdersService,
		private authService: AuthenticationService,
		private userService: UsersService,
		private translate: TranslateService) {}

    ngOnInit(): void {
	this.createForm();
	this.start_time = new Date();
	var cUser = this.authService.getCurrentUser();
	if (cUser === null) {
	    this.router.navigate(['/login']);
	    return;
	}
	this.userService.getUsersByUsername(cUser.username).subscribe(
	    (response) => {
		this.currentUser = response[0]; // TODO FIX why is the user ID not stored as currentUser?
	    },
	    (error) => {
		const dialogRef = this.httpUtils.errorDialog(error);
		dialogRef.afterClosed().subscribe(value => {
		    this.router.navigate([this.backRoute]);
		});
	    }
	);
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
	    this.productionOrderService
		.getProductionOrder(params.get('id'))
		.subscribe(
		(po_response) => {
		    this.productionOrder = po_response;
		    this.settingPhaseService
			.getSettingPhases(this.productionOrder.id)
			.subscribe(
			(response) => {
			    this.isLoading = false;
			    if(response.length > 0) {
				this.settingPhase = response[0];
			    }
			},
			(error) => {
			    const dialogRef = this.httpUtils.errorDialog(error);
			    dialogRef.afterClosed().subscribe(value => {
				this.router.navigate([this.backRoute]);
			    });
			}
		    );
		},
		(error) => {
		    const dialogRef = this.httpUtils.errorDialog(error);
		    dialogRef.afterClosed().subscribe(value => {
			this.router.navigate([this.backRoute]);
		    });
		}
	    );
	});
    }

    compareObjects(o1: any, o2: any): boolean {
	return (o2 != null) && (o1.id === o2.id);
    }

    createForm() {
	// let patterns = this.httpUtils.getPatterns();
	this.settingPhaseForm = new FormGroup({
	    'effective_mixture_mode': new FormControl(
		this.settingPhase.effective_mixture_mode,
		[ Validators.required ]),
	    'effective_mixture_temperature': new FormControl(
		this.settingPhase.effective_mixture_temperature,
		[ Validators.required ])
	});
    }

    getDataFromForm(s: SettingPhase): SettingPhase {
	s.effective_mixture_mode = this.effective_mixture_mode.value;
	s.effective_mixture_temperature = this.httpUtils
	    .convertToNumber(this.effective_mixture_temperature.value);
	return s;
    }

    save(): void {
	this.isSaving = true;
	let newSettingPhase: SettingPhase = this.getDataFromForm(new SettingPhase());
	newSettingPhase.start_time = Math.floor(this.start_time.getTime()/1000);
	newSettingPhase.end_time = Math.floor(new Date().getTime()/1000);
	newSettingPhase.productionOrder = this.productionOrder;
	newSettingPhase.user = this.currentUser;
	if (this.settingPhase.id !== undefined) {
	    newSettingPhase.id = this.settingPhase.id;
	    this.settingPhaseService
		.updateSettingPhase(newSettingPhase)
		.subscribe(
		(response) => {
		    this.settingPhase = response;
		    this.isSaving = false;
		    this.settingPhaseForm.markAsUntouched();
		    this.httpUtils
			.successSnackbar(
			    this.translate.instant('SETTINGPHASE.SAVED'));
		    this.router
			.navigate(
			    ['systemPreparationPhase/'
				+ this.settingPhase.productionOrder.id]);
		},
		(error) => {
		    this.isSaving = false;
		    this.httpUtils.errorDialog(error);
		}
	    );
	} else {
	    this.settingPhaseService
		.createSettingPhase(newSettingPhase)
		.subscribe(
		(response) => {
		    this.settingPhase = response;
		    this.isSaving = false;
		    this.settingPhaseForm.markAsUntouched();
		    this.httpUtils
			.successSnackbar(
			    this.translate.instant('SETTINGPHASE.SAVED'));
		    this.router
			.navigate(
			    ['systemPreparationPhase/'
				+ this.settingPhase.productionOrder.id]);
		},
		(error) => {
		    this.isSaving = false;
		    this.httpUtils.errorDialog(error);
		}
	    );
	}
    }

    get effective_mixture_temperature() {
	return this.settingPhaseForm.get('effective_mixture_temperature');
    }
    get effective_mixture_mode() {
	return this.settingPhaseForm.get('effective_mixture_mode');
    }
}
