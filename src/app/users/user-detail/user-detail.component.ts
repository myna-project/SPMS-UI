import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../../_guards/pending-changes.guard';

import { Role } from '../../_models/role';
import { User } from '../../_models/user';

import { RolesService } from '../../_services/roles.service';
import { UsersService } from '../../_services/users.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.userForm.touched;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  allRoles: Role[];
  user: User = new User();
  userForm: FormGroup;
  backRoute: string = 'users';

  constructor(private usersService: UsersService, private rolesService: RolesService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe((params: any) => {
      var userId = params.get('id');
      if (userId) {
        this.usersService.getUser(userId).subscribe(
          (response: User) => {
            this.user = response;
            this.createForm();
            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            const dialogRef = this.httpUtils.errorDialog(error);
            dialogRef.afterClosed().subscribe((_value: any) => {
              this.router.navigate([this.backRoute]);
            });
          }
        );
      } else {
        this.isLoading = false;
      }
    });
    this.rolesService.getRoles().subscribe(
      (resp: Role[]) => {
        this.allRoles = resp;
      },
      (error: HttpErrorResponse) => {
        const dialogRef = this.httpUtils.errorDialog(error);
        dialogRef.afterClosed().subscribe((_value: any) => {
          this.router.navigate([this.backRoute]);
        });
      }
    );
  }

  get username() { return this.userForm.get('username'); }
  get name() { return this.userForm.get('name'); }
  get surname() { return this.userForm.get('surname'); }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  get enabled() { return this.userForm.get('enabled'); }
  get roles() { return this.userForm.get('roles'); }

  createForm() {
    this.userForm = new FormGroup({
      'username': new FormControl(this.user.username, [ Validators.required, Validators.minLength(4) ]),
      'name': new FormControl(this.user.name, [ Validators.required ]),
      'surname': new FormControl(this.user.surname, [ Validators.required ]),
      'email': new FormControl(this.user.email, [ Validators.required, Validators.email ]),
      'password': new FormControl({ value: (this.user.id) ? 'fakepwd' : '', disabled: (this.user && this.user.id) ? true : false }, [ Validators.required ]),
      'enabled': new FormControl(this.user.enabled, []),
      'roles': new FormControl(this.user.roles, [ Validators.required ]),
    });
  }

  save(): void {
    this.isSaving = true;
    let newUser: User = this.userForm.value;
    if (this.user.id !== undefined) {
      newUser.id = this.user.id;
      this.usersService.updateUser(newUser).subscribe(
        (response: User) => {
          this.user = response;
          this.isSaving = false;
          this.userForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('USER.SAVED'));
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    } else {
      this.usersService.createUser(newUser).subscribe(
        (response: User) => {
          this.user = response;
          this.isSaving = false;
          this.httpUtils.successSnackbar(this.translate.instant('USER.SAVED'));
          this.userForm.markAsUntouched();
          this.router.navigate(['user/' + this.user.id]);
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  delete(): void {
    const dialogRef = this.httpUtils.confirmDelete(this.translate.instant('USER.DELETECONFIRM'));
    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
        this.isDeleting = true;
        this.usersService.deleteUser(this.user).subscribe(
          (_response: User) => {
            this.isDeleting = false;
            this.httpUtils.successSnackbar(this.translate.instant('USER.DELETED'));
            this.userForm.markAsUntouched();
            this.router.navigate([this.backRoute]);
          },
          (error: HttpErrorResponse) => {
            this.isDeleting = false;
            this.httpUtils.errorDialog(error);
          }
        );
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
