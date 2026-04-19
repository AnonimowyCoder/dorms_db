import {DatabaseModule} from "@/database/database.module";
import {RoomReservationsModule} from "@/room-reservations/room-reservations.module";
import {Module} from "@nestjs/common";

import {RoomPaymentsController} from "./room-payments.controller";
import {RoomPaymentsService} from "./room-payments.service";

@Module( {
	imports : [
		DatabaseModule,
		RoomReservationsModule,
	],
	controllers : [ RoomPaymentsController ],
	providers : [ RoomPaymentsService ],
	exports : [ RoomPaymentsService ],
} )
export class RoomPaymentsModule
{}