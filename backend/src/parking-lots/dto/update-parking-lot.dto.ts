import {IsNumber, IsOptional, IsString, Min} from "class-validator";

export class UpdateParkingLotDto
{
	@IsOptional() @IsString() parking_lot_type?: string;
	@IsOptional() @IsString() placement?: string;
	@IsOptional() @IsNumber() @Min( 0 ) daily_rate?: string;
}