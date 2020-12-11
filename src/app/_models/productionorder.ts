import { AdditiveProductionOrder } from './additiveproductionorder';
import { Customer } from './customer';
import { MixtureMode } from './mixturemode';
import { Packaging } from './packaging';
import { RawMaterial } from './rawmaterial';

export class ProductionOrder {
  id: number;
  customer: Customer;
  production_order_code: string;
  production_number_lot: string;
  raw_material: RawMaterial;
  weight_raw_material: number;
  tons_raw_material: number;
  dry_residue: number;
  density_raw_material: number;
  additives: AdditiveProductionOrder[];
  expected_mixture_temperature: number;
  expected_mixture_mode: MixtureMode;
  expected_quantity_finished_product: number;
  delivery_date: string;
  delivery_date_string: string;
  packaging: Packaging;
  production_order_date: string;
  production_order_date_string: string;
  ddt_date: string;
  ddt_date_string: string;
  ddt_number: string;
}
