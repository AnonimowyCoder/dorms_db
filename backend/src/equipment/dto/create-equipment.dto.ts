import {IsInt, IsOptional, IsString, Min} from "class-validator";

export class CreateEquipmentDto
{
	@IsString() equipment_name!: string;
	@IsOptional() @IsString() description?: string;
	@IsOptional() @IsInt() @Min( 1 ) id_signed_on_sticker?: number;
}