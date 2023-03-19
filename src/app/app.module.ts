import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { BrowserModule ,HammerModule} from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LiveUsageComponent } from './live-usage/live-usage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InventoryDataStreamComponent } from './inventory-data-stream/inventory-data-stream.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AboutFacilityComponent } from './about-facility/about-facility.component';
import { OperatingHoursComponent } from './operating-hours/operating-hours.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { FullCalendarModule } from '@fullcalendar/angular';
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid';
import { IgxTimePickerModule, IgxInputGroupModule, IgxIconModule } from "igniteui-angular";
import {DatePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import interactionPlugin from '@fullcalendar/interaction';
import {AlertReportsComponent} from "./alert-reports/alert-reports.component";
import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth.guard';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ResetPasswordSentComponent } from './auth/reset-password-sent/reset-password-sent.component';
import { ResetPasswordConfirmComponent } from './auth/reset-password-confirm/reset-password-confirm.component';
import { ResetPasswordSuccessComponent } from './auth/reset-password-success/reset-password-success.component';
import { SwitchFacilitiesComponent } from './switch-facilities/switch-facilities.component';
import { DashboardDataService } from './services/dashboard-data/dashboard-data.service';
import { UtilitiesComponent } from './utilities/utilities.component';
import { ElectricityComponent } from './utilities/electricity/electricity.component';
import { NaturalGasComponent } from './utilities/natural-gas/natural-gas.component';
import { ElectricityBillComponent } from './utilities/electricity/electricity-bill/electricity-bill.component';
import { NaturalGasBillComponent } from './utilities/natural-gas/natural-gas-bill/natural-gas-bill.component';
import { PanelMeterComponentComponent } from './live-usage/panel-meter-component/panel-meter-component.component';
import {
  MatDialogModule
} from '@angular/material/dialog';
import {NgToastModule} from 'ng-angular-popup'


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  rrulePlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AppComponent,
    LiveUsageComponent,
    InventoryDataStreamComponent,
    SidebarComponent,
    AboutFacilityComponent,
    OperatingHoursComponent,
    AlertReportsComponent,
    LoginComponent,
    ResetPasswordComponent,
    ResetPasswordSentComponent,
    ResetPasswordConfirmComponent,
    ResetPasswordSuccessComponent,
    SwitchFacilitiesComponent,
    UtilitiesComponent,
    ElectricityComponent,
    NaturalGasComponent,
    ElectricityBillComponent,
    NaturalGasBillComponent,
    PanelMeterComponentComponent
  ],
  imports: [
    NgToastModule,
    BrowserModule,
    FullCalendarModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HammerModule,
    HttpClientModule,
    MatDialogModule,
    RouterModule.forRoot([
      {path: 'home', component: LiveUsageComponent, canActivate:[AuthGuard]},
      {path: 'utilities', component: UtilitiesComponent, canActivate:[AuthGuard]},
      {path: 'utilities/electricity', component: ElectricityComponent, canActivate:[AuthGuard]},
      {path: 'utilities/electricity/bill', component: ElectricityBillComponent, canActivate:[AuthGuard]},
      {path: 'utilities/naturalgas', component: NaturalGasComponent, canActivate:[AuthGuard]},
      {path: 'utilities/naturalgas/bill', component: NaturalGasBillComponent, canActivate:[AuthGuard]},
      {path: 'inventory', component: InventoryDataStreamComponent, canActivate:[AuthGuard]},
      {path: 'alertreports', component: AlertReportsComponent, canActivate:[AuthGuard]},
      {path: 'about', component: AboutFacilityComponent, canActivate:[AuthGuard]},
      {path: 'operatinghours', component: OperatingHoursComponent, canActivate:[AuthGuard]},
      {path: 'login', component: LoginComponent},
      {path: 'password_reset', component: ResetPasswordComponent},
      {path: 'password_reset/sent', component: ResetPasswordSentComponent},
      {path: 'password_reset/confirm', component: ResetPasswordConfirmComponent},
      {path: 'password_reset/success', component: ResetPasswordSuccessComponent},
      {path: 'switchfacilities', component: SwitchFacilitiesComponent},
      {path: '', pathMatch: 'full', redirectTo: 'home'},
    ]),
    NgApexchartsModule,
    IgxTimePickerModule,
    IgxInputGroupModule,
    IgxIconModule,
    FormsModule
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DashboardDataService
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class AppModule { }
