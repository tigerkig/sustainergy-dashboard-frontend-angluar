import {Circuit} from "./circuit";

export class Panel {
    constructor(
        public panel_name: string,
        public building_id: string,
        public panel_id: string,
        public panel_type: string,
        public panel_power: any,
        public panel_image: string,
        public meter_name:string,
        public panelIsconnected:boolean,
        public panelTotalPower:string,
        public panelPercentage:string,
        public panel_circuits: Circuit[]
    ) {

    }

}