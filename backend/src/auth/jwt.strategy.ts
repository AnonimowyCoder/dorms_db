import {getEnv} from "@/utility/get-env";
import {
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";

import {JwtPayload} from "./types";

@Injectable() export class JwtStrategy extends PassportStrategy
( Strategy )
{
	public constructor()
	{
		super( {
			jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration : false,
			secretOrKey : getEnv( "JWT_SECRET", String ),
		} );
	}

	public validate( payload: JwtPayload ): JwtPayload
	{
		if ( !payload.sub || !payload.email || !payload.role )
		{
			throw new UnauthorizedException( "Invalid token payload" );
		}

		return payload;
	}
}