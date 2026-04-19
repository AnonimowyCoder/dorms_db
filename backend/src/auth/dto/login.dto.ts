import {getEnv} from "@/utility/get-env";
import {IsEmail, IsString, MinLength} from "class-validator";

export class LoginDto
{
	@IsEmail() email!: string;
	@IsString() @MinLength( getEnv( "MIN_PASSWORD_LENGTH", Number ) ) password!: string;
}