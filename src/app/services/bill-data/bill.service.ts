import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Building } from '../../models/building';
import { map, Observable, of, BehaviorSubject } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private currentBuildingSubscription:Subscription;
  private _currentBuilding:Building;

  constructor(private http: HttpClient) {
    this.currentBuildingSubscription = this.watchCurrentBuilding().subscribe((building:Building) => {
      if (building != null) {
        this._currentBuilding = building;
      }
    });
    this.requestBuildings().subscribe(
      (data: any) => {
        this.buildings.next(data);
        if (!this._currentBuilding){
          //this.setCurrentBuilding(data[0]);
          this.currentBuilding.next(data[0]);
        }
      },
      (err: any ) => {
        localStorage.removeItem('auth_token');
        window.location.reload()
        console.log(err); }
    );
  }

  currentBuilding = new BehaviorSubject<any>(null);
  buildingsUrl = 'buildings/';
  utilityUrl ='utilities/';
  baseURL = environment.backendBaseAddress + "/";
  buildings = new BehaviorSubject<any>(null);



  watchCurrentBuilding():Observable<any> {
    return this.currentBuilding.asObservable();
  }

  requestBuildings():any {
    return this.http.get<any>(this.baseURL + this.buildingsUrl).pipe(
      map(response => response.results as Building[] || [])
    );
  }

  setCurrentBuilding(building:Building):void {
    this.currentBuilding.next(building);
  }

  getYearlybill(buildingId: any, utilityType:any , yearCurrent:any) : Observable<any>{
    return this.http.get<any>(this.baseURL + this.utilityUrl,
       {params: { utility: utilityType, year: yearCurrent,
                  building_id: buildingId }
      } );
  }

  getMonltyBuidlingbill(buildingId: any, utilityType:any , yearCurrent:any , monthCurrent:any) : Observable<any>{
    return this.http.get<any>(this.baseURL + this.utilityUrl,
       {params: { utility: utilityType, year: yearCurrent,
                  building_id: buildingId, month:monthCurrent }
      } );
  }
}
