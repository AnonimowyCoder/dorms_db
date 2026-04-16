import {IsInt, Min} from "class-validator";

export class CreateRoomEquipmentDto
{
	@IsInt() @Min( 1 ) public id_room!: number;
	@IsInt() @Min( 1 ) public id_equipment!: number;
	@IsInt() @Min( 1 ) public count!: number;
}