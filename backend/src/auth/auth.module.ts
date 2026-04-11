import {UsersModule} from "@/users/users.module";
import {getEnv} from "@/utility/get-env";
import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";

import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./jwt.strategy";

@Module( {
	imports : [
		UsersModule,
		JwtModule.register( {
			secret : getEnv( "JWT_SECRET", String ),
			signOptions : {
				expiresIn : getEnv( "JWT_EXPIRES_IN", Number ),
			},
		} ),
	],
	controllers : [ AuthController ],
	providers : [
		AuthService,
		JwtStrategy,
	],
	exports : [ AuthService ],
} )
export class AuthModule
{}