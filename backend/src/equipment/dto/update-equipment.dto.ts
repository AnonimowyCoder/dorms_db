import {IsInt, IsOptional, IsString, Min} from "class-validator";

export class UpdateEquipmentDto
{
	@IsOptional() @IsString() equipment_name?: string;
	@IsOptional() @IsString() description?: string;
	@IsOptional() @IsInt() @Min( 0 ) count?: number;
}