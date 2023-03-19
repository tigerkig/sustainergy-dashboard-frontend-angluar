import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from "../services/dashboard-data/dashboard-data.service"
import { Building } from "../models/building";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-facility',
  templateUrl: './about-facility.component.html',
  styleUrls: ['./about-facility.component.scss']
})
export class AboutFacilityComponent implements OnInit {
  currentBuilding: Building;
  private currentBuildingSubscription:Subscription;

  constructor(
    private dashboardDataService: DashboardDataService
  ) {
    this.currentBuildingSubscription = this.dashboardDataService.watchCurrentBuilding().subscribe((building: Building )=> {
      if (building != null) {
        this.currentBuilding = building;
      }
    });

  }

  ngOnInit(): void {
  }

}
