import {DatabaseModule} from "@/database/database.module";
import {Module} from "@nestjs/common";

import {EquipmentController} from "./equipment.controller";
import {EquipmentService} from "./equipment.service";

@Module( {
	imports : [ DatabaseModule ],
	controllers : [ EquipmentController ],
	providers : [ EquipmentService ],
	exports : [ EquipmentService ],
} )
export class EquipmentModule
{}