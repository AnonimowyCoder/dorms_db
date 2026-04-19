import {DatabaseModule} from "@/database/database.module";
import {ParkingReservationsModule} from "@/parking-reservations/parking-reservations.module";
import {Module} from "@nestjs/common";

import {ParkingPaymentsController} from "./parking-payments.controller";
import {ParkingPaymentsService} from "./parking-payments.service";

@Module( {
	imports : [
		DatabaseModule,
		ParkingReservationsModule,
	],
	controllers : [ ParkingPaymentsController ],
	providers : [ ParkingPaymentsService ],
	exports : [ ParkingPaymentsService ],
} )
export class ParkingPaymentsModule
{}