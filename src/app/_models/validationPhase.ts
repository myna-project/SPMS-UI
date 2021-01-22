import { User } from './user';
import { ProductionOrder } from './productionorder';

export class ValidationPhase {
  id: number;
  productionOrder: ProductionOrder;
  user: User;
  start_time: number;
  start_time_string: string;
  end_time: number;
  end_time_string: string;
  humidity_finished_product: number;
  density_finished_product: number;
  packaging_state: string;
  sieve_quantity: number;
  chimney_quantity: number;
  tower_entry_temperature: number;
  tower_intern_temperature: number;
  cyclon_entry_temperature: number;
  note: string;
}
