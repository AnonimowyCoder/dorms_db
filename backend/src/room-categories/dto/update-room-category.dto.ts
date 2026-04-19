import {IsBoolean, IsNumber, IsOptional, IsString, Min} from "class-validator";

export class UpdateRoomCategoryDto
{
	@IsOptional() @IsNumber() @Min( 0 ) monthly_rent?: number;
	@IsOptional() @IsBoolean() if_kitchen?: boolean;
	@IsOptional() @IsString() category_name?: string;
}