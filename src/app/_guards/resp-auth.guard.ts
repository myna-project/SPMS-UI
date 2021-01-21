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
        var isResp: boolean = false;
        let currentUser = this.authService.getCurrentUser();
        if (currentUser === null) {
            this.router.navigate(['/login']);
        }
        this.userService
            .getUsersByUsername(currentUser.username)
            .subscribe((user) => {
                if(currentUser.isAdmin || user[0].roles[0] == 3) {
                    isResp = true;
                } else {
                    this.router.navigate(['/dashboard']);
                }
            });
        return isResp;
    }
}
