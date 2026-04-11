import {DatabaseModule} from "@/database/database.module";
import {Module} from "@nestjs/common";

import {RoomsController} from "./rooms.controller";
import {RoomsService} from "./rooms.service";

@Module( {
	imports : [ DatabaseModule ],
	controllers : [ RoomsController ],
	providers : [ RoomsService ],
} )
export class RoomsModule
{}