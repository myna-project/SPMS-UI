import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatDateAdapter, NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { NgxMatMomentModule, NgxMatMomentAdapter } from '@angular-material-components/moment-adapter';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdditiveComponent } from './additives/additive-detail/additive-detail.component';
import { AdditivesComponent } from './additives/additives-list/additives-list.component';
import { CustomerComponent } from './customers/customer-detail/customer-detail.component';
import { CustomersComponent } from './customers/customers-list/customers-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MixtureModeComponent } from './mixturemodes/mixturemode-detail/mixturemode-detail.component';
import { MixtureModesComponent } from './mixturemodes/mixturemodes-list/mixturemodes-list.component';
import { PackagingComponent } from './packagings/packaging-detail/packaging-detail.component';
import { PackagingsComponent } from './packagings/packagings-list/packagings-list.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './users/user-detail/user-detail.component';
import { UsersComponent } from './users/users-list/users-list.component';

import { PendingChangesGuard } from './_guards/pending-changes.guard';

import { ConfirmDialogComponent } from './_utils/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from './_utils/message-dialog/message-dialog.component';

import { CustomHttpInterceptor } from './_utils/http.interceptor';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AdditiveComponent,
    AdditivesComponent,
    ConfirmDialogComponent,
    CustomerComponent,
    CustomersComponent,
    DashboardComponent,
    LoginComponent,
    MessageDialogComponent,
    MixtureModeComponent,
    MixtureModesComponent,
    PackagingComponent,
    PackagingsComponent,
    ProfileComponent,
    UserComponent,
    UsersComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    MessageDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatMomentDateModule,
    NgxMatFileInputModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: NgxMatDateAdapter, useClass: NgxMatMomentAdapter },
    PendingChangesGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
