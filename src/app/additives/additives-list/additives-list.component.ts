import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private additivesService: AdditivesService, private route: ActivatedRoute, private router: Router, private location: Location, private httpUtils: HttpUtils, private translate: TranslateService) {}

  ngOnInit(): void {
    this.additivesService.getAdditives().subscribe(
      (additives) => {
        additives.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        this.additives = additives;
        this.filteredAdditives = additives;
        this.isLoading = false;
      },
      (error) => {
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
