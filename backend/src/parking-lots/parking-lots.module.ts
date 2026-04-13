import {DatabaseModule} from "@/database/database.module";
import {Module} from "@nestjs/common";

import {ParkingLotsController} from "./parking-lots.controller";
import {ParkingLotsService} from "./parking-lots.service";

@Module( {
	imports : [ DatabaseModule ],
	controllers : [ ParkingLotsController ],
	providers : [ ParkingLotsService ],
	exports : [ ParkingLotsService ],
} )
export class ParkingLotsModule
{}