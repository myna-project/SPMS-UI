import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { User } from '../_models/user';

import { AuthenticationService } from '../_services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    let currentUser: User = this.authService.getCurrentUser();
    if (currentUser === null) {
      this.router.navigate(['/login']);
      return false;
    }
    if (!currentUser.isAdmin) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
