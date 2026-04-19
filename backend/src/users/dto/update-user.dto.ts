import {getEnv} from "@/utility/get-env";
import {IsEmail, IsIn, IsOptional, IsString, MinLength} from "class-validator";

export class UpdateUserDto
{
	@IsOptional() @IsEmail() email?: string;
	@IsOptional() @IsString() @MinLength( getEnv( "MIN_PASSWORD_LENGTH", Number ) ) password?: string;
	@IsOptional() @IsString() @IsIn( [ "admin", "manager" ] ) role?: string;
}