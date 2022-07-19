import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Role } from '../../_models/role';
import { User } from '../../_models/user';

import { RolesService } from '../../_services/roles.service';
import { UsersService } from '../../_services/users.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersComponent implements OnInit {

  isLoading: boolean = true;
  users: User[];
  filteredUsers: User[];
  roles: Role[];

  constructor(private usersService: UsersService, private rolesService: RolesService, private router: Router, private httpUtils: HttpUtils) {}

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(
      (users: User[]) => {
        users.sort((a, b) => a.surname < b.surname ? -1 : a.surname > b.surname ? 1 : (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        this.users = users;
        this.filteredUsers = users;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.httpUtils.errorDialog(error);
      }
    );
    this.rolesService.getRoles().subscribe(
      (roles: Role[]) => {
        this.roles = roles;
      },
      (error: HttpErrorResponse) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

  search(term: string): void {
    this.filteredUsers = this.users.filter(function(user) {
      return (user.name.toLowerCase().indexOf(term.toLowerCase()) >= 0) || (user.surname.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    });
  }

  edit(id: number): void {
    this.router.navigate(['user/' + id]);
  }
}
