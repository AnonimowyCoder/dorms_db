import {DatabaseModule} from "@/database/database.module";
import {ResidentsModule} from "@/residents/residents.module";
import {RoomsModule} from "@/rooms/rooms.module";
import {Module} from "@nestjs/common";

import {RoomReservationsController} from "./room-reservations.controller";
import {RoomReservationsService} from "./room-reservations.service";

@Module( {
	imports : [
		DatabaseModule,
		RoomsModule,
		ResidentsModule,
	],
	controllers : [ RoomReservationsController ],
	providers : [ RoomReservationsService ],
} )
export class RoomReservationsModule
{}