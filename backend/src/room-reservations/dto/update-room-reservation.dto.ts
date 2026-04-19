import {IsDateString, IsInt, IsOptional, Min} from "class-validator";

export class UpdateRoomReservationDto
{
	@IsOptional() @IsDateString() start_date_reserv?: string;
	@IsOptional() @IsDateString() end_date_reserv?: string;
	@IsOptional() @IsInt() @Min( 1 ) id_room?: number;
	@IsOptional() @IsInt() @Min( 1 ) id_resident?: number;
}