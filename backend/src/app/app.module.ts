import {AuthModule} from "@/auth/auth.module";
import {JwtAuthGuard} from "@/auth/guards/jwt-auth.guard";
import {RolesGuard} from "@/auth/guards/roles.guard";
import {DatabaseModule} from "@/database/database.module";
import {ResidentsModule} from "@/residents/residents.module";
import {RoomCategoriesModule} from "@/room-categories/room-categories.module";
import {RoomReservationsModule} from "@/room-reservations/room-reservations.module";
import {RoomsModule} from "@/rooms/rooms.module";
import {UsersModule} from "@/users/users.module";
import {Module} from "@nestjs/common";
import {APP_GUARD} from "@nestjs/core";

import {AppController} from "./app.controller";
import {AppService} from "./app.service";

@Module( {
	imports : [
		AuthModule,
		DatabaseModule,
		ResidentsModule,
		RoomCategoriesModule,
		RoomReservationsModule,
		RoomsModule,
		UsersModule,
	],
	controllers : [ AppController ],
	providers : [
		AppService,
		{
			provide : APP_GUARD,
			useClass : JwtAuthGuard,
		},
		{
			provide : APP_GUARD,
			useClass : RolesGuard,
		},
	],
} )
export class AppModule
{}