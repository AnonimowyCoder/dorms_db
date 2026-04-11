import {IsInt, IsOptional, Min} from "class-validator";

export class UpdateRoomDto
{
	@IsOptional() @IsInt() @Min( 1 ) room_number?: number;
	@IsOptional() @IsInt() @Min( 0 ) floor_number?: number;
	@IsOptional() @IsInt() @Min( 1 ) num_of_beds?: number;
	@IsOptional() @IsInt() @Min( 1 ) id_category?: number;
}