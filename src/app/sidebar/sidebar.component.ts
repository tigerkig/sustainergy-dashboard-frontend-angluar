import { Component, OnInit, OnDestroy } from '@angular/core';
import { Building } from "../models/building";
import { DashboardDataService } from "../services/dashboard-data/dashboard-data.service";
import { AuthService } from "../services/auth.service";
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentBuilding: Building;
  buildings: Building[];
  private buildingsSubscription:Subscription;
  private currentBuildingSubscription:Subscription;

  constructor(
    private dashboardDataService: DashboardDataService,
    private authService: AuthService,
    private router: Router) {
    this.buildingsSubscription = this.dashboardDataService.watchBuildings().subscribe(buildings => {
      if (buildings != null) {
        this.buildings = buildings;
        // console.log("buildings")
      }
    });
    this.currentBuildingSubscription = this.dashboardDataService.watchCurrentBuilding().subscribe((building: Building )=> {
      if (building != null) {
        this.currentBuilding = building;
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.buildingsSubscription.unsubscribe();
    this.currentBuildingSubscription.unsubscribe();
  }

  public logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

}
