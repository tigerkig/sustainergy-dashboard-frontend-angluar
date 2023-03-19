import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardDataService } from '../services/dashboard-data/dashboard-data.service';
import {BillService} from "../services/bill-data/bill.service";
import { Subscription } from 'rxjs';
import { Building } from '../models/building';
import { Router } from '@angular/router';

@Component({
  selector: 'app-switch-facilities',
  templateUrl: './switch-facilities.component.html',
  styleUrls: ['./switch-facilities.component.scss']
})
export class SwitchFacilitiesComponent implements OnInit, OnDestroy {
  buildings: Building[];
  private buildingsSubscription:Subscription;

  constructor(
    private dashboardDataService: DashboardDataService,
    private billdataService: BillService,
    private router:Router) {
    this.buildingsSubscription = this.dashboardDataService.watchBuildings().subscribe(buildings => {
      if (buildings != null) {
        this.buildings = buildings;
      }
    });
  }
  onClick(building:Building):void {
    this.dashboardDataService.setCurrentBuilding(building);
    this.billdataService.setCurrentBuilding(building);
    this.router.navigate(['/']);
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.buildingsSubscription.unsubscribe();
  }
}

