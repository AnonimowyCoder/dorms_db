import {Type} from "class-transformer";
import {IsDateString, IsNumber, Min} from "class-validator";

export class CreateRoomPaymentDto
{
	@Type( () => Number ) @IsNumber( { maxDecimalPlaces : 2 } ) @Min( 0 ) public amount!: number;
	@IsDateString() public payment_due_date!: string;
	@Type( () => Number ) @IsNumber( { maxDecimalPlaces : 2 } ) @Min( 0 ) public amount_payed!: number;
	@Type( () => Number ) @Min( 1 ) public id_reservation!: number;
}