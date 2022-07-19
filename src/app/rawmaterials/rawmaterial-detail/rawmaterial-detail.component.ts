import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../../_guards/pending-changes.guard';

import { RawMaterial } from '../../_models/rawmaterial';

import { RawMaterialsService } from '../../_services/rawmaterials.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './rawmaterial-detail.component.html',
  styleUrls: ['./rawmaterial-detail.component.scss']
})
export class RawMaterialComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.rawMaterialForm.touched;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  rawMaterial: RawMaterial = new RawMaterial();
  rawMaterialForm: FormGroup;
  backRoute: string = 'rawmaterials';

  constructor(private rawMaterialsService: RawMaterialsService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe((params: any) => {
      var rawMaterialId = params.get('id');
      if (rawMaterialId) {
        this.rawMaterialsService.getRawMaterial(rawMaterialId).subscribe(
          (response: RawMaterial) => {
            this.rawMaterial = response;
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

  get name() { return this.rawMaterialForm.get('name'); }

  createForm() {
    this.rawMaterialForm = new FormGroup({
      'name': new FormControl(this.rawMaterial.name, [ Validators.required ])
    });
  }

  save(): void {
    this.isSaving = true;
    let newRawMaterial: RawMaterial = this.rawMaterialForm.value;
    if (this.rawMaterial.id !== undefined) {
      newRawMaterial.id = this.rawMaterial.id;
      this.rawMaterialsService.updateRawMaterial(newRawMaterial).subscribe(
        (response: RawMaterial) => {
          this.rawMaterial = response;
          this.isSaving = false;
          this.rawMaterialForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('RAWMATERIAL.SAVED'));
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.rawMaterialsService.createRawMaterial(newRawMaterial).subscribe(
        (response: RawMaterial) => {
          this.rawMaterial = response;
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('RAWMATERIAL.SAVED'));
          this.rawMaterialForm.markAsUntouched();
          this.router.navigate(['rawmaterial/' + this.rawMaterial.id]);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('RAWMATERIAL.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
        this.isDeleting = true;
        this.rawMaterialsService.deleteRawMaterial(this.rawMaterial).subscribe(
          (_response: RawMaterial) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('RAWMATERIAL.DELETED'));
            this.rawMaterialForm.markAsUntouched();
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
