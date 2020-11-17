import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AppComponent } from '../app.component';

import { ComponentCanDeactivate } from '../_guards/pending-changes.guard';

import { User } from '../_models/user';

import { AuthenticationService } from '../_services/authentication.service';
import { UsersService } from '../_services/users.service';

import { HttpUtils } from '../_utils/http.utils';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements ComponentCanDeactivate, OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.profileForm.touched;
  }

  isLoading: boolean = true;
  isSaving: boolean = false;
  user: User = new User();
  user_avatar;
  user_avatar_show;
  profileForm: FormGroup;
  changePassword: boolean = false;

  constructor(public myapp: AppComponent, private authService: AuthenticationService, private usersService: UsersService, private route: ActivatedRoute, private router: Router, private location: Location, private sanitizer: DomSanitizer, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.createForm();
    let currentUser = this.authService.getCurrentUser();
    if (currentUser !== null) {
      this.usersService.getUsersByUsername(currentUser.username).subscribe(
        (response) => {
          let users: User[] = response;
          this.user = users[0];
          if (this.user.avatar)
            this.user_avatar_show = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.user.avatar);
          this.createForm();
          this.isLoading = false;
        },
        (error) => {
          const dialogRef = this.httpUtils.errorDialog(error);
          dialogRef.afterClosed().subscribe(value => {
            this.goBack();
          });
        }
      );
    }
  }

  get name() { return this.profileForm.get('name'); }
  get surname() { return this.profileForm.get('surname'); }
  get lang() { return this.profileForm.get('lang'); }
  get oldPassword() { return this.profileForm.get('oldPassword'); }
  get password() { return this.profileForm.get('password'); }
  get confirmPassword() { return this.profileForm.get('confirmPassword'); }

  createForm() {
    this.profileForm = new FormGroup({
      'name': new FormControl({ value: this.user.name, disabled: true }, []),
      'surname': new FormControl({ value: this.user.surname, disabled: true }, []),
      'lang': new FormControl(this.user.lang, [])
    });
    if (this.changePassword) {
      this.profileForm.addControl('oldPassword', new FormControl('', [ Validators.required ]));
      this.profileForm.addControl('password', new FormControl('', [ Validators.required ]));
      this.profileForm.addControl('confirmPassword', new FormControl('', [ Validators.required ]));
      this.profileForm.setValidators([ this.passwordChangedValidator, this.passwordMatchValidator ]);
    }
  }

  onPasswordInput() {
    if (this.password.value !== '') {
      if (this.profileForm.hasError('passwordNotChanged'))
        this.password.setErrors([{ 'passwordNotChanged': true }]);
      else
        this.password.setErrors(null);
    }

    if (this.profileForm.hasError('passwordMismatch'))
      this.confirmPassword.setErrors([{ 'passwordMismatch': true }]);
    else
      this.confirmPassword.setErrors(null);
  }

  passwordChangedValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['oldPassword'].value ? { 'passwordNotChanged': true } : null;
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : { 'passwordMismatch': true };
  }

  onSelectImage(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event) => {
        this.user_avatar_show = event.target.result;
      }

      reader.onloadend = (e) => {
        this.user_avatar = reader.result;
        this.user_avatar = this.user_avatar.substring(this.user_avatar.lastIndexOf(",") + 1);
        this.myapp.changeAvatar(this.user_avatar);
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  changeStyle(newStyle) {
    this.user.style = newStyle;
    this.myapp.changeStyle(newStyle);
  }

  save(): void {
    this.isSaving = true;
    let newUser: User = this.profileForm.value;
    if (this.user.id !== undefined) {
      newUser.id = this.user.id;
      newUser.name = this.user.name;
      newUser.surname = this.user.surname;
      newUser.username = this.user.username;
      newUser.email = this.user.email;
      newUser.enabled = this.user.enabled;
      newUser.roles = this.user.roles;
      newUser.avatar = this.user_avatar;
      newUser.style = this.user.style;
      this.usersService.updateUser(newUser).subscribe(
        (response) => {
          this.user = response;
          this.isSaving = false;
          this.myapp.changeLanguage(newUser.lang);
          this.profileForm.markAsUntouched();
          this.httpUtils.successSnackbar(this.translate.instant('PROFILE.SAVED'));
        },
        (error) => {
          this.isSaving = false;
          this.httpUtils.errorDialog(error);
        }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }
}
