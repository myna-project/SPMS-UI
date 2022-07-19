import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../../_guards/pending-changes.guard';

import { MixtureMode } from '../../_models/mixturemode';

import { MixtureModesService } from '../../_services/mixturemodes.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './mixturemode-detail.component.html',
  styleUrls: ['./mixturemode-detail.component.scss']
})
export class MixtureModeComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.mixtureModeForm.touched;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  mixtureMode: MixtureMode = new MixtureMode();
  mixtureModeForm: FormGroup;
  backRoute: string = 'mixturemodes';

  constructor(private mixtureModesService: MixtureModesService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe((params: any) => {
      var mixtureModeId = params.get('id');
      if (mixtureModeId) {
        this.mixtureModesService.getMixtureMode(mixtureModeId).subscribe(
          (response: MixtureMode) => {
            this.mixtureMode = response;
            this.createForm();
            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            const dialogRef = this.httpUtils.errorDialog(error);
            dialogRef.afterClosed().subscribe((_value: any) => {
              this.router.navigate([this.backRoute]);
            });
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  get name() { return this.mixtureModeForm.get('name'); }

  createForm() {
    this.mixtureModeForm = new FormGroup({
      'name': new FormControl(this.mixtureMode.name, [ Validators.required ])
    });
  }

  save(): void {
    this.isSaving = true;
    let newMixtureMode: MixtureMode = this.mixtureModeForm.value;
    if (this.mixtureMode.id !== undefined) {
      newMixtureMode.id = this.mixtureMode.id;
      this.mixtureModesService.updateMixtureMode(newMixtureMode).subscribe(
        (response: MixtureMode) => {
          this.mixtureMode = response;
          this.isSaving = false;
          this.mixtureModeForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('MIXTUREMODE.SAVED'));
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.mixtureModesService.createMixtureMode(newMixtureMode).subscribe(
        (response: MixtureMode) => {
          this.mixtureMode = response;
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('MIXTUREMODE.SAVED'));
          this.mixtureModeForm.markAsUntouched();
          this.router.navigate(['mixturemode/' + this.mixtureMode.id]);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('MIXTUREMODE.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
        this.isDeleting = true;
        this.mixtureModesService.deleteMixtureMode(this.mixtureMode).subscribe(
          (_response: MixtureMode) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('MIXTUREMODE.DELETED'));
            this.mixtureModeForm.markAsUntouched();
            this.router.navigate([this.backRoute]);
          },
          (error: HttpErrorResponse) => {
            this.isDeleting = false;
            this.httpUtils.errorDialog(error);
          }
        );
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
