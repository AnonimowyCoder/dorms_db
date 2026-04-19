import {IsInt, IsOptional, IsString, Min} from "class-validator";

export class CreateEquipmentDto
{
	@IsString() equipment_name!: string;
	@IsOptional() @IsString() description?: string;
	@IsInt() @Min( 0 ) count!: number;
}