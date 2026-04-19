import {IsOptional, IsString} from "class-validator";

export class CreateResidentDto
{
	@IsString() first_name!: string;
	@IsString() last_name!: string;
	@IsOptional() @IsString() department?: string;
}