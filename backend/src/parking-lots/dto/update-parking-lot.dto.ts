import {IsOptional, IsString} from "class-validator";

export class UpdateParkingLotDto
{
	@IsOptional() @IsString() parking_lot_type?: string;
	@IsOptional() @IsString() placement?: string;
}