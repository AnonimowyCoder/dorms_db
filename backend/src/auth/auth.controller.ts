import {Public} from "@/auth/decorators/public.decorator";
import type {PublicUser} from "@/users/types";
import {Body, Controller, Get, Post} from "@nestjs/common";

import {AuthService} from "./auth.service";
import {CurrentUser} from "./decorators/current-user.decorator";
import {LoginDto} from "./dto/login.dto";

@Controller( "auth" ) export class AuthController
{
	public constructor( private readonly authService: AuthService ) {}

	@Public() @Post( "login" ) public login( @Body() dto: LoginDto )
	{
		return this.authService.login( dto );
	}

	@Get( "me" ) public me( @CurrentUser() user: PublicUser )
	{
		return user;
	}
}