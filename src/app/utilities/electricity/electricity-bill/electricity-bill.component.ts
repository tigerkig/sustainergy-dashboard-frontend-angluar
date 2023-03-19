import { Component, OnInit } from '@angular/core';
import { BillService } from "../../../services/bill-data/bill.service";
import { Building } from "../../../models/building";

@Component({
  selector: 'app-electricity-bill',
  templateUrl: './electricity-bill.component.html',
  styleUrls: ['./electricity-bill.component.scss']
})
export class ElectricityBillComponent implements OnInit {
  buildings: Building[];
  currentBuilding: Building;
  currentBill: any;
  currentMonthBill: any;
  currentmonthBillDecimal: any;
  currentmonthBillusageDecimal: any;
  currentBillDecimal: any;
  currentBillusageDecimal: any;
  year_meter_value: any;
  render_flag = false
  render_flag_month = false

  carbon_consumption_data: any
  carbon_consumption_monthly_data: any


  price_breakdown_ft: any
  price_breakdown_ft_decimal: any
  price_breakdown_meter: any
  price_breakdown_meter_decimal: any
  breakdown_ft: any
  breakdown_ft_decimal: any
  breakdown_meter: any
  breakdown_meter_decimal: any

  set_fetch_month_year: any = '2023'
  set_current_month: any = '1'

  year_price_breakdown_ft: any
  year_price_breakdown_ft_decimal: any
  year_price_breakdown_meter: any
  year_price_breakdown_meter_decimal: any
  year_breakdown_ft: any
  year_breakdown_ft_decimal: any
  year_breakdown_meter: any
  year_breakdown_meter_decimal: any

  year_single_months: any = {
    'January': '0%',
    'February': '0%',
    'March': '0%',
    'April': '0%',
    'May': '0%',
    'June': '0%',
    'July': '0%',
    'August': '0%',
    'September': '0%',
    'October': '0%',
    'November': '0%',
    'December': '0%'
  }
  month_single_graph: any = {
    'January': '0%',
    'February': '0%',
    'March': '0%',
    'April': '0%',
    'May': '0%',
    'June': '0%',
    'July': '0%',
    'August': '0%',
    'September': '0%',
    'October': '0%',
    'November': '0%',
    'December': '0%'
  }

  constructor(private billdataService: BillService) {
    this.billdataService.watchCurrentBuilding().subscribe((building: Building) => {
      if (building != null) {
        this.currentBuilding = building;
        this.getYearlyBuildingBill('electricity', '2023')
        this.getsingleMonthBuildingBill('electricity', '2023', this.set_current_month)

      }
    });
  }

  ngOnInit(): void {
  }

  increaseSliderValue() {
    var yearValue: any = document.getElementById('currentYear')
    var currYear = parseInt(yearValue.innerText)
    var setNewValue = currYear + 1
    yearValue.innerText = setNewValue
    this.set_fetch_month_year = setNewValue
    this.getYearlyBuildingBill('electricity', setNewValue)
    this.getsingleMonthBuildingBill('electricity', this.set_fetch_month_year, this.set_current_month)
  }

  reduceSliderValue() {
    var yearValue: any = document.getElementById('currentYear')
    var currYear = parseInt(yearValue.innerText)
    var setDecrementedValue = currYear - 1
    yearValue.innerText = setDecrementedValue
    this.set_fetch_month_year = setDecrementedValue
    this.getYearlyBuildingBill('electricity', setDecrementedValue)
    this.getsingleMonthBuildingBill('electricity', this.set_fetch_month_year, this.set_current_month)

  }

  reducemonthSliderValue() {
    var monthcurrValue: any = document.getElementById('monthfetchValue')
    var yearcurrValue: any = document.getElementById('monthYearfetchValue')


    var curr_month = monthcurrValue.innerText
    var curr_month_Year = yearcurrValue.innerText

    if (curr_month == 'Jan') {
      monthcurrValue.innerText = 'Dec'
      var decremented_year = parseInt(curr_month_Year) - 1
      curr_month_Year = decremented_year
      // yearcurrValue.innerText = decremented_year
      this.set_fetch_month_year = decremented_year
      this.set_current_month = '12'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '12')
    }
    else if (curr_month == 'Feb') {
      monthcurrValue.innerText = 'Jan'
      this.set_current_month = '1'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '1')
    }
    else if (curr_month == 'Mar') {
      monthcurrValue.innerText = 'Feb'
      this.set_current_month = '2'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '2')
    }
    else if (curr_month == 'Apr') {
      monthcurrValue.innerText = 'Mar'
      this.set_current_month = '3'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '3')

    }
    else if (curr_month == 'May') {
      monthcurrValue.innerText = 'Apr'
      this.set_current_month = '4'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '4')
    }
    else if (curr_month == 'Jun') {
      monthcurrValue.innerText = 'May'
      this.set_current_month = '5'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '5')
    }
    else if (curr_month == 'Jul') {
      monthcurrValue.innerText = 'Jun'
      this.set_current_month = '6'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '6')
    }
    else if (curr_month == 'Aug') {
      monthcurrValue.innerText = 'Jul'
      this.set_current_month = '7'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '7')
    }
    else if (curr_month == 'Sep') {
      monthcurrValue.innerText = 'Aug'
      this.set_current_month = '8'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '8')
    }
    else if (curr_month == 'Oct') {
      monthcurrValue.innerText = 'Sep'
      this.set_current_month = '9'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '9')
    }
    else if (curr_month == 'Nov') {
      monthcurrValue.innerText = 'Oct'
      this.set_current_month = '10'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '10')
    }
    else if (curr_month == 'Dec') {
      monthcurrValue.innerText = 'Nov'
      this.set_current_month = '11'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '11')
    }

  }

  increasemonthSliderValue() {
    var monthcurrValue: any = document.getElementById('monthfetchValue')
    var yearcurrValue: any = document.getElementById('monthYearfetchValue')
    var curr_month = monthcurrValue.innerText
    var curr_month_Year = yearcurrValue.innerText

    if (curr_month == 'Jan') {
      monthcurrValue.innerText = 'Feb'
      this.set_current_month = '2'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '2')
    }
    else if (curr_month == 'Feb') {
      monthcurrValue.innerText = 'Mar'
      this.set_current_month = '3'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '3')
    }
    else if (curr_month == 'Mar') {
      monthcurrValue.innerText = 'Apr'
      this.set_current_month = '4'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '4')
    }
    else if (curr_month == 'Apr') {
      monthcurrValue.innerText = 'May'
      this.set_current_month = '5'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '5')
    }
    else if (curr_month == 'May') {
      monthcurrValue.innerText = 'Jun'
      this.set_current_month = '6'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '6')
    }
    else if (curr_month == 'Jun') {
      monthcurrValue.innerText = 'Jul'
      this.set_current_month = '7'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '7')
    }
    else if (curr_month == 'Jul') {
      monthcurrValue.innerText = 'Aug'
      this.set_current_month = '8'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '8')
    }
    else if (curr_month == 'Aug') {
      monthcurrValue.innerText = 'Sep'
      this.set_current_month = '9'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '9')
    }
    else if (curr_month == 'Sep') {
      monthcurrValue.innerText = 'Oct'
      this.set_current_month = '10'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '10')
    }
    else if (curr_month == 'Oct') {
      monthcurrValue.innerText = 'Nov'
      this.set_current_month = '11'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '11')
    }
    else if (curr_month == 'Nov') {
      monthcurrValue.innerText = 'Dec'
      this.set_current_month = '12'
      this.getsingleMonthBuildingBill('electricity', curr_month_Year, '12')
    }
    else if (curr_month == 'Dec') {
      monthcurrValue.innerText = 'Jan'
      this.set_current_month = '1'
      var updated_incremented_year = parseInt(curr_month_Year) + 1
      // yearcurrValue.innerText = updated_incremented_year
      this.set_fetch_month_year = updated_incremented_year
      this.getsingleMonthBuildingBill('electricity', updated_incremented_year, '1')
    }
  }

  getYearlyBuildingBill(utilityType: any, year: any): void {
    this.billdataService.getYearlybill(this.currentBuilding.idbuildings, utilityType, year)
      .subscribe((buidlingBill: any) => {
        if (buidlingBill.status == 200) {
          if (this.currentBill) {
            for (let i = 0; i < Object.keys(this.year_single_months).length; i++) {
              var curr: any = Object.keys(this.year_single_months)[i]
              this.year_single_months[curr] = '0%'
            }
          }
          this.render_flag = true
          this.currentBill = buidlingBill.data
          this.currentBillDecimal = buidlingBill.data.total_cost_decimal
          this.currentBillusageDecimal = buidlingBill.data.total_usage_decimal
          this.currentBill.total_cost = buidlingBill.data.total_cost
          this.currentBill.total_usage = buidlingBill.data.total_usage

          for (let i = 0; i < Object.keys(this.year_single_months).length; i++) {
            if (Object.keys(buidlingBill.data.monthly_usage).includes(Object.keys(this.year_single_months)[i])) {
              var curr: any = Object.keys(this.year_single_months)[i]
              var curr_value: any = buidlingBill.data.monthly_usage[curr]
              this.year_single_months[curr] = this.maxUsageBar(curr_value, this.currentBill.max_usage)
            }
          }

          if (buidlingBill.data.monthly_usage) {
            for (let i = 0; i < Object.keys(this.month_single_graph).length; i++) {
              var curr: any = Object.keys(this.month_single_graph)[i]
              this.month_single_graph[curr] = '0%'
            }
            for (let i = 0; i < Object.keys(this.month_single_graph).length; i++) {
              if (Object.keys(buidlingBill.data.monthly_usage).includes(Object.keys(this.month_single_graph)[i])) {
                var curr: any = Object.keys(this.month_single_graph)[i]
                var curr_value: any = buidlingBill.data.monthly_usage[curr]
                this.month_single_graph[curr] = this.maxUsageBar(curr_value, buidlingBill.data.max_usage)
              }
            }
          }
          else {
            for (let i = 0; i < Object.keys(this.month_single_graph).length; i++) {
              var curr: any = Object.keys(this.month_single_graph)[i]
              this.month_single_graph[curr] = '0%'
            }
          }
          this.year_meter_value = "100%"
          this.carbon_consumption_data = buidlingBill.data.carbon.slice(0, buidlingBill.data.carbon.length - 1)
          if (buidlingBill.data.usage_breakdown_in_ft) {
            this.year_breakdown_ft_decimal = ((buidlingBill.data.usage_breakdown_in_ft - Math.floor(buidlingBill.data.usage_breakdown_in_ft)).toFixed(2)).slice(1, 4)
            this.year_breakdown_meter_decimal = ((buidlingBill.data.usage_breakdown_in_meter - Math.floor(buidlingBill.data.usage_breakdown_in_meter)).toFixed(2)).slice(1, 4)
            this.year_breakdown_ft = Math.floor(buidlingBill.data.usage_breakdown_in_ft)
            this.year_breakdown_meter = Math.floor(buidlingBill.data.usage_breakdown_in_meter)
          }
          if (buidlingBill.data.cost_breakdown_in_ft) {
            this.year_price_breakdown_ft_decimal = ((buidlingBill.data.cost_breakdown_in_ft - Math.floor(buidlingBill.data.cost_breakdown_in_ft)).toFixed(2)).slice(1, 4)
            this.year_price_breakdown_meter_decimal = ((buidlingBill.data.cost_breakdown_in_meter - Math.floor(buidlingBill.data.cost_breakdown_in_meter)).toFixed(2)).slice(1, 4)
            this.year_price_breakdown_ft = Math.floor(buidlingBill.data.cost_breakdown_in_ft)
            this.year_price_breakdown_meter = Math.floor(buidlingBill.data.cost_breakdown_in_meter)
          }
          var toggleTag: any = document.getElementById('perft2')
          if (toggleTag) {
            if (toggleTag.checked) {
              var areaTag: any = document.getElementById('updateAreaValue')
              areaTag.innerHTML = this.year_breakdown_ft
              var decimalTag: any = document.getElementById('decimalBreakdown')
              decimalTag.innerHTML = this.year_breakdown_ft_decimal
              var priceareaTag: any = document.getElementById('customPrice')
              priceareaTag.innerHTML = this.year_price_breakdown_ft
              var pricedecimalTag: any = document.getElementById('customdecimalPrice')
              pricedecimalTag.innerHTML = this.year_price_breakdown_ft_decimal
            } else {
              var areaTag: any = document.getElementById('updateAreaValue')
              if (areaTag) {
                areaTag.innerHTML = this.year_breakdown_meter
                var decimalTag: any = document.getElementById('decimalBreakdown')
                decimalTag.innerHTML = this.year_breakdown_meter_decimal
                var priceareaTag: any = document.getElementById('customPrice')
                priceareaTag.innerHTML = this.year_price_breakdown_meter
                var pricedecimalTag: any = document.getElementById('customdecimalPrice')
                pricedecimalTag.innerHTML = this.year_price_breakdown_meter_decimal
              }
            }
          }
        } else {
          for (let i = 0; i < Object.keys(this.year_single_months).length; i++) {
            var curr: any = Object.keys(this.year_single_months)[i]
            this.year_single_months[curr] = '0%'
          }
          this.currentBill = []
          this.year_breakdown_ft_decimal = ""
          this.year_breakdown_meter_decimal = ""
          this.year_breakdown_ft = ""
          this.year_breakdown_meter = ""
          this.year_price_breakdown_ft_decimal = ""
          this.year_price_breakdown_meter_decimal = ""
          this.year_price_breakdown_ft = ""
          this.year_price_breakdown_meter = ""
          this.carbon_consumption_data = "-"
          this.currentBillDecimal = ""
          this.currentBillusageDecimal = ""
          this.year_meter_value = "0%"
          var toggleTag: any = document.getElementById('perft2')
          if (toggleTag) {
            if (toggleTag.checked) {
              var areaTag: any = document.getElementById('updateAreaValue')
              areaTag.innerHTML = this.year_breakdown_ft
              var decimalTag: any = document.getElementById('decimalBreakdown')
              decimalTag.innerHTML = this.year_breakdown_ft_decimal
              var priceareaTag: any = document.getElementById('customPrice')
              priceareaTag.innerHTML = this.year_price_breakdown_ft
              var pricedecimalTag: any = document.getElementById('customdecimalPrice')
              pricedecimalTag.innerHTML = this.year_price_breakdown_ft_decimal
            } else {
              var areaTag: any = document.getElementById('updateAreaValue')
              if (areaTag) {
                areaTag.innerHTML = this.year_breakdown_meter
                var decimalTag: any = document.getElementById('decimalBreakdown')
                decimalTag.innerHTML = this.year_breakdown_meter_decimal
                var priceareaTag: any = document.getElementById('customPrice')
                priceareaTag.innerHTML = this.year_price_breakdown_meter
                var pricedecimalTag: any = document.getElementById('customdecimalPrice')
                pricedecimalTag.innerHTML = this.year_price_breakdown_meter_decimal
              }
            }
          }
        }
      });
  }

  getsingleMonthBuildingBill(utilityType: any, year: any, month: any): void {
    this.billdataService.getMonltyBuidlingbill(this.currentBuilding.idbuildings, utilityType, year, month)
      .subscribe((monthlybuidlingBill: any) => {
        if (monthlybuidlingBill.status == 200) {
          this.render_flag_month = true
          if (this.currentMonthBill) {
            var removeGraph: any = document.getElementById(this.currentMonthBill.month)
            var progressBar: any = document.getElementById('setUsageBar')
            if (removeGraph) {
              progressBar.style.width = '0%'
              removeGraph.style.height = '0%'
            }
          }

          this.billdataService.getYearlybill(this.currentBuilding.idbuildings, utilityType, year)
            .subscribe((plotMonthBill: any) => {
              if (plotMonthBill.data.monthly_usage) {
                for (let i = 0; i < Object.keys(this.month_single_graph).length; i++) {
                  var curr: any = Object.keys(this.month_single_graph)[i]
                  this.month_single_graph[curr] = '0%'
                }
                for (let i = 0; i < Object.keys(this.month_single_graph).length; i++) {
                  if (Object.keys(plotMonthBill.data.monthly_usage).includes(Object.keys(this.month_single_graph)[i])) {
                    var curr: any = Object.keys(this.month_single_graph)[i]
                    var curr_value: any = plotMonthBill.data.monthly_usage[curr]
                    this.month_single_graph[curr] = this.maxUsageBar(curr_value, plotMonthBill.data.max_usage)
                  }
                }
              }
              else {
                for (let i = 0; i < Object.keys(this.month_single_graph).length; i++) {
                  var curr: any = Object.keys(this.month_single_graph)[i]
                  this.month_single_graph[curr] = '0%'
                }
              }
            })
          this.currentMonthBill = monthlybuidlingBill.data
          this.currentmonthBillDecimal = monthlybuidlingBill.data.cost_decimal
          this.currentmonthBillusageDecimal = monthlybuidlingBill.data.usage_decimal
          this.currentMonthBill.total_cost = monthlybuidlingBill.data.cost
          this.currentMonthBill.total_usage = monthlybuidlingBill.data.usage
          if (monthlybuidlingBill.data.carbon == 0) {
            this.carbon_consumption_monthly_data = monthlybuidlingBill.data.carbon
          } else {
            this.carbon_consumption_monthly_data = monthlybuidlingBill.data.carbon.slice(0, monthlybuidlingBill.data.carbon.length - 1)
          }
          if (monthlybuidlingBill.data.usage_breakdown_in_ft) {
            this.breakdown_ft_decimal = ((monthlybuidlingBill.data.usage_breakdown_in_ft - Math.floor(monthlybuidlingBill.data.usage_breakdown_in_ft)).toFixed(2)).slice(1, 4)
            this.breakdown_meter_decimal = ((monthlybuidlingBill.data.usage_breakdown_in_meter - Math.floor(monthlybuidlingBill.data.usage_breakdown_in_meter)).toFixed(2)).slice(1, 4)
            this.breakdown_ft = Math.floor(monthlybuidlingBill.data.usage_breakdown_in_ft)
            this.breakdown_meter = Math.floor(monthlybuidlingBill.data.usage_breakdown_in_meter)
          }
          if (monthlybuidlingBill.data.cost_breakdown_in_ft) {
            this.price_breakdown_ft_decimal = ((monthlybuidlingBill.data.cost_breakdown_in_ft - Math.floor(monthlybuidlingBill.data.cost_breakdown_in_ft)).toFixed(2)).slice(1, 4)
            this.price_breakdown_meter_decimal = ((monthlybuidlingBill.data.cost_breakdown_in_meter - Math.floor(monthlybuidlingBill.data.cost_breakdown_in_meter)).toFixed(2)).slice(1, 4)
            this.price_breakdown_ft = Math.floor(monthlybuidlingBill.data.cost_breakdown_in_ft)
            this.price_breakdown_meter = Math.floor(monthlybuidlingBill.data.cost_breakdown_in_meter)
          }

          if (document.getElementById('2b')) {
            var progressBar: any = document.getElementById('setUsageBar')
            progressBar.style.width = this.maxUsageBar(this.currentMonthBill.current_usage, this.currentMonthBill.max_usage)
            var removeGraph: any = document.getElementById(this.currentMonthBill.month)
            removeGraph.style.height = this.maxUsageBar(this.currentMonthBill.current_usage, this.currentMonthBill.max_usage)
            var checkBoxMonth: any = document.getElementById('permmonth2')
            if (checkBoxMonth) {
              if (checkBoxMonth.checked) {
                var areaTag: any = document.getElementById('updateAreamonthValue')
                areaTag.innerHTML = this.breakdown_meter
                var decimalTag: any = document.getElementById('decimalmonthBreakdown')
                decimalTag.innerHTML = this.breakdown_meter_decimal
                var priceareaTag: any = document.getElementById('updatecustomPrice')
                priceareaTag.innerHTML = this.price_breakdown_meter
                var pricedecimalTag: any = document.getElementById('updatecustomdecimalPrice')
                pricedecimalTag.innerHTML = this.price_breakdown_meter_decimal

              } else {
                var areaTag: any = document.getElementById('updateAreamonthValue')
                areaTag.innerHTML = this.breakdown_ft
                var decimalTag: any = document.getElementById('decimalmonthBreakdown')
                decimalTag.innerHTML = this.breakdown_ft_decimal
                var priceareaTag: any = document.getElementById('updatecustomPrice')
                priceareaTag.innerHTML = this.price_breakdown_ft
                var pricedecimalTag: any = document.getElementById('updatecustomdecimalPrice')
                pricedecimalTag.innerHTML = this.price_breakdown_ft_decimal
              }
            }

          }
        } else {
          if (this.currentMonthBill) {
            var removeGraph: any = document.getElementById(this.currentMonthBill.month)
          }
          var progressBar: any = document.getElementById('setUsageBar')
          if (removeGraph) {
            progressBar.style.width = '0%'
            removeGraph.style.height = '0%'
          }
          this.billdataService.getYearlybill(this.currentBuilding.idbuildings, 'electricity', year)
            .subscribe((plotMonthBill: any) => {
              if (plotMonthBill.data.monthly_usage) {
                for (let i = 0; i < Object.keys(this.month_single_graph).length; i++) {
                  var curr: any = Object.keys(this.month_single_graph)[i]
                  this.month_single_graph[curr] = '0%'
                  if (Object.keys(plotMonthBill.data.monthly_usage).includes(Object.keys(this.month_single_graph)[i])) {
                    var curr: any = Object.keys(this.month_single_graph)[i]
                    var curr_value: any = plotMonthBill.data.monthly_usage[curr]
                    this.month_single_graph[curr] = this.maxUsageBar(curr_value, plotMonthBill.data.max_usage)
                  }
                }
              }
              else {
                for (let i = 0; i < Object.keys(this.month_single_graph).length; i++) {
                  var curr: any = Object.keys(this.month_single_graph)[i]
                  this.month_single_graph[curr] = '0%'
                }
              }
            })

          this.currentMonthBill = []
          this.currentmonthBillDecimal = ""
          this.currentmonthBillusageDecimal = ""
          this.breakdown_ft_decimal = ""
          this.breakdown_meter_decimal = ""
          this.breakdown_ft = ""
          this.breakdown_meter = ""
          this.price_breakdown_ft_decimal = ""
          this.price_breakdown_meter_decimal = ""
          this.price_breakdown_ft = ""
          this.price_breakdown_meter = ""
          this.carbon_consumption_monthly_data = "-"
          var checkBoxMonth: any = document.getElementById('permmonth2')
          if (checkBoxMonth) {
            if (checkBoxMonth.checked) {
              var areaTag: any = document.getElementById('updateAreamonthValue')
              if (areaTag) {
                areaTag.innerHTML = this.breakdown_meter
                var decimalTag: any = document.getElementById('decimalmonthBreakdown')
                decimalTag.innerHTML = this.breakdown_meter_decimal
                var priceareaTag: any = document.getElementById('updatecustomPrice')
                priceareaTag.innerHTML = this.price_breakdown_meter
                var pricedecimalTag: any = document.getElementById('updatecustomdecimalPrice')
                pricedecimalTag.innerHTML = this.price_breakdown_meter_decimal
              }
            } else {
              var areaTag: any = document.getElementById('updateAreamonthValue')
              if (areaTag) {
                areaTag.innerHTML = this.breakdown_ft
                var decimalTag: any = document.getElementById('decimalmonthBreakdown')
                decimalTag.innerHTML = this.breakdown_ft_decimal
                var priceareaTag: any = document.getElementById('updatecustomPrice')
                priceareaTag.innerHTML = this.price_breakdown_ft
                var pricedecimalTag: any = document.getElementById('updatecustomdecimalPrice')
                pricedecimalTag.innerHTML = this.price_breakdown_ft_decimal
              }
            }
          }

        }
      });
  }
  maxUsageBar(minValue: any, maxValue: any) {
    var curr_Percentage = (minValue / maxValue) * 100
    if (isNaN(curr_Percentage)) {
      return '0%'
    } else {
      return curr_Percentage + '%'
    }
  }

  toggleModal1() {
    var documentYear: any = document.getElementById('1b')
    var documentMonth: any = document.getElementById('2b')
    if (documentYear && documentMonth) {
      documentYear.style.display = 'block'
      documentMonth.style.display = 'none'
    }
    var yearAnchorTag: any = document.getElementById('yearDocument')
    var monthAnchorTag: any = document.getElementById('monthDocument')
    if (yearAnchorTag && monthAnchorTag) {
      yearAnchorTag.classList.remove('tab-handler-active')
      monthAnchorTag.classList.add('tab-handler-active')
    }
    var calenderYear: any = document.getElementById('yearCalender')
    calenderYear.style.display = 'flex'
    var calenderYearMonth: any = document.getElementById('monthCalender')
    calenderYearMonth.style.display = 'none'
  }

  toggleModal2() {
    var documentYear: any = document.getElementById('1b')
    var documentMonth: any = document.getElementById('2b')

    if (documentYear && documentMonth) {
      documentYear.style.display = 'none'
      documentMonth.style.display = 'block'
    }
    var yearAnchorTag: any = document.getElementById('yearDocument')
    var monthAnchorTag: any = document.getElementById('monthDocument')
    if (yearAnchorTag && monthAnchorTag) {
      yearAnchorTag.classList.add('tab-handler-active')
      monthAnchorTag.classList.remove('tab-handler-active')
    }

    var calenderYear: any = document.getElementById('yearCalender')
    calenderYear.style.display = 'none'
    var calenderYearMonth: any = document.getElementById('monthCalender')
    calenderYearMonth.style.display = 'flex'
    if (this.render_flag) {
      var progressBar: any = document.getElementById('setUsageBar')
      progressBar.style.width = this.maxUsageBar(this.currentMonthBill.current_usage, this.currentMonthBill.max_usage)
      var removeGraph: any = document.getElementById(this.currentMonthBill.month)
      if (removeGraph) {
        removeGraph.style.height = this.maxUsageBar(this.currentMonthBill.current_usage, this.currentMonthBill.max_usage)
      }
    }

  }
  leftToggle() {
    var toggleTag: any = document.getElementById('perft2')
    toggleTag.checked = true
    var togglerightTag: any = document.getElementById('perm2')
    togglerightTag.checked = false
    var areaTag: any = document.getElementById('updateAreaValue')
    areaTag.innerHTML = this.year_breakdown_ft
    var decimalTag: any = document.getElementById('decimalBreakdown')
    decimalTag.innerHTML = this.year_breakdown_ft_decimal
    var priceareaTag: any = document.getElementById('customPrice')
    priceareaTag.innerHTML = this.year_price_breakdown_ft
    var pricedecimalTag: any = document.getElementById('customdecimalPrice')
    pricedecimalTag.innerHTML = this.year_price_breakdown_ft_decimal

  }
  rightToggle() {

    var toggleTag: any = document.getElementById('perft2')
    toggleTag.checked = false
    var togglerightTag: any = document.getElementById('perm2')
    togglerightTag.checked = true
    var areaTag: any = document.getElementById('updateAreaValue')
    areaTag.innerHTML = this.year_breakdown_meter
    var decimalTag: any = document.getElementById('decimalBreakdown')
    decimalTag.innerHTML = this.year_breakdown_meter_decimal
    var priceareaTag: any = document.getElementById('customPrice')
    priceareaTag.innerHTML = this.year_price_breakdown_meter
    var pricedecimalTag: any = document.getElementById('customdecimalPrice')
    pricedecimalTag.innerHTML = this.year_price_breakdown_meter_decimal

  }
  leftMonthToggle() {
    var toggleTag: any = document.getElementById('perftmonth2')
    toggleTag.checked = true
    var togglerightTag: any = document.getElementById('permmonth2')
    togglerightTag.checked = false
    var areaTag: any = document.getElementById('updateAreamonthValue')
    areaTag.innerHTML = this.breakdown_ft
    var decimalTag: any = document.getElementById('decimalmonthBreakdown')
    decimalTag.innerHTML = this.breakdown_ft_decimal

    var priceareaTag: any = document.getElementById('updatecustomPrice')
    priceareaTag.innerHTML = this.price_breakdown_ft
    var pricedecimalTag: any = document.getElementById('updatecustomdecimalPrice')
    pricedecimalTag.innerHTML = this.price_breakdown_ft_decimal

  }
  rightMonthToggle() {
    var toggleTag: any = document.getElementById('perftmonth2')
    toggleTag.checked = false
    var togglerightTag: any = document.getElementById('permmonth2')
    togglerightTag.checked = true
    var areaTag: any = document.getElementById('updateAreamonthValue')
    areaTag.innerHTML = this.breakdown_meter
    var decimalTag: any = document.getElementById('decimalmonthBreakdown')
    decimalTag.innerHTML = this.breakdown_meter_decimal
    var priceareaTag: any = document.getElementById('updatecustomPrice')
    priceareaTag.innerHTML = this.price_breakdown_meter
    var pricedecimalTag: any = document.getElementById('updatecustomdecimalPrice')
    pricedecimalTag.innerHTML = this.price_breakdown_meter_decimal
  }
}