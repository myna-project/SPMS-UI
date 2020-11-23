import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerComponent } from './customers/customer-detail/customer-detail.component';
import { CustomersComponent } from './customers/customers-list/customers-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './users/user-detail/user-detail.component';
import { UsersComponent } from './users/users-list/users-list.component';

import { AuthGuard } from './_guards/auth.guard';
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
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
