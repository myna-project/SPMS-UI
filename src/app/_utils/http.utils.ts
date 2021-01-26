import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';

import { User } from '../_models/user';

import { ConfirmDialogModel, ConfirmDialogComponent } from '../_utils/confirm-dialog/confirm-dialog.component';
import { MessageDialogModel, MessageDialogComponent } from '../_utils/message-dialog/message-dialog.component';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpUtils {

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private translate: TranslateService) {
  }

  public getAPIEndpoint() {
    return (environment.sameDomain ? window.location.protocol + '//' + window.location.host + '/' : environment.URL) + environment.contextPath;
  }

  public getAdminUrl() {
    let currentUser = <User>JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser === null || currentUser === undefined) {
      return '';
    } else {
        if(currentUser.isAdmin)
          return "admin/";
        else if(currentUser.isResp)
          return "resp/";
        else
          return "";
    }
  }

  public generateUriFilter(filter: Object) {
    let filters = '';
    if (filter !== null) {
      for (let key in filter) {
        if (filter.hasOwnProperty(key)) {
          if (filter[key] !== null && filter[key] !== undefined) {
            if (filters.length > 0) {
              filters += '&';
            } else {
              filters += '?';
            }
            filters += key.toString() + '=' + encodeURIComponent(filter[key]);
          }
        }
      }
    }
    return filters;
  }

  public successSnackbar(message: string) {
    this.snackBar.open(message, null, { duration: 2000, panelClass: 'notify-success' });
  }

  public confirmDelete(message: string): MatDialogRef<ConfirmDialogComponent, any> {
    const dialogData = new ConfirmDialogModel(message, this.translate.instant('DIALOG.CONFIRM'), this.translate.instant('DIALOG.CANCEL'));
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { maxWidth: '400px', data: dialogData });
    return dialogRef;
  }

  public errorDialog(error: HttpErrorResponse): MatDialogRef<MessageDialogComponent, any> {
    let status = error.status;
    let messageKey = 'DIALOG.GENERICERROR';
    if ((error.status >= 400) && (error.status < 500) && (error.error !== undefined)) {
      if (error.error.errorCode !== undefined) {
        status = error.error.errorCode;
        messageKey = 'ERROR.' + status;
      }
    }
    const dialogData = new MessageDialogModel('error', this.translate.instant('DIALOG.ERROR') + ' ' + status, this.translate.instant(messageKey), 'OK');
    const dialogRef = this.dialog.open(MessageDialogComponent, { maxWidth: '400px', data: dialogData });
    return dialogRef;
  }

  public getPatterns(): any {
    return {
      positiveInteger: '^\\d*$',
      negativeInteger: '^-\\d*$',
      positiveNegativeInteger: '^-?\\d*$',
      positiveFloat: '^\\d*(\\,\\d{1,})?$',
      negativeFloat: '^-\\d*(\\,\\d{1,})?$',
      positiveNegativeFloat: '^-?\\d*(\\,\\d{1,})?$',
      positiveTwoDecimal: '^\\d*(\\,\\d{1,2})?$',
      negativeTwoDecimal: '^-\\d*(\\,\\d{1,2})?$',
      positiveNegativeTwoDecimal: '^-?\\d*(\\,\\d{1,2})?$',
      positivePerc: '^\\d{1,3}(\\,\\d{1,2})?$',
      negativePerc: '^-\\d{1,3}(\\,|\\d{1,2})?$',
      positiveNegativePerc: '^-?\\d{1,3}(\\,\\d{1,2})?$'
    }
  }

  public getLanguage() {
    let currentUser = <User>JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser !== null && currentUser !== undefined)
      return currentUser.lang;
  }

  public convertFromNumber(input: number): string {
    return ((input !== undefined) && (input !== null)) ? input.toString().replace(".",",") : undefined;
  }

  public convertToNumber(input: string): number {
    return ((input !== undefined) && (input !== null)) ? parseFloat(input.replace(",",".")) : undefined;
  }

  public getDateForForm(date: Date): string {
    let month: number = date.getMonth() + 1;
    let day: number = date.getDate();
    return date.getFullYear() + '-' + ((month < 10) ? '0' : '') + month + '-' + ((day < 10) ? '0' : '') + day;
  }

  public getDateTimeForUrl(date: Date): string {
    let month: number = date.getMonth() + 1;
    let day: number = date.getDate();
    let hour: number = date.getHours();
    let minute: number = date.getMinutes();
    let offset: number = date.getTimezoneOffset() * -1;
    let offset_hour: number = Math.floor(offset/60);
    let offset_minute: number = (offset % 60) * 60;
    let offsetString: string = ((offset_hour <= 0) ? '-' : '%2B');
    if (offset_hour <= 0)
      offset_hour = offset_hour * -1;
    offsetString = offsetString + ((offset_hour < 10) ? '0' : '') + offset_hour + ((offset_minute < 10) ? '0' : '') + offset_minute;
    return date.getFullYear() + '-' + ((month < 10) ? '0' : '') + month + '-' + ((day < 10) ? '0' : '') + day + 'T' + ((hour < 10) ? '0' : '') + hour + ':' + ((minute < 10) ? '0' : '') + minute + ':00' + offsetString;
  }

  public getLocaleDateString(date: string | Date): string {
    return (new Date(date)).toLocaleDateString(this.getLanguage(), { year: "numeric", month: "2-digit", day: "2-digit" });
  }

  public getLocaleDateTimeString(date: string | Date): string {
    return (new Date(date)).toLocaleDateString(this.getLanguage(), { year: "numeric", month: "2-digit", day: "2-digit", weekday: 'long' }) + ' ' + (new Date(date)).toLocaleTimeString(this.getLanguage(), { hour: '2-digit', minute: '2-digit' });
  }
}
