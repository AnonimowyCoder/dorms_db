import {IsDateString} from "class-validator";

export class GetAvailableRoomsDto
{
	@IsDateString() public start_date!: string;
	@IsDateString() public end_date!: string;
}