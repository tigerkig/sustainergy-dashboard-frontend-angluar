import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from "../services/dashboard-data/dashboard-data.service";
import { Building } from '../models/building';
import { Subscription } from "rxjs";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-alert-reports',
  templateUrl: './alert-reports.component.html',
  styleUrls: ['./alert-reports.component.scss']
})
export class AlertReportsComponent implements OnInit {
  currentBuilding: Building;
  private currentBuildingSubscription:Subscription;

  displayStyle = "none";
  isShow = true;
  isShowDivIf = false;
  modal:string|null = null;

  energyReportSelection:string = "month";
  energyReportSelectedMonth:Date = new Date();

  constructor(private dashboardDataService: DashboardDataService) {
    this.selectPreviousMonth();
    this.currentBuildingSubscription = this.dashboardDataService.watchCurrentBuilding().subscribe( (building: Building) => {
      if (building != null) {
        this.currentBuilding = building;
      }
    });
  }

  ngOnInit(): void {
  }

  selectPreviousMonth() {
    let currentDate = this.energyReportSelectedMonth;

    if (currentDate.getUTCFullYear() == 2022 && currentDate.getMonth() == 7)
      return;

    this.energyReportSelectedMonth = new Date(currentDate.getUTCFullYear(), currentDate.getMonth() -1);
  }

  selectNextMonth() {
    let currentDate = this.energyReportSelectedMonth;
    let now = new Date();

    if (currentDate.getMonth() == now.getMonth() -1)
      return;

    this.energyReportSelectedMonth = new Date(currentDate.getUTCFullYear(), currentDate.getMonth() +1);
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  openScheduleModal() {
    this.modal = "schedule";
  }

  openEnergyReportModal() {
    this.modal = "energyReport";
  }

  closePopup() {
    this.modal = null;
  }



  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }


  toggleDisplay2() {
    this.isShow = !this.isShow;
  }

  downloadPanelScheduleReport(){
    this.dashboardDataService.downloadPanelScheduleReport("2cbf7a65");
  }


  downloadEnergyReport(): void {
    this.dashboardDataService.downloadEnergyReport(this.currentBuilding, this.energyReportSelectedMonth)
      .subscribe((data) => {
        saveAs(data, 'report.pdf');
      });
  }
}
