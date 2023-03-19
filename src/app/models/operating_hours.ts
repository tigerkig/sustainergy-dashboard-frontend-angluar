export class OperatingHours {

    constructor(
        public event_date: string,
        public start_time: string,
        public end_time: string,
        public is_closed: boolean,
        public is_repeat: boolean,
        public days_of_week: any
    ) {  }

}