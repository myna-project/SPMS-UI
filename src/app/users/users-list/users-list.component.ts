import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  roles : Role[];

  constructor(private usersService: UsersService, private rolesService: RolesService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(
      (users) => {
        users.sort((a, b) => a.surname < b.surname ? -1 : a.surname > b.surname ? 1 : (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        this.users = users;
        this.filteredUsers = users;
        this.isLoading = false;
      },
      (error) => {
        this.httpUtils.errorDialog(error);
      }
    );
    this.rolesService.getRoles().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => {
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
