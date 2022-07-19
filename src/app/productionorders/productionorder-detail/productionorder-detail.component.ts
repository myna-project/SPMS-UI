import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../../_guards/pending-changes.guard';

import { Additive } from '../../_models/additive';
import { AdditiveProductionOrder } from '../../_models/additiveproductionorder';
import { Customer } from '../../_models/customer';
import { MixtureMode } from '../../_models/mixturemode';
import { Packaging } from '../../_models/packaging';
import { ProductionOrder } from '../../_models/productionorder';
import { RawMaterial } from '../../_models/rawmaterial';

import { AdditivesService } from '../../_services/additives.service';
import { CustomersService } from '../../_services/customers.service';
import { MixtureModesService } from '../../_services/mixturemodes.service';
import { PackagingsService } from '../../_services/packagings.service';
import { ProductionOrdersService } from '../../_services/productionorders.service';
import { RawMaterialsService } from '../../_services/rawmaterials.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './productionorder-detail.component.html',
  styleUrls: ['./productionorder-detail.component.scss']
})
export class ProductionOrderComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.productionOrderForm.touched;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  productionOrder: ProductionOrder = new ProductionOrder();
  productionOrderForm: FormGroup;
  additivesCounter: number[];
  allAdditives: Additive[];
  allCustomers: Customer[];
  allMixtureModes: MixtureMode[];
  allPackagings: Packaging[];
  allRawMaterials: RawMaterial[];
  backRoute: string = 'productionOrders';

  constructor(private productionOrdersService: ProductionOrdersService, private additivesService: AdditivesService, private customersService: CustomersService, private mixtureModesService: MixtureModesService, private packagingsService: PackagingsService, private rawMaterialsService: RawMaterialsService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe((params: any) => {
      var productionOrderId = params.get('id');
      if (productionOrderId) {
        this.productionOrdersService.getProductionOrder(productionOrderId).subscribe(
          (response: ProductionOrder) => {
            this.productionOrder = response;
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
    this.additivesService.getAdditives().subscribe(
      (response: Additive[]) => {
        this.allAdditives = response;
      },
      (error: HttpErrorResponse) => {
        const dialogRef = this.httpUtils.errorDialog(error);
        dialogRef.afterClosed().subscribe((_value: any) => {
          this.router.navigate([this.backRoute]);
        });
      }
    );
    this.customersService.getCustomers().subscribe(
      (response: Customer[]) => {
        this.allCustomers = response;
      },
      (error: HttpErrorResponse) => {
        const dialogRef = this.httpUtils.errorDialog(error);
        dialogRef.afterClosed().subscribe((_value: any) => {
          this.router.navigate([this.backRoute]);
        });
      }
    );
    this.mixtureModesService.getMixtureModes().subscribe(
      (response: MixtureMode[]) => {
        this.allMixtureModes = response;
      },
      (error: HttpErrorResponse) => {
        const dialogRef = this.httpUtils.errorDialog(error);
        dialogRef.afterClosed().subscribe((_value: any) => {
          this.router.navigate([this.backRoute]);
        });
      }
    );
    this.packagingsService.getPackagings().subscribe(
      (response: Packaging[]) => {
        this.allPackagings = response;
      },
      (error: HttpErrorResponse) => {
        const dialogRef = this.httpUtils.errorDialog(error);
        dialogRef.afterClosed().subscribe((_value: any) => {
          this.router.navigate([this.backRoute]);
        });
      }
    );
    this.rawMaterialsService.getRawMaterials().subscribe(
      (response: RawMaterial[]) => {
        this.allRawMaterials = response;
      },
      (error: HttpErrorResponse) => {
        const dialogRef = this.httpUtils.errorDialog(error);
        dialogRef.afterClosed().subscribe((_value: any) => {
          this.router.navigate([this.backRoute]);
        });
      }
    );
  }

  get customer() { return this.productionOrderForm.get('customer'); }
  get production_order_code() { return this.productionOrderForm.get('production_order_code'); }
  get production_number_lot() { return this.productionOrderForm.get('production_number_lot'); }
  get raw_material() { return this.productionOrderForm.get('raw_material'); }
  get weight_raw_material() { return this.productionOrderForm.get('weight_raw_material'); }
  get tons_raw_material() { return this.productionOrderForm.get('tons_raw_material'); }
  get dry_residue() { return this.productionOrderForm.get('dry_residue'); }
  get density_raw_material() { return this.productionOrderForm.get('density_raw_material'); }
  get expected_mixture_temperature() { return this.productionOrderForm.get('expected_mixture_temperature'); }
  get expected_mixture_mode() { return this.productionOrderForm.get('expected_mixture_mode'); }
  get expected_quantity_finished_product() { return this.productionOrderForm.get('expected_quantity_finished_product'); }
  get delivery_date() { return this.productionOrderForm.get('delivery_date'); }
  get packaging() { return this.productionOrderForm.get('packaging'); }
  get production_order_date() { return this.productionOrderForm.get('production_order_date'); }
  get ddt_date() { return this.productionOrderForm.get('ddt_date'); }
  get ddt_number() { return this.productionOrderForm.get('ddt_number'); }

  createForm() {
    let patterns = this.httpUtils.getPatterns();
    this.productionOrderForm = new FormGroup({
      'customer': new FormControl(this.productionOrder.customer, [ Validators.required ]),
      'production_order_code': new FormControl(this.productionOrder.production_order_code, [ Validators.required ]),
      'production_number_lot': new FormControl(this.productionOrder.production_number_lot, [ Validators.required ]),
      'raw_material': new FormControl(this.productionOrder.raw_material, [ Validators.required ]),
      'weight_raw_material': new FormControl(this.httpUtils.convertFromNumber(this.productionOrder.weight_raw_material), [ Validators.required, Validators.pattern(patterns.positiveFloat) ]),
      'tons_raw_material': new FormControl(this.productionOrder.tons_raw_material, [ Validators.required, Validators.pattern(patterns.positiveFloat) ]),
      'dry_residue': new FormControl(this.httpUtils.convertFromNumber(this.productionOrder.dry_residue), [ Validators.pattern(patterns.positiveFloat) ]),
      'density_raw_material': new FormControl(this.httpUtils.convertFromNumber(this.productionOrder.density_raw_material), [ Validators.pattern(patterns.positiveFloat) ]),
      'expected_mixture_temperature': new FormControl(this.httpUtils.convertFromNumber(this.productionOrder.expected_mixture_temperature), [ Validators.pattern(patterns.positiveNegativeFloat) ]),
      'expected_mixture_mode': new FormControl(this.productionOrder.expected_mixture_mode, []),
      'expected_quantity_finished_product': new FormControl(this.httpUtils.convertFromNumber(this.productionOrder.expected_quantity_finished_product), [ Validators.pattern(patterns.positiveFloat) ]),
      'delivery_date': new FormControl(this.productionOrder.delivery_date ? new Date(this.productionOrder.delivery_date) : undefined, []),
      'packaging': new FormControl(this.productionOrder.packaging, []),
      'production_order_date': new FormControl(this.productionOrder.production_order_date ? new Date(this.productionOrder.production_order_date) : undefined, []),
      'ddt_date': new FormControl(this.productionOrder.ddt_date ? new Date(this.productionOrder.ddt_date) : undefined, []),
      'ddt_number': new FormControl(this.productionOrder.ddt_number, [])
    });
    this.additivesCounter = [];
    if (this.productionOrder.id && this.productionOrder.additives && (this.productionOrder.additives.length > 0)) {
      this.productionOrder.additives.forEach(apo => {
        this.addAdditive(apo);
      });
    } else {
      this.addAdditive(undefined);
    }
  }

  addAdditive(apo: AdditiveProductionOrder): void {
    let patterns = this.httpUtils.getPatterns();
    this.productionOrderForm.addControl('additive_' + (this.additivesCounter ? this.additivesCounter.length : 0), new FormControl(apo ? apo.additive : undefined, []));
    this.productionOrderForm.addControl('weight_additive_' + (this.additivesCounter ? this.additivesCounter.length : 0), new FormControl(apo ? this.httpUtils.convertFromNumber(apo.weight_additive) : undefined, [ Validators.pattern(patterns.positiveFloat) ]));
    if (this.additivesCounter && this.additivesCounter.length > 0)
      this.additivesCounter.push(this.additivesCounter.length);
    else
      this.additivesCounter = [0];
  }

  compareObjects(o1: any, o2: any): boolean {
    return (o2 != null) && (o1.id === o2.id);
  }

  getDataFromForm(po: ProductionOrder): ProductionOrder {
    po.completed = false;
    po.customer = this.customer.value;
    po.production_order_code = this.production_order_code.value;
    po.production_number_lot = this.production_number_lot.value;
    po.raw_material = this.raw_material.value;
    po.weight_raw_material = this.httpUtils.convertToNumber(this.weight_raw_material.value);
    po.tons_raw_material = this.tons_raw_material.value;
    po.dry_residue = this.httpUtils.convertToNumber(this.dry_residue.value);
    po.density_raw_material = this.httpUtils.convertToNumber(this.density_raw_material.value);
    po.expected_mixture_temperature = this.httpUtils.convertToNumber(this.expected_mixture_temperature.value);
    po.expected_mixture_mode = this.expected_mixture_mode.value;
    po.expected_quantity_finished_product = this.httpUtils.convertToNumber(this.expected_quantity_finished_product.value);
    if (this.delivery_date.value)
      po.delivery_date = this.httpUtils.getDateForForm(new Date(this.delivery_date.value));
    po.packaging = this.packaging.value;
    if (this.production_order_date.value)
      po.production_order_date = this.httpUtils.getDateForForm(new Date(this.production_order_date.value));
    if (this.ddt_date.value)
      po.ddt_date = this.httpUtils.getDateForForm(new Date(this.ddt_date.value));
    po.ddt_number = this.ddt_number.value;
    this.additivesCounter.forEach(count => {
      if (this.productionOrderForm.get('additive_' + count).value) {
        let apo: AdditiveProductionOrder = new AdditiveProductionOrder();
        apo.additive = this.productionOrderForm.get('additive_' + count).value;
          apo.weight_additive = this.httpUtils.convertToNumber(this.productionOrderForm.get('weight_additive_' + count).value);
        if (po.additives && po.additives.length > 0) {
          po.additives.push(apo);
        } else {
          po.additives = [apo];
        }
      }
    });

    return po;
  }

  save(): void {
    this.isSaving = true;
    let newProductionOrder: ProductionOrder = this.getDataFromForm(new ProductionOrder());
    if (this.productionOrder.id !== undefined) {
      newProductionOrder.id = this.productionOrder.id;
      this.productionOrdersService.updateProductionOrder(newProductionOrder).subscribe(
        (response: ProductionOrder) => {
          this.productionOrder = response;
          this.isSaving = false;
          this.productionOrderForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('PRODUCTIONORDER.SAVED'));
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.productionOrdersService.createProductionOrder(newProductionOrder).subscribe(
        (response: ProductionOrder) => {
          this.productionOrder = response;
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('PRODUCTIONORDER.SAVED'));
          this.productionOrderForm.markAsUntouched();
          this.router.navigate(['productionOrder/' + this.productionOrder.id]);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('PRODUCTIONORDER.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
        this.isDeleting = true;
        this.productionOrdersService.deleteProductionOrder(this.productionOrder).subscribe(
          (_response: ProductionOrder) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('PRODUCTIONORDER.DELETED'));
            this.productionOrderForm.markAsUntouched();
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
