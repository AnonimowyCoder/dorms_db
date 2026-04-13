import {IsOptional, IsString} from "class-validator";

export class CreateParkingLotDto
{
	@IsOptional() @IsString() parking_lot_type?: string;
	@IsOptional() @IsString() placement?: string;
}