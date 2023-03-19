import { Component, OnInit, Inject } from '@angular/core';
import { LiveUsageComponent } from '../live-usage.component'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardDataService } from "../../services/dashboard-data/dashboard-data.service";
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NgToastService } from 'ng-angular-popup';



@Component({
  selector: 'app-panel-meter-component',
  templateUrl: './panel-meter-component.component.html',
  styleUrls: ['./panel-meter-component.component.scss']
})
export class PanelMeterComponentComponent implements OnInit {
  activeId = 1;
  public panel_name = this.data.panel_name
  public fetchLive = this.data.fetch_live_meter
  public meterName: any
  public current_meter_id: any
  public current_dialog_panel_id = this.data.panel_id;
  public panel_expansions: any = []
  public expansion_A: any = []
  public expansion_B: any = []
  public expansion_C: any = []
  public expansion_D: any = []

  public render_dialog: boolean = false;
  public userCheckA: boolean = true;
  public userCheckB: boolean = false;
  public userCheckC: boolean = false;
  public userCheckD: boolean = false;
  public editborderEnabled = 'none';
  public editpointerEnabled = 'none';
  public phaseEnabled = 'none'
  public metereditborderEnabled = 'none';
  public metereditpointerEnabled = 'none';
  public editHandle: boolean = false;
  public saveDisabledOpacity = '100%';
  public saveDisabled = '';
  public editDisabledOpacity = '100%';
  public editDisabled = '';
  public enableCircuitPatchSave: boolean = false
  public patchExpansion: any = [] //array used to save the updated responses of circuit tag
  public currentCircuitTagExpansion: any = []
  public noneEdit: boolean = false // flag to check if user only edit and do nothing and click save
  public fineuserCheckA: boolean = true;
  public fineuserCheckB: boolean = false;
  public fineuserCheckC: boolean = false;
  public fineuserCheckD: boolean = false;
  public wattageFlag: boolean = true;
  public currentFlag: boolean = false
  public voltageSectionList: any = ['0.0V', '0.0V', '0.0V']
  public currentSectionList: any = ['0.0a', '0.0a', '0.0a']
  public wattSectionList: any = ['0.0w', '0.0w', '0.0w']
  public currentSectionTotal: any = '0.0a'
  public wattageSectionTotal: any = '0.0w'
  public dropdownDisabled: any = 'none'
  public selectedValue: any
  public meterNameIsChanged: boolean = false
  public radioPhase: any = [
    { id: 0, value: false },
    { id: 1, value: false },
    { id: 2, value: false },
  ];
  public selectedOption: any





  constructor(
    private toast: NgToastService,
    public dialogRef: MatDialogRef<PanelMeterComponentComponent>,
    private dashboardDataService: DashboardDataService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    var keyValue = {}
    this.dashboardDataService.getPanelExpansion(this.current_dialog_panel_id)
      .subscribe((expansions: any) => {
        this.current_meter_id = expansions.meter_id
        this.panel_expansions = expansions;
        let current_expansions: any = expansions.results
        if (expansions.number_of_phases == '1') {
          this.radioPhase[0].value = true
          this.radioPhase[1].value = false
          this.radioPhase[2].value = false
        } else if (expansions.number_of_phases == '2') {
          this.radioPhase[0].value = false
          this.radioPhase[1].value = true
          this.radioPhase[2].value = false
        } else if (expansions.number_of_phases == '3') {
          this.radioPhase[0].value = false
          this.radioPhase[1].value = false
          this.radioPhase[2].value = true
        }
        if (expansions.meter_name.length > 0) {
          this.meterName = expansions.meter_name
        }
        for (let i = 0; i < current_expansions.length; i++) {
          keyValue = {
            "id": current_expansions[i].id,
            "expansion_type": current_expansions[i].expansion_type,
            "expansion_number": current_expansions[i].expansion_number,
            "circuit_name": '',
            "circuit_number": '',
            "colour": '',
            "amps": '0.0a',
            "voltage_reference": current_expansions[i].voltage_refrence_type != null ? current_expansions[i].voltage_refrence_type : 'V1',
            "watts": '0w'
          }
          if (current_expansions[i].circuit != null) {
            keyValue = {
              "id": current_expansions[i].id,
              "expansion_type": current_expansions[i].expansion_type,
              "expansion_number": current_expansions[i].expansion_number,
              "circuit_name": current_expansions[i].circuit.circuit_name,
              "circuit_number": "#" + current_expansions[i].circuit.circuit_number,
              "colour": '',
              "amps": '0.0a',
              "voltage_reference": current_expansions[i].voltage_refrence_type != null ? current_expansions[i].voltage_refrence_type : 'V1',
              "watts": '0w'

            }
            if (current_expansions[i].circuit.category != null) {
              keyValue = {
                "id": current_expansions[i].id,
                "expansion_type": current_expansions[i].expansion_type,
                "expansion_number": current_expansions[i].expansion_number,
                "circuit_name": current_expansions[i].circuit.circuit_name,
                "circuit_number": "#" + current_expansions[i].circuit.circuit_number,
                "colour": current_expansions[i].circuit.category.colour,
                "amps": '0.0a',
                "voltage_reference": current_expansions[i].voltage_refrence_type != null ? current_expansions[i].voltage_refrence_type : 'V1',
                "watts": '0w'

              }
            }
          }

          if (i < 16) {
            this.expansion_A.push(keyValue)
          } else if (i > 15 && i < 32) {
            this.expansion_B.push(keyValue)
          } else if (i > 31 && i < 48) {
            this.expansion_C.push(keyValue)
          } else if (i > 47 && i < 64) {
            this.expansion_D.push(keyValue)
          }
        }
        this.selectedValue = 'V3'
        this.saveDisabled = 'none'
        this.saveDisabledOpacity = '30%'
        this.render_dialog = true
        this.dashboardDataService.fetchLiveMeterAPI('ext1', this.meterName).subscribe(result => {
          if (result.Reason) {
            this.fetchLive = false
          }
          else if (Object.keys(result).length > 0) {
            for (let i = 0; i < 16; i++) {
              let id = `I${i + 1}`
              this.expansion_A[i].amps = result[id] + 'a'
            }
            this.dashboardDataService.fetchLiveMeterAPI('main', this.meterName).subscribe((result => {
              if (!(result.Reason)) {
                this.voltageSectionList = []
                this.currentSectionList = []
                this.wattSectionList = []
                this.voltageSectionList.push(result['U1'] + 'V')
                this.voltageSectionList.push(result['U2'] + 'V')
                this.voltageSectionList.push(result['U3'] + 'V')
                this.currentSectionList.push(result['I1'] + 'a')
                this.currentSectionList.push(result['I2'] + 'a')
                this.currentSectionList.push(result['I3'] + 'a')
                this.wattSectionList.push((parseFloat(result['U1']) * parseFloat(result['I1'])).toFixed(2) + 'w')
                this.wattSectionList.push((parseFloat(result['U2']) * parseFloat(result['I2'])).toFixed(2) + 'w')
                this.wattSectionList.push((parseFloat(result['U3']) * parseFloat(result['I3'])).toFixed(2) + 'w')
                this.currentSectionTotal = (parseFloat(result['I1']) + parseFloat(result['I2']) + parseFloat(result['I3'])).toFixed(2) + 'a'
                this.wattageSectionTotal = ((parseFloat(result['U1']) * parseFloat(result['I1'])) + (parseFloat(result['U2']) * parseFloat(result['I2'])) + (parseFloat(result['U3']) * parseFloat(result['I3']))) + 'w'

                for (let i = 0; i < this.expansion_A.length; i++) {
                  if (this.expansion_A[i].voltage_reference == 'V1') {
                    this.expansion_A[i].watts = (parseFloat(result['U1']) * parseFloat(this.expansion_A[i].amps)).toFixed(2) + 'w'
                  } else if (this.expansion_A[i].voltage_reference == 'V2') {
                    this.expansion_A.watts = (parseFloat(result['U2']) * parseFloat(this.expansion_A[i].amps)).toFixed(2) + 'w'
                  } else if (this.expansion_A[i].voltage_reference == 'V3') {
                    this.expansion_A.watts = (parseFloat(result['U3']) * parseFloat(this.expansion_A[i].amps)).toFixed(2) + 'w'
                  }
                }
                for (let i = 0; i < this.expansion_B.length; i++) {
                  if (this.expansion_B[i].voltage_reference == 'V1') {
                    this.expansion_B[i].watts = (parseFloat(result['U1']) * parseFloat(this.expansion_B[i].amps)).toFixed(2) + 'w'
                  } else if (this.expansion_B[i].voltage_reference == 'V2') {
                    this.expansion_B.watts = (parseFloat(result['U2']) * parseFloat(this.expansion_B[i].amps)).toFixed(2) + 'w'

                  } else if (this.expansion_B[i].voltage_reference == 'V3') {
                    this.expansion_B.watts = (parseFloat(result['U3']) * parseFloat(this.expansion_B[i].amps)).toFixed(2) + 'w'
                  }
                }
                for (let i = 0; i < this.expansion_C.length; i++) {
                  if (this.expansion_C[i].voltage_reference == 'V1') {
                    this.expansion_C[i].watts = (parseFloat(result['U1']) * parseFloat(this.expansion_C[i].amps)).toFixed(2) + 'w'
                  } else if (this.expansion_C[i].voltage_reference == 'V2') {
                    this.expansion_C.watts = (parseFloat(result['U2']) * parseFloat(this.expansion_C[i].amps)).toFixed(2) + 'w'
                  } else if (this.expansion_C[i].voltage_reference == 'V3') {
                    this.expansion_C.watts = (parseFloat(result['U3']) * parseFloat(this.expansion_C[i].amps)).toFixed(2) + 'w'
                  }
                }
                for (let i = 0; i < this.expansion_D.length; i++) {
                  if (this.expansion_D[i].voltage_reference == 'V1') {
                    this.expansion_D[i].watts = (parseFloat(result['U1']) * parseFloat(this.expansion_D[i].amps)).toFixed(2) + 'w'
                  } else if (this.expansion_D[i].voltage_reference == 'V2') {
                    this.expansion_D.watts = (parseFloat(result['U2']) * parseFloat(this.expansion_D[i].amps)).toFixed(2) + 'w'
                  } else if (this.expansion_D[i].voltage_reference == 'V3') {
                    this.expansion_D.watts = (parseFloat(result['U3']) * parseFloat(this.expansion_D[i].amps)).toFixed(2) + 'w'
                  }
                }
              }
            }))
            this.fetchLive = true
          }
        }, (err: any) => {
          this.fetchLive = false
        }
        )

      }, (err: any) => {
        this.fetchLive = false; //fetch api live when meter is not created
        this.metereditborderEnabled = ''
        this.metereditpointerEnabled = ''
        this.editDisabled = 'none'
        this.editDisabledOpacity = '30%'
        this.render_dialog = true
      }
      )
  }

  ngOnInit(): void {
    setInterval(() => {
      this.liveMeterAPI()
    }, 15000);

  }

  liveMeterAPI() {
    if (this.fetchLive) {
      this.dashboardDataService.fetchLiveMeterAPI('ext1', this.meterName).subscribe((result => {
        for (let i = 0; i < 16; i++) {
          let id = `I${i + 1}`
          this.expansion_A[i].amps = result[id] + 'a'
        }
      }))
      this.dashboardDataService.fetchLiveMeterAPI('ext2', this.meterName).subscribe((result => {
        for (let i = 0; i < 16; i++) {
          let id = `I${i + 1}`
          this.expansion_B[i].amps = result[id] + 'a'
        }
      }))
      this.dashboardDataService.fetchLiveMeterAPI('ext3', this.meterName).subscribe((result => {
        for (let i = 0; i < 16; i++) {
          let id = `I${i + 1}`
          this.expansion_C[i].amps = result[id] + 'a'
        }
      }))
      this.dashboardDataService.fetchLiveMeterAPI('ext4', this.meterName).subscribe((result => {
        for (let i = 0; i < 16; i++) {
          let id = `I${i + 1}`
          this.expansion_D[i].amps = result[id] + 'a'
        }
      }))
      this.dashboardDataService.fetchLiveMeterAPI('main', this.meterName).subscribe((result => {
        if (!(result.Reason)) {
          this.voltageSectionList = []
          this.currentSectionList = []
          this.wattSectionList = []
          this.voltageSectionList.push(result['U1'] + 'V')
          this.voltageSectionList.push(result['U2'] + 'V')
          this.voltageSectionList.push(result['U3'] + 'V')
          this.currentSectionList.push(result['I1'] + 'a')
          this.currentSectionList.push(result['I2'] + 'a')
          this.currentSectionList.push(result['I3'] + 'a')
          this.wattSectionList.push((parseFloat(result['U1']) * parseFloat(result['I1'])).toFixed(2) + 'w')
          this.wattSectionList.push((parseFloat(result['U2']) * parseFloat(result['I2'])).toFixed(2) + 'w')
          this.wattSectionList.push((parseFloat(result['U3']) * parseFloat(result['I3'])).toFixed(2) + 'w')
          this.currentSectionTotal = (parseFloat(result['I1']) + parseFloat(result['I2']).toFixed(2) + parseFloat(result['I3'])) + 'a'
          this.wattageSectionTotal = ((parseFloat(result['U1']) * parseFloat(result['I1'])) + (parseFloat(result['U2']) * parseFloat(result['I2'])) + (parseFloat(result['U3']) * parseFloat(result['I3']))) + 'w'
          for (let i = 0; i < this.expansion_A.length; i++) {
            if (this.expansion_A[i].voltage_reference == 'V1') {
              this.expansion_A[i].watts = (parseFloat(result['U1']) * parseFloat(this.expansion_A[i].amps)).toFixed(2) + 'w'
            } else if (this.expansion_A[i].voltage_reference == 'V2') {
              this.expansion_A.watts = (parseFloat(result['U2']) * parseFloat(this.expansion_A[i].amps)).toFixed(2) + 'w'
            } else if (this.expansion_A[i].voltage_reference == 'V3') {
              this.expansion_A.watts = (parseFloat(result['U3']) * parseFloat(this.expansion_A[i].amps)).toFixed(2) + 'w'
            }
          }
          for (let i = 0; i < this.expansion_B.length; i++) {
            if (this.expansion_B[i].voltage_reference == 'V1') {
              this.expansion_B[i].watts = (parseFloat(result['U1']) * parseFloat(this.expansion_B[i].amps)).toFixed(2) + 'w'
            } else if (this.expansion_B[i].voltage_reference == 'V2') {
              this.expansion_B.watts = (parseFloat(result['U2']) * parseFloat(this.expansion_B[i].amps)).toFixed(2) + 'w'

            } else if (this.expansion_B[i].voltage_reference == 'V3') {
              this.expansion_B.watts = (parseFloat(result['U3']) * parseFloat(this.expansion_B[i].amps)).toFixed(2) + 'w'
            }
          }
          for (let i = 0; i < this.expansion_C.length; i++) {
            if (this.expansion_C[i].voltage_reference == 'V1') {
              this.expansion_C[i].watts = (parseFloat(result['U1']) * parseFloat(this.expansion_C[i].amps)).toFixed(2) + 'w'
            } else if (this.expansion_C[i].voltage_reference == 'V2') {
              this.expansion_C.watts = (parseFloat(result['U2']) * parseFloat(this.expansion_C[i].amps)).toFixed(2) + 'w'
            } else if (this.expansion_C[i].voltage_reference == 'V3') {
              this.expansion_C.watts = (parseFloat(result['U3']) * parseFloat(this.expansion_C[i].amps)).toFixed(2) + 'w'
            }
          }
          for (let i = 0; i < this.expansion_D.length; i++) {
            if (this.expansion_D[i].voltage_reference == 'V1') {
              this.expansion_D[i].watts = (parseFloat(result['U1']) * parseFloat(this.expansion_D[i].amps)).toFixed(2) + 'w'
            } else if (this.expansion_D[i].voltage_reference == 'V2') {
              this.expansion_D.watts = (parseFloat(result['U2']) * parseFloat(this.expansion_D[i].amps)).toFixed(2) + 'w'
            } else if (this.expansion_D[i].voltage_reference == 'V3') {
              this.expansion_D.watts = (parseFloat(result['U3']) * parseFloat(this.expansion_D[i].amps)).toFixed(2) + 'w'
            }
          }

        }
      }))
    }
  }
  editEnabled() {
    this.enableCircuitPatchSave = true
  }

  selectRowChange(event: any, inputId: any, circuitId: any) {
    var circuitvalueInput: any = ((document.getElementById(inputId) as HTMLInputElement).value).replace(/#/g, "");
    if (circuitvalueInput.length > 0) {
      var voltageRef
      if (event == 'V1') {
        voltageRef = this.voltageSectionList[0].replace(/V/g, "")
      } else if (event == 'V2') {
        voltageRef = this.voltageSectionList[1].replace(/V/g, "")
      } else if (event == 'V3') {
        voltageRef = this.voltageSectionList[2].replace(/V/g, "")
      }
      var keyPair = [{
        "expansion_number": inputId,
        "circuit_no": circuitvalueInput,
        "voltage_refrence_type": event,
        "voltage_refrence_value": voltageRef
      }]
      this.dashboardDataService.updateMeterCircuit(circuitId, this.current_dialog_panel_id, keyPair).subscribe(result => {
        this.toast.success({ detail: 'Success', summary: 'Voltage is Updated', sticky: true, position: 'tr' })
        this.updateResponse();
      }, (err: any) => {
        this.toast.error({ detail: 'Error', summary: err.error[0], sticky: true, position: 'tr' })
      })
    }
    else {
      this.toast.error({ detail: 'Error', summary: 'Circuit is not tag on this expansion', sticky: true, position: 'tr' })
    }
  }

  handleSave() {
    if (!this.editHandle) {
      this.noneEdit = false
      this.saveDisabled = 'none'
      this.saveDisabledOpacity = '50%'
      var meterPhase = ''
      var meter_name = (document.getElementById('meter-name') as HTMLInputElement).value;
      var checkmeterPhase: any = document.getElementsByClassName("number-of-phase-radio-single")

      if (checkmeterPhase[0].checked) {
        meterPhase = '1'
      } else if (checkmeterPhase[1].checked) {
        meterPhase = '2'
      } else if (checkmeterPhase[2].checked) {
        meterPhase = '3'
      }
      this.dashboardDataService.createMeter(this.current_dialog_panel_id, meter_name, meterPhase).subscribe((events) => {
        // this.closePopup()
        this.updateResponse()
        this.toast.success({ detail: 'Success', summary: `${meter_name} succesfully created`, sticky: true, position: 'tr' })
        this.dashboardDataService.fetchLiveMeterAPI('ext1', meter_name).subscribe((result => {
          if (result.Reason) {
            this.fetchLive = false //fetch api live when meter is not created
            this.toast.info({ detail: 'Info', summary: `${meter_name} does not have live meter reading`, sticky: true, position: 'tr' })
          } else if (Object.keys(result).length > 0) {
            this.fetchLive = true //fetch api live when meter is not created
          }
        }))
        this.editDisabled = ''
        this.editDisabledOpacity = '100%'
        this.saveDisabled = 'none'
        this.saveDisabledOpacity = '30%'
        this.dropdownDisabled = ''
        this.metereditborderEnabled = 'none'
        this.metereditpointerEnabled = 'none'
      }, (err: any) => {
        this.saveDisabled = ''
        this.saveDisabledOpacity = '100%'
        this.fetchLive = false
        this.toast.error({ detail: 'Error', summary: 'Meter already exist', sticky: true, position: 'tr' })
      }
      )
    } else {
      if ((document.getElementById('meter-name') as HTMLInputElement)) {
        var meter_name = (document.getElementById('meter-name') as HTMLInputElement).value
        if (this.panel_expansions.meter_name != meter_name) {
          this.noneEdit = false
          this.saveDisabled = 'none'
          this.saveDisabledOpacity = '50%'
          var meterphase = ''
          var checkmeterPhase: any = document.getElementsByClassName("number-of-phase-radio-single")
          if (checkmeterPhase[0].checked) {
            meterphase = '1'
          } else if (checkmeterPhase[1].checked) {
            meterphase = '2'
          } else if (checkmeterPhase[2].checked) {
            meterphase = '3'
          }
          this.dashboardDataService.updateMeterName(this.current_dialog_panel_id, meter_name, this.current_meter_id, meterphase).subscribe((update) => {
            this.meterNameIsChanged = true
            this.toast.success({ detail: 'Success', summary: `${meter_name} succesfully Updated`, sticky: true, position: 'tr' })
            this.dashboardDataService.fetchLiveMeterAPI('ext1', meter_name).subscribe((result => {
              if (result.Reason) {
                this.updateResponse()
                this.fetchLive = false //fetch api live when meter is not created
                this.toast.info({ detail: 'Info', summary: `${meter_name} does not have live meter reading`, sticky: true, position: 'tr' })
              } else if (Object.keys(result).length > 0) {
                this.updateResponse()
                this.fetchLive = true //fetch api live when meter is not created
              }
            }))
            this.editDisabled = ''
            this.editDisabledOpacity = '100%'
            this.editHandle = false
            this.editborderEnabled = 'none'
            this.editpointerEnabled = 'none'
            this.metereditborderEnabled = 'none'
            this.metereditpointerEnabled = 'none'
            this.saveDisabled = 'none'
            this.dropdownDisabled = ''
            this.phaseEnabled = 'none'
            this.saveDisabledOpacity = '30%'
          }, (err: any) => {
            this.saveDisabled = ''
            this.saveDisabledOpacity = '100%'
            this.toast.error({ detail: 'Error', summary: 'Meter already exist', sticky: true, position: 'tr' })

          })
        }
      } else if (this.enableCircuitPatchSave) {
        this.noneEdit = false
        var inputCollection: any = (document.getElementsByClassName('circuit-number-txt') as HTMLCollection)
        var updatedcollection: any = []
        if (inputCollection) {
          for (let j = 0; j < inputCollection.length; j++) {
            if (inputCollection[j].value != '') {
              var keyValue = {
                'id': inputCollection[j].id,
                'value': inputCollection[j].classList[0],
                'name': inputCollection[j].name,
                'circuit': inputCollection[j].value
              }
              updatedcollection.push(keyValue)
            }
          }
          for (let i = 0; i < updatedcollection.length; i++) {
            if (this.currentCircuitTagExpansion.some((item: any) => item.id == updatedcollection[i].id)) {
              console.log(`Key-value pair ${updatedcollection[i].id}:${updatedcollection[i].value} is in listA`);
              this.updateCircuit(updatedcollection[i].id, updatedcollection[i].value, updatedcollection[i].name)
            } else {
              console.log(`Key-value pair ${updatedcollection[i].id}:${updatedcollection[i].value} is not in listA`);
              // this.updateCircuit(updatedcollection[i].id, updatedcollection[i].value, updatedcollection[i].name)

            }
          }
        }
        this.editDisabled = ''
        this.editDisabledOpacity = '100%'
        this.editHandle = false
        this.editborderEnabled = 'none'
        this.editpointerEnabled = 'none'
        this.metereditborderEnabled = 'none'
        this.metereditpointerEnabled = 'none'
        this.saveDisabled = 'none'
        this.dropdownDisabled = 'none'
        this.saveDisabledOpacity = '30%'
        this.phaseEnabled = 'none'
      }
      if (this.noneEdit) {
        this.phaseEnabled = 'none'
        this.editDisabled = ''
        this.editDisabledOpacity = '100%'
        this.editHandle = false
        this.editborderEnabled = 'none'
        this.editpointerEnabled = 'none'
        this.metereditborderEnabled = 'none'
        this.metereditpointerEnabled = 'none'
        this.saveDisabled = 'none'
        this.saveDisabledOpacity = '30%'
        this.dropdownDisabled = 'none'
      }

    }
  }

  ampEdit() {
    (document.getElementById('wattageRadio') as HTMLInputElement).checked = false;
    (document.getElementById('current-amperRadio') as HTMLInputElement).checked = true;
    // this.handleEdit();
    this.activeId = 2;
  }

  quickEdit() {
    this.handleEdit();
    this.activeId = 2;
  }

  handleEdit() {
    this.dropdownDisabled = ''
    this.noneEdit = true
    this.phaseEnabled = ''
    this.editDisabled = 'none'
    this.editDisabledOpacity = '30%'
    this.saveDisabled = ''
    this.saveDisabledOpacity = '100%'
    this.editHandle = true
    this.editborderEnabled = ''
    this.editpointerEnabled = ''
    this.metereditborderEnabled = ''
    this.metereditpointerEnabled = ''
  }

  radioEdit(event: any) {
    if (event.target.id == 'numberOfPhase1') {
      (document.getElementById('numberOfPhase1') as HTMLInputElement).checked = true;
      (document.getElementById('numberOfPhase2') as HTMLInputElement).checked = false;
      (document.getElementById('numberOfPhase3') as HTMLInputElement).checked = false;
    } else if (event.target.id == 'numberOfPhase2') {
      (document.getElementById('numberOfPhase1') as HTMLInputElement).checked = false;
      (document.getElementById('numberOfPhase2') as HTMLInputElement).checked = true;
      (document.getElementById('numberOfPhase3') as HTMLInputElement).checked = false;
    } else if (event.target.id == 'numberOfPhase3') {
      (document.getElementById('numberOfPhase1') as HTMLInputElement).checked = false;
      (document.getElementById('numberOfPhase2') as HTMLInputElement).checked = false;
      (document.getElementById('numberOfPhase3') as HTMLInputElement).checked = true;
    }
    var checkmeterPhase: any = document.getElementsByClassName("number-of-phase-radio-single")
    var meterphase = ''
    if (checkmeterPhase[0].checked) {
      meterphase = '1'
    } else if (checkmeterPhase[1].checked) {
      meterphase = '2'
    } else if (checkmeterPhase[2].checked) {
      meterphase = '3'
    }
    var meter_name = (document.getElementById('meter-name') as HTMLInputElement).value

    this.dashboardDataService.updateMeterName(this.current_dialog_panel_id, meter_name, this.current_meter_id, meterphase).subscribe((update) => {
      this.toast.info({ detail: 'Info', summary: `${meter_name} Phase updated`, sticky: true, position: 'tr' })
      this.updateResponse();
    })
  }

  updateCircuit(expressionId: any, circuitid: any, voltage_ref: any) {

    var voltage_current
    (document.getElementById(expressionId) as HTMLInputElement).disabled = true
    var circuitvalueInput: any = ((document.getElementById(expressionId) as HTMLInputElement).value).replace(/#/g, "");
    ((document.getElementById(expressionId) as HTMLInputElement).style.removeProperty('borderColor'))
    if (voltage_ref == 'V1') {
      voltage_current = this.voltageSectionList[0].replace(/V/g, "")
    } else if (voltage_ref == 'V2') {
      voltage_current = this.voltageSectionList[1].replace(/V/g, "")
    } else if (voltage_ref == 'V3') {
      voltage_current = this.voltageSectionList[2].replace(/V/g, "")
    }
    var keyPair = [{
      "expansion_number": expressionId,
      "circuit_no": circuitvalueInput,
      "voltage_refrence_type": voltage_ref,
      "voltage_refrence_value": voltage_current
    }]
    this.dashboardDataService.updateMeterCircuit(circuitid, this.current_dialog_panel_id, keyPair).subscribe(result => {
      this.updateResponse();
      (document.getElementById(expressionId) as HTMLInputElement).disabled = false;
      ((document.getElementById(expressionId) as HTMLInputElement).style.color = '#7F7F7F');

    }, (err: any) => {
      this.toast.error({ detail: 'Error', summary: `${expressionId} - ${circuitvalueInput} is not a valid Circuit`, sticky: true, position: 'tr' });
      ((document.getElementById(expressionId) as HTMLInputElement).style.borderColor = 'red');
      // ((document.getElementById(expressionId) as HTMLInputElement).style.color = '#fd3636');

      (document.getElementById(expressionId) as HTMLInputElement).disabled = false
    })
  }

  closePopup() {
    this.fetchLive = false;
    this.dialogRef.close(this.meterNameIsChanged);
  }

  meterTabName() {
    this.wattageFlag = true;
    this.currentFlag = false;
    this.userCheckB = false;
    this.userCheckA = true;
    this.userCheckC = false;
    this.userCheckD = false;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_A.length; i++) {
      if (this.expansion_A[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_A[i].expansion_number,
          'value': this.expansion_A[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }
  }
  // meterclick(){
  //   this.fineuserCheckA = true;
  //   this.fineuserCheckB = false;
  //   this.fineuserCheckC = false;
  //   this.fineuserCheckD = false;
  // }

  meterTunningTab() {
    this.fineuserCheckA = true;
    this.fineuserCheckB = false;
    this.fineuserCheckC = false;
    this.fineuserCheckD = false;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_A.length; i++) {
      if (this.expansion_A[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_A[i].expansion_number,
          'value': this.expansion_A[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }
  }

  toggleA() {
    this.userCheckB = false;
    this.userCheckA = true;
    this.userCheckC = false;
    this.userCheckD = false;
    (document.getElementById('clickA') as HTMLInputElement).checked = true;
    (document.getElementById('clickB') as HTMLInputElement).checked = false;
    (document.getElementById('clickC') as HTMLInputElement).checked = false;
    (document.getElementById('clickD') as HTMLInputElement).checked = false;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_A.length; i++) {
      if (this.expansion_A[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_A[i].expansion_number,
          'value': this.expansion_A[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }

  }

  toggleB() {
    (document.getElementById('clickA') as HTMLInputElement).checked = false;
    (document.getElementById('clickB') as HTMLInputElement).checked = true;
    (document.getElementById('clickC') as HTMLInputElement).checked = false;
    (document.getElementById('clickD') as HTMLInputElement).checked = false;
    this.userCheckA = false;
    this.userCheckB = true;
    this.userCheckC = false;
    this.userCheckD = false;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_B.length; i++) {
      if (this.expansion_B[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_B[i].expansion_number,
          'value': this.expansion_B[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }
  }

  toggleC() {
    (document.getElementById('clickA') as HTMLInputElement).checked = false;
    (document.getElementById('clickB') as HTMLInputElement).checked = false;
    (document.getElementById('clickC') as HTMLInputElement).checked = true;
    (document.getElementById('clickD') as HTMLInputElement).checked = false;
    this.userCheckA = false;
    this.userCheckB = false;
    this.userCheckC = true;
    this.userCheckD = false;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_C.length; i++) {
      if (this.expansion_C[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_C[i].expansion_number,
          'value': this.expansion_C[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }
  }

  toggleD() {
    (document.getElementById('clickA') as HTMLInputElement).checked = false;
    (document.getElementById('clickB') as HTMLInputElement).checked = false;
    (document.getElementById('clickC') as HTMLInputElement).checked = false;
    (document.getElementById('clickD') as HTMLInputElement).checked = true;
    this.userCheckA = false;
    this.userCheckB = false;
    this.userCheckC = false;
    this.userCheckD = true;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_D.length; i++) {
      if (this.expansion_D[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_D[i].expansion_number,
          'value': this.expansion_D[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }
  }



  finetoggleA() {
    (document.getElementById('fineclickA') as HTMLInputElement).checked = true;
    (document.getElementById('fineclickB') as HTMLInputElement).checked = false;
    (document.getElementById('fineclickC') as HTMLInputElement).checked = false;
    (document.getElementById('fineclickD') as HTMLInputElement).checked = false;
    this.fineuserCheckA = true;
    this.fineuserCheckB = false;
    this.fineuserCheckC = false;
    this.fineuserCheckD = false;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_A.length; i++) {
      if (this.expansion_A[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_A[i].expansion_number,
          'value': this.expansion_A[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }
  }

  finetoggleB() {
    (document.getElementById('fineclickA') as HTMLInputElement).checked = false;
    (document.getElementById('fineclickB') as HTMLInputElement).checked = true;
    (document.getElementById('fineclickC') as HTMLInputElement).checked = false;
    (document.getElementById('fineclickD') as HTMLInputElement).checked = false;
    this.fineuserCheckA = false;
    this.fineuserCheckB = true;
    this.fineuserCheckC = false;
    this.fineuserCheckD = false;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_B.length; i++) {
      if (this.expansion_B[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_B[i].expansion_number,
          'value': this.expansion_B[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }
  }

  finetoggleC() {
    (document.getElementById('fineclickA') as HTMLInputElement).checked = false;
    (document.getElementById('fineclickB') as HTMLInputElement).checked = false;
    (document.getElementById('fineclickC') as HTMLInputElement).checked = true;
    (document.getElementById('fineclickD') as HTMLInputElement).checked = false;
    this.fineuserCheckA = false;
    this.fineuserCheckB = false;
    this.fineuserCheckC = true;
    this.fineuserCheckD = false;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_C.length; i++) {
      if (this.expansion_C[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_C[i].expansion_number,
          'value': this.expansion_C[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }
  }

  finetoggleD() {
    (document.getElementById('fineclickA') as HTMLInputElement).checked = false;
    (document.getElementById('fineclickB') as HTMLInputElement).checked = false;
    (document.getElementById('fineclickC') as HTMLInputElement).checked = false;
    (document.getElementById('fineclickD') as HTMLInputElement).checked = true;
    this.fineuserCheckA = false;
    this.fineuserCheckB = false;
    this.fineuserCheckC = false;
    this.fineuserCheckD = true;
    this.currentCircuitTagExpansion = []
    for (let i = 0; i < this.expansion_D.length; i++) {
      if (this.expansion_D[i].circuit_number != '') {
        var updatedKeys = {
          'id': this.expansion_D[i].expansion_number,
          'value': this.expansion_D[i].circuit_number
        }
        this.currentCircuitTagExpansion.push(updatedKeys)
      }
    }
  }

  handlewattageToggle() {
    (document.getElementById('wattage') as HTMLInputElement).checked = true;
    (document.getElementById('current-amper') as HTMLInputElement).checked = false;
    (document.getElementById('clickA') as HTMLInputElement).checked = true;
    (document.getElementById('clickB') as HTMLInputElement).checked = false;
    (document.getElementById('clickC') as HTMLInputElement).checked = false;
    (document.getElementById('clickD') as HTMLInputElement).checked = false;
    this.wattageFlag = true;
    this.currentFlag = false;
    this.userCheckB = false;
    this.userCheckA = true;
    this.userCheckC = false;
    this.userCheckD = false;
  }
  handlecurrentToggle() {
    (document.getElementById('wattage') as HTMLInputElement).checked = false;
    (document.getElementById('current-amper') as HTMLInputElement).checked = true;
    this.wattageFlag = false;
    this.currentFlag = true;
    this.userCheckB = false;
    this.userCheckA = true;
    this.userCheckC = false;
    this.userCheckD = false;
    (document.getElementById('clickA') as HTMLInputElement).checked = true;
    (document.getElementById('clickB') as HTMLInputElement).checked = false;
    (document.getElementById('clickC') as HTMLInputElement).checked = false;
    (document.getElementById('clickD') as HTMLInputElement).checked = false;
  }

  updateResponse() {
    this.dashboardDataService.getPanelExpansion(this.current_dialog_panel_id)
      .subscribe((expansions: any) => {
        this.current_meter_id = expansions.meter_id
        this.expansion_A = []
        this.expansion_B = []
        this.expansion_C = []
        this.expansion_D = []
        this.panel_expansions = expansions;
        let current_expansions: any = expansions.results
        if (expansions.number_of_phases == '1') {
          this.radioPhase[0].value = true
          this.radioPhase[1].value = false
          this.radioPhase[2].value = false
        } else if (expansions.number_of_phases == '2') {
          this.radioPhase[0].value = false
          this.radioPhase[1].value = true
          this.radioPhase[2].value = false

        } else if (expansions.number_of_phases == '3') {
          this.radioPhase[0].value = false
          this.radioPhase[1].value = false
          this.radioPhase[2].value = true
        }
        if (expansions.meter_name.length > 0) {
          this.meterName = expansions.meter_name
        }
        for (let i = 0; i < current_expansions.length; i++) {
          var keyValue = {}
          keyValue = {
            "id": current_expansions[i].id,
            "expansion_type": current_expansions[i].expansion_type,
            "expansion_number": current_expansions[i].expansion_number,
            "circuit_name": '',
            "circuit_number": '',
            "colour": '',
            'amps': '0.0a',
            "voltage_reference": current_expansions[i].voltage_refrence_type != null ? current_expansions[i].voltage_refrence_type : 'V1',
            "watts": '0w'
          }
          if (current_expansions[i].circuit != null) {
            keyValue = {
              "id": current_expansions[i].id,
              "expansion_type": current_expansions[i].expansion_type,
              "expansion_number": current_expansions[i].expansion_number,
              "circuit_name": current_expansions[i].circuit.circuit_name,
              "circuit_number": "#" + current_expansions[i].circuit.circuit_number,
              "colour": '',
              'amps': '0.0a',
              "voltage_reference": current_expansions[i].voltage_refrence_type != null ? current_expansions[i].voltage_refrence_type : 'V1',
              "watts": '0w'
            }
            if (current_expansions[i].circuit.category != null) {
              keyValue = {
                "id": current_expansions[i].id,
                "expansion_type": current_expansions[i].expansion_type,
                "expansion_number": current_expansions[i].expansion_number,
                "circuit_name": current_expansions[i].circuit.circuit_name,
                "circuit_number": "#" + current_expansions[i].circuit.circuit_number,
                "colour": current_expansions[i].circuit.category.colour,
                'amps': '0.0a',
                "voltage_reference": current_expansions[i].voltage_refrence_type != null ? current_expansions[i].voltage_refrence_type : 'V1',
                "watts": '0w'
              }
            }
          }

          if (i < 16) {
            this.expansion_A.push(keyValue)
          } else if (i > 15 && i < 32) {
            this.expansion_B.push(keyValue)
          } else if (i > 31 && i < 48) {
            this.expansion_C.push(keyValue)
          } else if (i > 47 && i < 64) {
            this.expansion_D.push(keyValue)
          }
        }
      }, (err: any) => {
        console.log('error')
      }
      )
  }
}
