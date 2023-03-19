import { DashboardDataService } from "../services/dashboard-data/dashboard-data.service";
import { OperatingHours } from "../models/operating_hours";
import { Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/angular';
import { DatePipe } from '@angular/common';
import { PickerInteractionMode } from 'igniteui-angular';
import { Subscription } from "rxjs";
import { Building } from '../models/building';
import { DailyData } from '../models/daily_data';

@Component({
  selector: 'app-operating-hours',
  templateUrl: './operating-hours.component.html',
  styleUrls: ['./operating-hours.component.scss']
})
export class OperatingHoursComponent {
  private currentBuildingSubscription:Subscription;
  currentBuilding:Building;
  schedule:any;
  scheduledEvents:any[];
  selectedDate: any;

  constructor(
    private dashboardDataService: DashboardDataService,
    public datepipe: DatePipe) {
    this.currentBuildingSubscription = this.dashboardDataService.watchCurrentBuilding().subscribe((building: Building) => {
      if (building != null) {
        this.currentBuilding = building;
        this.getBuildingSchedule();
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.currentBuildingSubscription.unsubscribe();
  }

  displayStyle = "none";

  public mode: PickerInteractionMode = PickerInteractionMode.DropDown;
  public format = 'hh:mm tt';

  showMsg: boolean = false;
  msg: string = "";

  time1 = "09:00:00";
  time2 = "18:00:00";
  days_of_week: any = [];
  popupData: any;
  isChecked: boolean = false;
  isRepeatChecked: boolean = false;
  is_daily: boolean = false;
  is_weekly: boolean = false;

  weekday: any;
  weekDays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] // These are all acceptable days for recurrency

  repeatList: string[] = [];
  public setDateToPopup: any;

  openPopup() {
    this.weekday = this.datepipe.transform(this.selectedDate, 'EEEE');
    var annualDay = this.datepipe.transform(this.selectedDate, 'MMMM dd');
    this.repeatList = ["Daily", "Weekly on " + this.weekday, "Every weekday (Monday to Friday)"]
    this.popupData = this.schedule.find( (x:any) => x.event_date == this.selectedDate);
    if (this.popupData) {
      this.getPopUpData();
    }
    this.displayStyle = "block";
  }

  getBuildingSchedule() {
    this.dashboardDataService.getBuildingSchedule(this.currentBuilding.idbuildings).subscribe( (events: any) => {
      this.schedule = JSON.parse(events);
      this.generateCalendarEvents();
      this.setCalendar();
    });
  }

  // This should be all of the functionality I require for this leg.
  generateCalendarEvents() {
    let events = [];
    for (let i in this.schedule) {
      let event = this.schedule[i];

      let start_time  = new Date(event.event_date + ' ' + event.start_time);
      let end_time    = new Date(event.event_date + ' ' + event.end_time);

      let start_str   = this.datepipe.transform(start_time, 'h:mm a');
      let end_str     = this.datepipe.transform(end_time, 'h:mm a');

      let duration:number;
      if (end_time.getHours() == 0) { duration = 24 - start_time.getHours(); }
      else                          { duration = end_time.getHours() - start_time.getHours(); }

      let obj:any;
      if (event.is_closed) {
        obj = {
          date: event.event_date,
          title: "Closed",
          className: "closedEvent"
        }
      } else {
        obj = {
          date: event.event_date,
          title: start_str?.toLowerCase() + " - " + end_str?.toLowerCase(),
          className: "eventPresent",
          description: duration + " hours"
        }
      }
      events.push(obj);
    }
    this.scheduledEvents = events;
  }

  setCalendar() {
    this.calendarOptions.events = this.scheduledEvents;
    this.calendarOptions.eventContent = function (arg) {
      var event = arg.event;
      var customHtml = '';
      let newNode = document.createElement('div');
      let closedNode = document.createElement('div');
      let newNode1 = document.createElement('div');
      let arrayOfDomNodes: any = []
      if (event.extendedProps["description"] !== undefined) {
        var title: any = event.title.trim().split("-")
        const [start_time, modifier] = title[0].trim().split(" ");
        const [end_time, end_modifier] = title[1].trim().split(" ");
        let [start_hours, start_minutes] = start_time.split(":");
        let [end_hours, end_minutes] = end_time.split(":");
        newNode.className = 'timeTitle';
        newNode1.className = 'eventDescription';
        newNode.innerHTML = "<div class='startTimetext'><span class='hoursText'>" + start_hours + "</span><span class='minutes'>:" + start_minutes + "</span><span class='modifiers'>" + modifier + "</span> </div><span class='dividerText'>-</span><div class='endTimetext'><span class='hoursText'>" + end_hours + "</span><span class='minutes'>:" + end_minutes + "</span><span class='modifiers'>" + end_modifier + "</span></div>"
        newNode1.innerHTML = "<span class='durationText'>" + event.extendedProps["description"] + "</span>"
        arrayOfDomNodes = [newNode, newNode1]
      } else {
        if (event.title === "Closed") {
          closedNode.className = 'closedText';
          closedNode.innerHTML = "<span class='closedtext'>" + event.title + "</span>"
        }
        arrayOfDomNodes = [closedNode]
      }
      return { domNodes: arrayOfDomNodes }
    }
  }

  closePopup() {
    this.displayStyle = "none";
    this.isRepeatChecked = false;
    this.time1 = "09:00:00";
    this.time2 = "18:00:00";
    this.days_of_week = [];
    this.popupData = null;
    this.is_daily = false;
    this.is_weekly = false;
    this.isChecked = false;
  }

  calendarVisible = true;
  operatinghours: any[] = [];
  Events: any[] = [];

  calendarOptions: CalendarOptions = {
    headerToolbar: { left: '', center: '', right: 'prev title next' },
    initialView: 'dayGridMonth',
    weekends: true,
    showNonCurrentDates: false,
    editable: false,
    displayEventTime: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    contentHeight: "auto",
    fixedWeekCount: false,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  processDate() {
    var d = new Date(this.selectedDate + " " + this.time1);
    var dayName = this.weekDays[d.getDay()];
    if (this.days_of_week[0] === 0) {
      this.days_of_week = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
      this.is_daily = true
      this.is_weekly = false
    }
    else if (this.days_of_week[0] === 1) {
      this.days_of_week = [dayName]
      this.is_weekly = true
      this.is_daily = false
    }
    else if (this.days_of_week[0] === 2) {
      this.is_weekly = true
      this.is_daily = false
      this.days_of_week = ['MO', 'TU', 'WE', 'TH', 'FR']
    }

    if (this.time1 === "" || this.time1 === undefined || this.time2 === "" || this.time2 === undefined || this.isChecked === true) {
      this.time1 = "00:00:00"
      this.time2 = "00:00:00"
    }
  }

  handleAccept() {
    this.processDate();

    if (this.popupData === undefined) {
      this.onAddEvent();
    } else {
      this.updateEvent();
    }
    this.timeoutSleep();
  }

  deleteEvent(date:any):void {
    let event = this.schedule.find( (data:DailyData) => data.event_date == date);
    let id = event.id
    this.dashboardDataService.deleteEvent(id, this.isRepeatChecked).subscribe( (status) => {
      this.showMessage("Event deleted successfully!");
      this.getBuildingSchedule();
      this.timeoutSleep();
    });
  }

  startTimechange(evt: any) { this.time1 = evt.target.value; }

  endTimechange(evt: any) { this.time2 = evt.target.value; }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectedDate = selectInfo.startStr;
    this.setDateToPopup = this.datepipe.transform(selectInfo.startStr, 'EEEE, MMMM d, y');
    this.openPopup();
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.selectedDate = clickInfo.event.startStr;
    this.setDateToPopup = this.datepipe.transform(clickInfo.event.startStr, 'EEEE, MMMM d, y');
    this.openPopup();
  }

    // This is called in the HTML when the event times are changed.
  changed(evt: any) {
    this.isChecked = evt.target.checked;
    this.popupData = this.schedule.find( (x:any) => x.event_date === this.selectedDate);
  }

  // This is called as well, as above.
  repeatChanged(evt: any) {
    this.isRepeatChecked = evt.target.checked;
    if (this.isRepeatChecked) {
      this.days_of_week = [0];
    } else {
      this.days_of_week = [];
    }
  }

  // This is used in the front-end
  selectRepeatOption(evt: any) {
    this.days_of_week = [evt];
  }

  // This is called in the handleAccept function
  timeoutSleep() {
    setTimeout(() => {
      this.closePopup();
    }, 1000);
  }

  getParams() {
    return {
      start_time: this.time1,
      end_time: this.time2,
      event_date: this.selectedDate,
      is_closed: this.isChecked,
      is_repeat: this.isRepeatChecked,
      days_of_week: this.days_of_week,
      is_daily: this.is_daily,
      is_weekly: this.is_weekly,
      building: this.currentBuilding.idbuildings
    }
  }

  showMessage(message:string) {
    this.showMsg = true;
    this.msg = message;
    setTimeout( () => {
      this.showMsg = false;
      this.msg = "";
    }, 1000);
  }

  updateEvent(): void {
    let params = this.getParams();

    this.dashboardDataService.updateEvents(this.popupData.id, this.currentBuilding.idbuildings, params)
    .subscribe((events) => {
      console.log("Successfully updated event.");
      this.showMessage("Event updated Successfully!");
      this.getBuildingSchedule();
    })
  }

  async onAddEvent() {
    let params = this.getParams();

    this.dashboardDataService.addEvents(this.currentBuilding.idbuildings, params)
      .subscribe((events) => {
        this.showMessage("Event added Successfully!");
        this.getBuildingSchedule();
      })
  }

  getPopUpData() {
    this.weekday = this.datepipe.transform(this.selectedDate, 'EEEE');
    var annualDay = this.datepipe.transform(this.selectedDate, 'MMMM dd');
    this.repeatList = ["Daily", "Weekly on " + this.weekday, "Every weekday (Monday to Friday)"]
    // "Monthy on the fourth "+ this.weekday,"Monthy on the last "+ this.weekday,"Annualy on "+ annualDay,
    if (this.popupData.start_time && this.popupData.end_time) {
      this.time1 = this.popupData.start_time
      this.time2 = this.popupData.end_time
      var startTimeTokens = this.popupData.start_time.split(':');
      var endTimeTokens = this.popupData.end_time.split(':');
      var start_time = new Date(1970, 0, 1, startTimeTokens[0], startTimeTokens[1], startTimeTokens[2]);
      var end_time = new Date(1970, 0, 1, endTimeTokens[0], endTimeTokens[1], endTimeTokens[2]);
      var StartTime = this.datepipe.transform(start_time, 'hh:mm a');
      var EndTime = this.datepipe.transform(end_time, 'hh:mm a');
    }
    this.isChecked = this.popupData.is_closed;
    this.isRepeatChecked = this.popupData.is_repeat;
    this.days_of_week = this.popupData.days_of_week;

    if (this.days_of_week !== undefined && this.days_of_week.length === 7) {
      this.days_of_week = [0]
    }
    else if (this.days_of_week !== undefined && this.days_of_week.length === 1) {
      this.days_of_week = [1]
    }
    else if (this.days_of_week !== undefined && this.days_of_week.length === 5) {
      this.days_of_week = [2]
    }
    var d = new Date(this.selectedDate);
  }
}
