import {Type} from "class-transformer";
import {IsInt, IsOptional, Min} from "class-validator";

export class CreateRoomEquipmentDto
{
	@IsInt() @Min( 1 ) public id_room!: number;
	@IsInt() @Min( 1 ) public id_equipment!: number;
	@IsOptional() @Type( () => Number ) @IsInt() @Min( 1 ) public count?: number;
}