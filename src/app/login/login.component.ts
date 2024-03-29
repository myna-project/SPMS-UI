import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { User } from '../_models/user';

import { AuthenticationService } from '../_services/authentication.service';
import { UsersService } from '../_services/users.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading: boolean = false;
  returnUrl: string;
  loginError: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthenticationService, private usersService: UsersService) {
    if (this.authService.getCurrentUser())
      this.router.navigate(['/dashboard']);
  }

  ngOnInit() {
    this.loginForm = new FormGroup({ 'username': new FormControl('', [ Validators.required ]), 'password': new FormControl('', [ Validators.required ]) });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  login() {
    this.isLoading = true;
    this.authService.login(this.username.value, this.password.value).pipe(first()).subscribe(
      (data: any) => {
        localStorage.setItem('currentUser', JSON.stringify({ 'username': this.username.value, 'isLogged': true, 'isAdmin': (data.headers.get('isAdmin') === 'true') ? true : false, 'isResp': (data.headers.get('isResp') === 'true') ? true : false }));
        this.usersService.getUsersByUsername(this.username.value).subscribe(
          (resp: User[]) => {
            localStorage.setItem('currentUser', JSON.stringify({ 'username': this.username.value, 'lang': resp[0].lang, 'avatar': resp[0].avatar, 'style': resp[0].style, 'isLogged': true, 'isAdmin': (data.headers.get('isAdmin') === 'true') ? true : false, 'isResp': (data.headers.get('isResp') === 'true') ? true : false }));
            this.isLoading = false;
            this.router.navigate([this.returnUrl]);
          },
          (_error: HttpErrorResponse) => {
            this.loginError = true;
            this.loginForm.reset();
            this.isLoading = false;
          }
        );
      },
      (_error: HttpErrorResponse) => {
        this.loginError = true;
        this.loginForm.reset();
        this.isLoading = false;
      }
    );
  }
}
