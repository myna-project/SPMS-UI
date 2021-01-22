import { User } from './user';
import { ProductionOrder } from './productionorder';
import { WorkingPhaseUser } from './workingPhaseUser';

export class WorkingPhase {
  id: number;
  productionOrder: ProductionOrder;
  shifts: WorkingPhaseUser[];
  start_time_string: string;
  end_time_string: string;
  current: boolean;
}
