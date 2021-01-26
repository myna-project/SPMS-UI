import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { User } from '../_models/user';

import { AuthenticationService } from '../_services/authentication.service';
import { UsersService } from '../_services/users.service';

@Injectable({
    providedIn: 'root'
})
export class RespAuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UsersService, private authService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let currentUser = this.authService.getCurrentUser();
    if (currentUser === null)
      this.router.navigate(['/login']);

    if (!(currentUser.isAdmin || currentUser.isResp)) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
