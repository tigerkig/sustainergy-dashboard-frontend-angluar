import { Facility } from './facility';


export class Building {

    constructor(
        public idbuildings:                   string,
        public address:                       string,
        public description:                   string,
        public city:                          string | null,
        public facility:                      Facility,
        public year_built:                    number | null,
        public age:                           number | null,
        public squarefootage:                 number | null,
        public square_meters:                 number | null,
        public roof_squarefootage:            number | null,
        public exterior_wall_squarefootage:   number | null,
        public address_line_1:                string | null,
        public address_line_2:                string | null,
        public postal_code:                   string | null,
        public province:                      string | null,

    ) {  }

}
