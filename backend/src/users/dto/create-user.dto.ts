import {IsEmail, IsIn, IsString} from "class-validator";

export class CreateUserDto
{
	@IsEmail() email!: string;
	@IsString() password!: string;
	@IsString() @IsIn( [ "admin", "manager" ] ) role!: string;
}