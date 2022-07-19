import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RawMaterial } from '../../_models/rawmaterial';

import { RawMaterialsService } from '../../_services/rawmaterials.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './rawmaterials-list.component.html',
  styleUrls: ['./rawmaterials-list.component.scss']
})
export class RawMaterialsComponent implements OnInit {

  isLoading: boolean = true;
  rawMaterials: RawMaterial[];
  filteredRawMaterials: RawMaterial[];

  constructor(private rawMaterialsService: RawMaterialsService, private router: Router, private httpUtils: HttpUtils) {}

  ngOnInit(): void {
    this.rawMaterialsService.getRawMaterials().subscribe(
      (rawMaterials: RawMaterial[]) => {
        rawMaterials.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        this.rawMaterials = rawMaterials;
        this.filteredRawMaterials = rawMaterials;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

  search(term: string): void {
    this.filteredRawMaterials = this.rawMaterials.filter(function(rawMaterial) {
      return (rawMaterial.name.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    });
  }

  edit(id: number): void {
    this.router.navigate(['rawmaterial/' + id]);
  }
}
