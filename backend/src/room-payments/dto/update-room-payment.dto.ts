import {Type} from "class-transformer";
import {IsDateString, IsNumber, IsOptional, Min} from "class-validator";

export class UpdateRoomPaymentDto
{
	@IsOptional() @Type( () => Number ) @IsNumber( { maxDecimalPlaces : 2 } ) @Min( 0 ) public amount?: number;
	@IsOptional() @IsDateString() public payment_due_date?: string;
	@IsOptional() @Type( () => Number ) @IsNumber( { maxDecimalPlaces : 2 } ) @Min( 0 ) public amount_payed?: number;
}