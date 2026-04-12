import {IsDateString, IsInt, Min} from "class-validator";

export class CreateRoomReservationDto
{
	@IsDateString() start_date_reserv!: string;
	@IsDateString() end_date_reserv!: string;
	@IsInt() @Min( 1 ) id_room!: number;
	@IsInt() @Min( 1 ) id_resident!: number;
}