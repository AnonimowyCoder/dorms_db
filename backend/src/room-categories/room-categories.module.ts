import {DatabaseModule} from "@/database/database.module";
import {Module} from "@nestjs/common";

import {RoomCategoriesController} from "./room-categories.controller";
import {RoomCategoriesService} from "./room-categories.service";

@Module( {
	imports : [ DatabaseModule ],
	controllers : [ RoomCategoriesController ],
	providers : [ RoomCategoriesService ],
	exports : [ RoomCategoriesService ],
} )
export class RoomCategoriesModule
{}