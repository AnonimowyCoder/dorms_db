import {IsInt, Min} from "class-validator";

export class CreateRoomDto
{
	@IsInt() @Min( 1 ) room_number!: number;
	@IsInt() @Min( 0 ) floor_number!: number;
	@IsInt() @Min( 1 ) num_of_beds!: number;
	@IsInt() @Min( 1 ) id_category!: number;
}