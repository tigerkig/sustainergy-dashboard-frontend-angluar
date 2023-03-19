export class Circuit {

    constructor(
        public category_color: string,
        public circuit_name: string,
        public circuit_category: string,
        public circuit_amps: string,
        public panel_id: string,
        public circuit_number: string,
        public circuit_percentage:string,
        public circuit_power:string,
        public circuit_disabled:string,
        public circuit_bar:string,
        public disconnected :boolean = false


    ) {  }


}