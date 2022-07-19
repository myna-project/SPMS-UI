import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Additive } from '../../_models/additive';

import { AdditivesService } from '../../_services/additives.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './additives-list.component.html',
  styleUrls: ['./additives-list.component.scss']
})
export class AdditivesComponent implements OnInit {

  isLoading: boolean = true;
  additives: Additive[];
  filteredAdditives: Additive[];

  constructor(private additivesService: AdditivesService, private router: Router, private httpUtils: HttpUtils) {}

  ngOnInit(): void {
    this.additivesService.getAdditives().subscribe(
      (additives: Additive[]) => {
        additives.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        this.additives = additives;
        this.filteredAdditives = additives;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

  search(term: string): void {
    this.filteredAdditives = this.additives.filter(function(additive) {
      return (additive.name.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    });
  }

  edit(id: number): void {
    this.router.navigate(['additive/' + id]);
  }
}
