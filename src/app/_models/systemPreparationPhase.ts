import { User } from './user';
import { ProductionOrder } from './productionorder';

export class SystemPreparationPhase {
    id: number;
    productionOrder: ProductionOrder;
    user: User;
    start_time: number;
    end_time: number;
}
