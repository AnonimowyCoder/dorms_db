import {Type} from "class-transformer";
import {IsInt, Min} from "class-validator";

export class UpdateRoomEquipmentDto
{
	@Type( () => Number ) @IsInt() @Min( 1 ) public count!: number;
}