import {DatabaseModule} from "@/database/database.module";
import {RoomCategoriesModule} from "@/room-categories/room-categories.module";
import {Module} from "@nestjs/common";

import {RoomsController} from "./rooms.controller";
import {RoomsService} from "./rooms.service";

@Module( {
	imports : [
		DatabaseModule,
		RoomCategoriesModule,
	],
	controllers : [ RoomsController ],
	providers : [ RoomsService ],
	exports : [ RoomsService ],
} )
export class RoomsModule
{}