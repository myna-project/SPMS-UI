import { User } from './user';
import { ProductionOrder } from './productionorder';
import { WorkingPhaseMeasure } from './workingPhaseMeasure';

export class WorkingPhase {
  id: number;
  productionOrder: ProductionOrder;
  user: User;
  start_time: number;
  start_time_string: string;
  end_time: number;
  end_time_string: string;
  measures: WorkingPhaseMeasure[];
  current: boolean;
}
