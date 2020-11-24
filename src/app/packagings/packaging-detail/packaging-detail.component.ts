import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../../_guards/pending-changes.guard';

import { Packaging } from '../../_models/packaging';

import { PackagingsService } from '../../_services/packagings.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './packaging-detail.component.html',
  styleUrls: ['./packaging-detail.component.scss']
})
export class PackagingComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.packagingForm.touched;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  packaging: Packaging = new Packaging();
  packagingForm: FormGroup;
  backRoute = 'packagings';

  constructor(private packagingsService: PackagingsService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe(params => {
      var packagingId = params.get('id');
      if (packagingId) {
        this.packagingsService.getPackaging(packagingId).subscribe(
          (response) => {
            this.packaging = response;
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

  get packaging_mode() { return this.packagingForm.get('packaging_mode'); }

  createForm() {
    this.packagingForm = new FormGroup({
      'packaging_mode': new FormControl(this.packaging.packaging_mode, [ Validators.required ])
    });
  }

  save(): void {
    this.isSaving = true;
    let newPackaging: Packaging = this.packagingForm.value;
    if (this.packaging.id !== undefined) {
      newPackaging.id = this.packaging.id;
      this.packagingsService.updatePackaging(newPackaging).subscribe(
        (response) => {
          this.packaging = response;
          this.isSaving = false;
          this.packagingForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('PACKAGING.SAVED'));
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.packagingsService.createPackaging(newPackaging).subscribe(
        (response) => {
          this.packaging = response;
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('PACKAGING.SAVED'));
          this.packagingForm.markAsUntouched();
          this.router.navigate(['packaging/' + this.packaging.id]);
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('PACKAGING.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isDeleting = true;
        this.packagingsService.deletePackaging(this.packaging).subscribe(
          (response) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('PACKAGING.DELETED'));
            this.packagingForm.markAsUntouched();
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