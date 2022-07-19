import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../../_guards/pending-changes.guard';

import { Additive } from '../../_models/additive';

import { AdditivesService } from '../../_services/additives.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './additive-detail.component.html',
  styleUrls: ['./additive-detail.component.scss']
})
export class AdditiveComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.additiveForm.touched;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  additive: Additive = new Additive();
  additiveForm: FormGroup;
  backRoute: string = 'additives';

  constructor(private additivesService: AdditivesService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe((params: any) => {
      var additiveId = params.get('id');
      if (additiveId) {
        this.additivesService.getAdditive(additiveId).subscribe(
          (response: Additive) => {
            this.additive = response;
            this.createForm();
            this.isLoading = false;
          },
          (error: any) => {
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

  get name() { return this.additiveForm.get('name'); }

  createForm() {
    this.additiveForm = new FormGroup({
      'name': new FormControl(this.additive.name, [ Validators.required ])
    });
  }

  save(): void {
    this.isSaving = true;
    let newAdditive: Additive = this.additiveForm.value;
    if (this.additive.id !== undefined) {
      newAdditive.id = this.additive.id;
      this.additivesService.updateAdditive(newAdditive).subscribe(
        (response: Additive) => {
          this.additive = response;
          this.isSaving = false;
          this.additiveForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('ADDITIVE.SAVED'));
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.additivesService.createAdditive(newAdditive).subscribe(
        (response: Additive) => {
          this.additive = response;
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('ADDITIVE.SAVED'));
          this.additiveForm.markAsUntouched();
          this.router.navigate(['additive/' + this.additive.id]);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('ADDITIVE.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
        this.isDeleting = true;
        this.additivesService.deleteAdditive(this.additive).subscribe(
          (_response: Additive) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('ADDITIVE.DELETED'));
            this.additiveForm.markAsUntouched();
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