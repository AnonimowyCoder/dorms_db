import {IsEmail, IsIn, IsOptional, IsString} from "class-validator";

export class UpdateUserDto
{
	@IsOptional() @IsEmail() email?: string;
	@IsOptional() @IsString() password?: string;
	@IsOptional() @IsString() @IsIn( [ "admin", "manager" ] ) role?: string;
}