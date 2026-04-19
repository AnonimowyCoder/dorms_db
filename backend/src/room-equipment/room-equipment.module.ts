import {DatabaseModule} from "@/database/database.module";
import {EquipmentModule} from "@/equipment/equipment.module";
import {RoomsModule} from "@/rooms/rooms.module";
import {Module} from "@nestjs/common";

import {RoomEquipmentController} from "./room-equipment.controller";
import {RoomEquipmentService} from "./room-equipment.service";

@Module( {
	imports : [
		DatabaseModule,
		RoomsModule,
		EquipmentModule,
	],
	controllers : [ RoomEquipmentController ],
	providers : [ RoomEquipmentService ],
	exports : [ RoomEquipmentService ],
} )
export class RoomEquipmentModule
{}