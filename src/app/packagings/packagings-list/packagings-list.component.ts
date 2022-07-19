import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Packaging } from '../../_models/packaging';

import { PackagingsService } from '../../_services/packagings.service';

import { HttpUtils } from '../../_utils/http.utils';

@Component({
  templateUrl: './packagings-list.component.html',
  styleUrls: ['./packagings-list.component.scss']
})
export class PackagingsComponent implements OnInit {

  isLoading: boolean = true;
  packagings: Packaging[];
  filteredPackagings: Packaging[];

  constructor(private packagingsService: PackagingsService, private router: Router, private httpUtils: HttpUtils) {}

  ngOnInit(): void {
    this.packagingsService.getPackagings().subscribe(
      (packagings: Packaging[]) => {
        packagings.sort((a, b) => a.packaging_mode < b.packaging_mode ? -1 : a.packaging_mode > b.packaging_mode ? 1 : 0);
        this.packagings = packagings;
        this.filteredPackagings = packagings;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.httpUtils.errorDialog(error);
      }
    );
  }

  search(term: string): void {
    this.filteredPackagings = this.packagings.filter(function(packaging) {
      return (packaging.packaging_mode.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    });
  }

  edit(id: number): void {
    this.router.navigate(['packaging/' + id]);
  }
}
