import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardDataService } from "../services/dashboard-data/dashboard-data.service";
import { Building } from "../models/building";
import { MatDialog } from '@angular/material/dialog';
import { Panel } from "../models/panel";
import { Circuit } from "../models/circuit";
import { Subscription } from 'rxjs';
import {
    ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexTitleSubtitle,
    ApexDataLabels, ApexFill, ApexYAxis, ApexXAxis, ApexTooltip, ApexMarkers,
    ApexAnnotations, ApexStroke, ChartComponent
} from "ng-apexcharts";
import { AuthService } from '../services/auth.service';
import { PanelMeterComponentComponent } from '../live-usage/panel-meter-component/panel-meter-component.component'
import * as e from 'cors';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    dataLabels: ApexDataLabels;
    markers: ApexMarkers;
    title: ApexTitleSubtitle;
    fill: ApexFill;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    annotations: ApexAnnotations;
    colors: any;
    toolbar: any;
};

@Component({
    selector: 'app-live-usage',
    templateUrl: './live-usage.component.html',
    styleUrls: ['./live-usage.component.scss']
})

export class LiveUsageComponent implements OnInit {
    @ViewChild('chart', { static: true }) chart: ChartComponent;
    public chartOptions: Partial<ChartOptions> | any;
    buildings: Building[];
    currentBuilding: Building;
    private currentBuildingSubscription: Subscription;
    private buildingsSubscription: Subscription;
    public fetchLiveAPI: boolean = true


    constructor(
        private dashboardDataService: DashboardDataService,
        private authService: AuthService,
        public dialog: MatDialog
    ) {
        this.chartOptions = {
            series: [19, 21, 43, 11, 6],
            dataLabels: { enabled: false, }, legend: { show: false, }, chart: { type: "donut", width: '320px' },
            plotOptions: { pie: { donut: { labels: { show: true, total: { show: true, label: '', formatter: () => 'Text you want' } } } } },
            colors: ['#3BCDEE', '#EE5937', '#3649A8', '#EE8F37', '#FEC754'],
            labels: ["Pumps/Motors", "HVAC", "Lighting", "Plug Load", "DHW"],
            responsive: [{ breakpoint: 480, options: { chart: { width: 10 }, legend: { position: "bottom" } } }]
        };
        this.buildingsSubscription = this.dashboardDataService.watchBuildings().subscribe(buildings => {
            if (buildings != null) {
                this.buildings = buildings;
                //if (this.currentBuilding == undefined) {
                //    this.currentBuilding = buildings[0];
                //    this.getPanels(buildings[0].idbuildings);
                //}
            }
        });
        this.currentBuildingSubscription = this.dashboardDataService.watchCurrentBuilding().subscribe((building: Building) => {
            if (building != null) {
                this.currentBuilding = building;
                this.getPanels(building.idbuildings);
                this.getCircuitCategory(building.idbuildings)
            }
        });
    }

    panels: Panel[];
    circuitCategoryMain: any[];
    circuitCategoryPane: any[];
    circuits: Circuit[];
    modal: string | null = null;
    stack: any[] = [];
    powerPercetangeObject: any[]


    active = 2;
    public isCostSelected = false;
    public isPanelCollapsed: boolean[] = [];
    public isInventryCollapsed: boolean[] = [];
    public panelsIsConnected = true
    public userCheck = false
    public totalPanelPower = 0
    public showTotal: any = 0
    public fetchsetInterval: boolean = false



    ngOnInit(): void {
        // Show setting Icon for INSTALLER USERS
        if (this.authService.getSession('user_role') == "INSTALLER_USER") {
            this.userCheck = true;
        }
        setInterval(() => {
            if (this.fetchsetInterval) {
                this.totalPanelPower = 0
                this.getUsage()
            }
        }, 9000);
    }
    ngOnDestroy(): void {
        this.fetchLiveAPI = false
    }

    openReportModal(id: any, name: any) {
        (document.getElementById(name) as HTMLAnchorElement).style.pointerEvents = 'none'
        let dialogRef = this.dialog.open(PanelMeterComponentComponent, {
            data: {
                panel_id: id,
                panel_name: name,
                fetch_live_meter: true
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('called')
                this.getPanels('');
                this.getCircuitCategory('')
            }
            (document.getElementById(name) as HTMLAnchorElement).style.pointerEvents = ''
        });
    }
    closePopup(name: any) {
        let modalValue: any = document.getElementById(name)
        modalValue.style.display = 'none'
    }

    getPanels(buildingId: any): void {

        this.dashboardDataService.getPanels(this.currentBuilding.idbuildings)
            .subscribe((panels: any) => {
                this.panels = panels.results
                this.dashboardDataService.getCurrentBuilding();
                this.getCircuits()
            }, (err: any) => {
                localStorage.removeItem('auth_token');
                window.location.reload()
                console.log(err);
            }
            );
    }
    getCircuitCategory(buildingId: any): void {
        this.dashboardDataService.getCircuitCategory(this.currentBuilding.idbuildings)
            .subscribe((circuitCategory: any) => {
                this.circuitCategoryPane = circuitCategory.results
                this.circuitCategoryMain = JSON.parse(JSON.stringify(circuitCategory.results));
                for (let i = 0; i < this.circuitCategoryMain.length; i++) {
                    this.isInventryCollapsed.push(true)
                }
            }, (err: any) => {
                localStorage.removeItem('auth_token');
                window.location.reload()
                console.log(err);
            }
            );
    }

    getCircuits(): void {
        for (let i = 0; i < this.panels.length; i++) {
            this.isPanelCollapsed.push(true)
            this.dashboardDataService.getCircuits(this.panels[i].panel_id)
                .subscribe((circuits: any) => {
                    this.panels[i].panel_circuits = circuits.results
                    if (i == this.panels.length - 1) {
                        this.getUsage()
                    }
                }, (err: any) => {
                    localStorage.removeItem('auth_token');
                    window.location.reload()
                    console.log(err);
                }
                );
        }
    }
    getUsage() {
        if (this.fetchLiveAPI) {
            this.powerPercetangeObject = []
            for (let i = 0; i < this.panels.length; i++) {
                this.dashboardDataService.fetchLiveMeterAPI('ext1', this.panels[i].meter_name).subscribe((result => {
                    if (!(result.Reason)) {
                        for (let k = 0; k < 16; k++) {
                            let currentValue = result[`I${k + 1}`]
                            let keyPair = {
                                'expansion_number': `A-${k + 1}`,
                                'current': currentValue
                            }
                            this.powerPercetangeObject.push(keyPair)
                        }
                        this.panels[i].panelIsconnected = true
                        this.dashboardDataService.fetchLiveMeterAPI('ext2', this.panels[i].meter_name).subscribe((result => {
                            for (let i = 0; i < 16; i++) {
                                let currentValue = result[`I${i + 1}`]
                                let keyPair = {
                                    'expansion_number': `B-${i + 1}`,
                                    'current': currentValue
                                }
                                this.powerPercetangeObject.push(keyPair)
                            }
                            this.dashboardDataService.fetchLiveMeterAPI('ext3', this.panels[i].meter_name).subscribe((result => {
                                for (let i = 0; i < 16; i++) {
                                    let currentValue = result[`I${i + 1}`]
                                    let keyPair = {
                                        'expansion_number': `C-${i + 1}`,
                                        'current': currentValue
                                    }
                                    this.powerPercetangeObject.push(keyPair)
                                }
                                this.dashboardDataService.fetchLiveMeterAPI('ext4', this.panels[i].meter_name).subscribe((result => {
                                    for (let i = 0; i < 16; i++) {
                                        let currentValue = result[`I${i + 1}`]
                                        let keyPair = {
                                            'expansion_number': `D-${i + 1}`,
                                            'current': currentValue
                                        }
                                        this.powerPercetangeObject.push(keyPair)
                                    }
                                    this.dashboardDataService.updateCircuitPower(this.panels[i].panel_id, this.powerPercetangeObject).subscribe((result) => {
                                        var listResult = result.results
                                        var checkNumber: any = []
                                        this.panels[i].panel_power = result.total_power.toFixed(1)
                                        this.totalPanelPower = this.totalPanelPower + parseFloat(result.total_power.toFixed(1))
                                        this.showTotal = this.totalPanelPower
                                        this.fetchsetInterval = true

                                        for (let j = 0; j < listResult.length; j++) {
                                            if (Object.keys(listResult[j]).length > 0) {
                                                if (this.panels[i] != null) {
                                                    this.panels[i].panel_circuits.forEach((data) => {
                                                        if (data.circuit_number == listResult[j].circuit.circuit_number) {
                                                            checkNumber.push(data.circuit_number)
                                                            data['circuit_percentage'] = String(listResult[j].power_percentage.toFixed(1)) + '%'
                                                            data['circuit_power'] = listResult[j].power.toFixed(1)
                                                            data['disconnected'] = true

                                                            if (listResult[j].power_percentage == 0) {
                                                                data['circuit_bar'] = '1%'
                                                                data['circuit_disabled'] = '#d1d1d1'

                                                            } else {
                                                                data['circuit_bar'] = String(listResult[j].power_percentage.toFixed(1)) + '%'
                                                                data['circuit_disabled'] = '1fab3d'
                                                            }
                                                        } else if (!checkNumber.includes(data.circuit_number)) {
                                                            data['circuit_percentage'] = '0%'
                                                            data['circuit_bar'] = '1%'
                                                            data['circuit_power'] = '0'
                                                            data['circuit_disabled'] = '#d1d1d1'
                                                            data['disconnected'] = false
                                                        }
                                                    })
                                                }
                                            }

                                            this.panels.forEach((data) => {
                                                if (data != null) {
                                                    if (data.panel_power) {
                                                        var powerPercentage = ((parseFloat(data['panel_power'])) / this.totalPanelPower) * 100
                                                        if (isNaN(powerPercentage)) {
                                                            data['panelTotalPower'] = '1px'
                                                            data['panelPercentage'] = '0%'
                                                        } else {

                                                            data['panelTotalPower'] = String((((parseFloat(data['panel_power'])) / this.totalPanelPower) * 100).toFixed(1)) + 'px'
                                                            data['panelPercentage'] = String((((parseFloat(data['panel_power'])) / this.totalPanelPower) * 100).toFixed(1)) + '%'
                                                        }
                                                    }
                                                }
                                            })

                                        }

                                    })
                                }))
                            }))
                        }))

                    } else {
                        this.panels[i].panel_circuits.forEach((data) => {
                            data['circuit_percentage'] = '0%'
                            data['circuit_bar'] = '1%'
                            data['circuit_power'] = '0'
                            data['circuit_disabled'] = '#d1d1d1'
                            data['disconnected'] = false
                        })

                    }
                }))

            }
        }

    }

    checkValue(event: any) {
        var targetedValue = event.target.value;

        // When unchecked
        if (!event.target.checked) {
            var index = 0
            this.circuitCategoryMain.forEach(element => {
                if (element.name == targetedValue) {
                    index = this.circuitCategoryMain.indexOf(element)
                }
            });
            if (index !== -1) {
                let obj = this.circuitCategoryMain.splice(index, 1);
                this.stack.push(obj[0])
            }
        }

        // When checked
        if (event.target.checked) {
            var index = 0
            this.stack.forEach(element => {
                if (element.name == targetedValue) {
                    index = this.stack.indexOf(element)
                }
            });
            if (index !== -1) {
                let obj = this.stack.splice(index, 1);
                this.circuitCategoryMain.push(obj[0])
            }
        }
    }

    // toggleDropdown(index: number): void{
    //     this.isCollapsed[index] = !this.isCollapsed[index]
    // }
}
