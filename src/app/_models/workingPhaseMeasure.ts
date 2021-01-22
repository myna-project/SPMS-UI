import { User } from './user';
import { WorkingPhase } from './workingPhase';

export class WorkingPhaseMeasure { 
  id: number;
  workingPhase: WorkingPhase;
  user: User;
  time: number;
  time_string: string;
  finished_product_quantity: number;
}
