import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdditiveComponent } from './additives/additive-detail/additive-detail.component';
import { AdditivesComponent } from './additives/additives-list/additives-list.component';
import { CustomerComponent } from './customers/customer-detail/customer-detail.component';
import { CustomersComponent } from './customers/customers-list/customers-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MixtureModeComponent } from './mixturemodes/mixturemode-detail/mixturemode-detail.component';
import { MixtureModesComponent } from './mixturemodes/mixturemodes-list/mixturemodes-list.component';
import { PackagingComponent } from './packagings/packaging-detail/packaging-detail.component';
import { PackagingsComponent } from './packagings/packagings-list/packagings-list.component';
import { ProductionOrderComponent } from './productionorders/productionorder-detail/productionorder-detail.component';
import { ProductionOrdersComponent } from './productionorders/productionorders-list/productionorders-list.component';
import { ProfileComponent } from './profile/profile.component';
import { RawMaterialComponent } from './rawmaterials/rawmaterial-detail/rawmaterial-detail.component';
import { RawMaterialsComponent } from './rawmaterials/rawmaterials-list/rawmaterials-list.component';
import { UserComponent } from './users/user-detail/user-detail.component';
import { UsersComponent } from './users/users-list/users-list.component';
import { PhasesComponent } from './phases/phases.component';
import { SettingPhaseComponent } from './settingPhase/settingPhase.component';
import { SystemPreparationPhaseComponent } from './systemPreparationPhase/systemPreparationPhase.component';
import { CleaningPhaseComponent } from './cleaningPhase/cleaningPhase.component';
import { ValidationPhaseComponent } from './validationPhase/validationPhase.component';
import { WorkingPhaseComponent } from './workingPhase/workingPhase.component';

import { AuthGuard } from './_guards/auth.guard';
import { RespAuthGuard } from './_guards/resp-auth.guard';
import { PendingChangesGuard } from './_guards/pending-changes.guard';
import { AdminAuthGuard } from './_guards/admin-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'additives',
    component: AdditivesComponent,
    canActivate: [ AdminAuthGuard ]
  },
  {
    path: 'additive/:id',
    component: AdditiveComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'additive',
    component: AdditiveComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [ AdminAuthGuard ]
  },
  {
    path: 'customer/:id',
    component: CustomerComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'mixturemodes',
    component: MixtureModesComponent,
    canActivate: [ AdminAuthGuard ]
  },
  {
    path: 'mixturemode/:id',
    component: MixtureModeComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'mixturemode',
    component: MixtureModeComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'packagings',
    component: PackagingsComponent,
    canActivate: [ AdminAuthGuard ]
  },
  {
    path: 'packaging/:id',
    component: PackagingComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'packaging',
    component: PackagingComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrders',
    component: ProductionOrdersComponent,
    canActivate: [ AdminAuthGuard ]
  },
  {
    path: 'productionOrder/:id',
    component: ProductionOrderComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder',
    component: ProductionOrderComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'rawmaterials',
    component: RawMaterialsComponent,
    canActivate: [ AdminAuthGuard ]
  },
  {
    path: 'rawmaterial/:id',
    component: RawMaterialComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'rawmaterial',
    component: RawMaterialComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [ AdminAuthGuard ]
  },
  {
    path: 'user/:id',
    component: UserComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [ AdminAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/phases',
    component: PhasesComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/settingPhase',
    component: SettingPhaseComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/settingPhases/:sid',
    component: SettingPhaseComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/systemPreparationPhase',
    component: SystemPreparationPhaseComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/systemPreparationPhases/:sid',
      component: SystemPreparationPhaseComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/cleaningPhase',
    component: CleaningPhaseComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/cleaningPhases/:sid',
    component: CleaningPhaseComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/validationPhase',
    component: ValidationPhaseComponent,
    canActivate: [ RespAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/validationPhases/:sid',
    component: ValidationPhaseComponent,
    canActivate: [ RespAuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/workingPhase',
    component: WorkingPhaseComponent, // TODO
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: 'productionOrder/:id/workingPhases/:sid',
    component: WorkingPhaseComponent, // TODO
    canActivate: [ AuthGuard ],
    canDeactivate: [ PendingChangesGuard ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
