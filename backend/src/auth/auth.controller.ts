import {Public} from "@/auth/decorators/public.decorator";
import {Body, Controller, Post} from "@nestjs/common";

import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";

@Controller( "auth" ) export class AuthController
{
	public constructor( private readonly authService: AuthService ) {}

	@Public() @Post( "login" ) public login( @Body() dto: LoginDto )
	{
		return this.authService.login( dto );
	}
}