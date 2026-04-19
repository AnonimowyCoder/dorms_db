import {IsOptional, IsString} from "class-validator";

export class UpdateResidentDto
{
	@IsOptional() @IsString() first_name?: string;
	@IsOptional() @IsString() last_name?: string;
	@IsOptional() @IsString() department?: string;
}