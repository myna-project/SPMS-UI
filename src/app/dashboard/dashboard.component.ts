import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MessageDialogModel, MessageDialogComponent } from '../_utils/message-dialog/message-dialog.component';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
  }
}