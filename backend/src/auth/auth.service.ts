import {UsersService} from "@/users/users.service";
import {
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import {LoginDto} from "./dto/login.dto";
import {JwtPayload} from "./types";

type LoginResponse = {
	access_token: string; user : { id : number; email : string; role : string; };
};

@Injectable() export class AuthService
{
	public constructor(
	    private readonly userService: UsersService,
	    private readonly jwtService: JwtService,
	)
	{}

	public async login( dto: LoginDto ): Promise< LoginResponse >
	{
		const user = await this.userService.findByEmail( dto.email );
		if ( !user )
		{
			throw new UnauthorizedException( "Invalid credentials" );
		}

		const passwordMatches = await bcrypt.compare(
		    dto.password,
		    user.password_hash,
		);

		if ( !passwordMatches )
		{
			throw new UnauthorizedException( "Invalid credentials" );
		}

		const payload: JwtPayload = {
			sub : user.id,
			email : user.email,
			role : user.role,
		};

		const accessToken = await this.jwtService.signAsync( payload );

		return {
			access_token : accessToken,
			user : {
				id : user.id,
				email : user.email,
				role : user.role,
			},
		};
	}
}