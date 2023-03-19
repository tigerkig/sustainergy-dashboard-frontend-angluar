import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable, of, BehaviorSubject } from "rxjs";
import { Building } from '../../models/building';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private currentBuildingSubscription: Subscription;
  private _currentBuilding: Building;

  constructor(private http: HttpClient) {
    this.currentBuildingSubscription = this.watchCurrentBuilding().subscribe((building: Building) => {
      if (building != null) {
        this._currentBuilding = building;
      }
    });
    this.requestBuildings().subscribe(
      (data: any) => {
        this.buildings.next(data);
        if (!this._currentBuilding)
          //this.setCurrentBuilding(data[0]);
          this.currentBuilding.next(data[0]);
      },
      (err: any) => {
        localStorage.removeItem('auth_token');
        window.location.reload()
        console.log(err);
      }
    );
  }

  ngOnDestroy(): void {
    this.currentBuildingSubscription.unsubscribe();
  }

  baseURL = environment.backendBaseAddress + "/";
  buildingsUrl = 'buildings/';
  panelsUrl = 'panels/';
  circuitsUrl = 'circuits/';
  panelScheduleReport = 'panel_report/building/';
  operatinghourUrl = 'operatingHours/';
  circuitCategoryUrl = 'circuit_categories/';
  buildings = new BehaviorSubject<any>(null);
  currentBuilding = new BehaviorSubject<any>(null);
  panelExpansion = 'panel_expansions/'
  panelMeterCreate = 'panel_meters/'
  fetchLiveMeter = 'https://qm5jcxb08b.execute-api.us-east-1.amazonaws.com/default/TelemetryAPI'

  fetchLiveMeterAPI(expansionID: any, meterName:any): Observable<any> {
    // let deviceId = 'Panel 2D1'
    let deviceId = meterName
    const httpOptions = {
      headers: { 'x-api-key': 'yj82xAcZau7IaOnp1iLH32aVVjrIMhX84TAUv6t3' },
      params: { device_id: deviceId, type: expansionID }
    };
    return this.http.get<any>(this.fetchLiveMeter, httpOptions
    );
  }


  getPanelExpansion(panelId: any): Observable<any> {
    return this.http.get<any>(this.baseURL + this.panelExpansion, {
      params: { panel_id: panelId }
    });
  }

  createMeter(panelId: any, meter_name: any , meterPhase:any): Observable<any> {
    const body = { panel: panelId, name: meter_name , number_of_phases:meterPhase };
    return this.http.post<any>(this.baseURL + this.panelMeterCreate, body);
  }
  updateMeterName(panelId: any, meter_name: any, meterId: any , meterPhase:any): Observable<any> {
    const body = { panel: panelId, name: meter_name , number_of_phases:meterPhase};
    return this.http.patch<any>(this.baseURL + this.panelMeterCreate + meterId + '/', body);
  }


  updateMeterCircuit(expressionId: any, panelId: any, bodyValue: any ): Observable<any> {
    // console.log(expressionId)
   const body = { panel_id: panelId, expansions: bodyValue};
    // const body = { panel_id: panelId, circuit_no: circuitNumber , voltage_refrence_type:voltage_refrence , voltage_refrence_value:voltage_refrence_value};
    return this.http.patch<any>(this.baseURL + this.panelExpansion + panelId +'/' , body);
  }

  updateCircuitPower(panelId: any, expansionList:any): Observable<any> {
    const body = { panel_id: panelId, expansions: expansionList};
    return this.http.patch<any>(this.baseURL + this.panelExpansion + panelId +'/', body);
  }

  getBuildings(): Observable<any> {
    return this.http.get<any>(this.baseURL + this.buildingsUrl);
  }

  watchBuildings(): Observable<any> {
    return this.buildings.asObservable();
  }

  requestBuildings(): any {
    return this.http.get<any>(this.baseURL + this.buildingsUrl).pipe(
      map(response => response.results as Building[] || [])
    );
  }

  watchCurrentBuilding(): Observable<any> {
    return this.currentBuilding.asObservable();
  }


  /* TODO: This code reeks, and is going to be a problem in the future */
  setCurrentBuilding(building: Building): void {
    this.currentBuilding.next(building);
  }

  getCurrentBuilding(): Building | null {
    if (this._currentBuilding)
      return this._currentBuilding;
    else return null;
  }

  getPanels(buildingId: any): Observable<any> {
    return this.http.get<any>(this.baseURL + this.panelsUrl,
      {
        params: { building_id: buildingId }

      });
  }
  getCircuits(panelId: any): Observable<any> {
    return this.http.get<any>(this.baseURL + this.circuitsUrl, {
      params: { panel_id: panelId }

    });
  }
  getCircuitCategory(buildingId: any): Observable<any> {
    return this.http.get<any>(this.baseURL + this.circuitCategoryUrl, { params: { building_id: buildingId } });
  }
  getOperatingHours(buildingId: any): Observable<any> {
    return this.http.get<any>(this.baseURL + this.operatinghourUrl, {
      params: { building_id: buildingId }
    });
  }

  getBuildingSchedule(buildingId: any): Observable<any> {
    return this.http.get<any>(this.baseURL + "building/" + buildingId + "/schedule/")
  }

  addEvents(buildingId: any, params: any): Observable<any> {
    return this.http.post<any>(this.baseURL + this.operatinghourUrl, params, { params: { building_id: buildingId } });
  }

  updateEvents(id: any, buildingId: any, params: any): Observable<any> {
    // const body = { start_time: start_time || '',end_time:end_time || '',event_date:date|| '' };
    return this.http.put<any>(this.baseURL + this.operatinghourUrl + id + "/", params, { params: { building_id: buildingId } });
  }

  removeEvent(id: any, building_id: any): Observable<any> {
    return this.http.delete<any>(this.baseURL + this.operatinghourUrl + id + "/", { params: { building_id: building_id } });
  }

  deleteEvent(id:any,  ischeck:any): Observable<any> {
    return this.http.delete<any>(this.baseURL + this.operatinghourUrl + id+ "/" ,{ params: { is_repeat: ischeck}});
  }



  downloadPanelScheduleReport(buildingId: any) {

    let url = this.baseURL + this.panelScheduleReport + buildingId + "/" + "download/"
    window.open(url, "_blank");
    //return this.http.get(url, { responseType: 'blob' });

  }

  downloadEnergyReport(building: Building, date: Date): Observable<any> {
    let building_id = building.idbuildings;
    let year = date.getUTCFullYear();
    let month = date.getMonth() + 1;
    let url = this.baseURL + this.panelScheduleReport + building_id + "/download/" + "?year=" + year + "&month=" + month;

    return this.http.get(url, { responseType: 'blob' });
  }
}
