import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
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
  backRoute = 'additives';

  constructor(private additivesService: AdditivesService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe(params => {
      var additiveId = params.get('id');
      if (additiveId) {
        this.additivesService.getAdditive(additiveId).subscribe(
          (response) => {
            this.additive = response;
            this.createForm();
            this.isLoading = false;
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
        (response) => {
          this.additive = response;
          this.isSaving = false;
          this.additiveForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('ADDITIVE.SAVED'));
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.additivesService.createAdditive(newAdditive).subscribe(
        (response) => {
          this.additive = response;
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('ADDITIVE.SAVED'));
          this.additiveForm.markAsUntouched();
          this.router.navigate(['additive/' + this.additive.id]);
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('ADDITIVE.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isDeleting = true;
        this.additivesService.deleteAdditive(this.additive).subscribe(
          (response) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('ADDITIVE.DELETED'));
            this.additiveForm.markAsUntouched();
            this.router.navigate([this.backRoute]);
          },
          (error) => {
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