import {IsNumber, IsOptional, IsString, Min} from "class-validator";

export class CreateParkingLotDto
{
	@IsOptional() @IsString() parking_lot_type?: string;
	@IsOptional() @IsString() placement?: string;
	@IsNumber() @Min( 0 ) daily_rate?: string;
}