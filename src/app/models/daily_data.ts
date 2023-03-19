export class DailyData {

    constructor(
        public building     :           string,
        public days_of_week :           any[],
        public end_time     :           string,
        public start_time   :           string,
        public event_date   :           string,
        public is_closed    :           boolean,
        public is_daily     :           boolean,
        public is_repeat    :           boolean,
        public is_weekly    :           boolean,
        public id?          :           number
    ){}
}

