
export class Bill {
    constructor(
        public year:   number,
        public utility: string,
        public building_id: string,
        public total_usage:  number ,
        public total_cost:   number,
        public carbon: number,
        public month: any ,

    ) {  }

}
