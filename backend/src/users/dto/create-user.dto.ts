import {getEnv} from "@/utility/get-env";
import {IsEmail, IsIn, IsString, MinLength} from "class-validator";

export class CreateUserDto
{
	@IsEmail() email!: string;
	@IsString() @MinLength( getEnv( "MIN_PASSWORD_LENGTH", Number ) ) password!: string;
	@IsString() @IsIn( [ "admin", "manager" ] ) role!: string;
}