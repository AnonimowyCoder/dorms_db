import {IsBoolean, IsNumber, IsString, Min} from "class-validator";

export class CreateRoomCategoryDto
{
	@IsNumber() @Min( 0 ) monthly_rent!: number;
	@IsBoolean() if_kitchen!: boolean;
	@IsString() category_name!: string;
}