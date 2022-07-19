import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MixtureMode } from '../../_models/mixturemode';

import { MixtureModesService } from '../../_services/mixturemodes.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './mixturemodes-list.component.html',
  styleUrls: ['./mixturemodes-list.component.scss']
})
export class MixtureModesComponent implements OnInit {

  isLoading: boolean = true;
  mixtureModes: MixtureMode[];
  filteredMixtureModes: MixtureMode[];

  constructor(private mixtureModesService: MixtureModesService, private router: Router, private httpUtils: HttpUtils) {}

  ngOnInit(): void {
    this.mixtureModesService.getMixtureModes().subscribe(
      (mixtureModes: MixtureMode[]) => {
        mixtureModes.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        this.mixtureModes = mixtureModes;
        this.filteredMixtureModes = mixtureModes;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

  search(term: string): void {
    this.filteredMixtureModes = this.mixtureModes.filter(function(mixtureMode) {
      return (mixtureMode.name.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    });
  }

  edit(id: number): void {
    this.router.navigate(['mixturemode/' + id]);
  }
}
