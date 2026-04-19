import {DatabaseModule} from "@/database/database.module";
import {ParkingLotsModule} from "@/parking-lots/parking-lots.module";
import {ResidentsModule} from "@/residents/residents.module";
import {Module} from "@nestjs/common";

import {ParkingReservationsController} from "./parking-reservations.controller";
import {ParkingReservationsService} from "./parking-reservations.service";

@Module( {
	imports : [
		DatabaseModule,
		ParkingLotsModule,
		ResidentsModule,
	],
	controllers : [ ParkingReservationsController ],
	providers : [ ParkingReservationsService ],
	exports : [ ParkingReservationsService ],
} )
export class ParkingReservationsModule
{}