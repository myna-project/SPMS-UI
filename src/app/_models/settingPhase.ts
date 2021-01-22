import { MixtureMode } from './mixturemode';
import { User } from './user';
import { ProductionOrder } from './productionorder';

export class SettingPhase {
  id: number;
  productionOrder: ProductionOrder;
  user: User;
  start_time: number;
  start_time_string: string;
  end_time: number;
  end_time_string: string;
  effective_mixture_temperature: number;
  effective_mixture_mode: MixtureMode;
  current: boolean;
}
