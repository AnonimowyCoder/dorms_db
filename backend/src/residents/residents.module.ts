import {DatabaseModule} from "@/database/database.module";
import {Module} from "@nestjs/common";

import {ResidentsController} from "./residents.controller";
import {ResidentsService} from "./residents.service";

@Module( {
	imports : [ DatabaseModule ],
	controllers : [ ResidentsController ],
	providers : [ ResidentsService ],
	exports : [ ResidentsService ],
} )
export class ResidentsModule
{}