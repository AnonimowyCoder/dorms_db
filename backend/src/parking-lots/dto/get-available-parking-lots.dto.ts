import {IsDateString} from "class-validator";

export class GetAvailableParkingLotsDto
{
	@IsDateString() public start_date!: string;
	@IsDateString() public end_date!: string;
}