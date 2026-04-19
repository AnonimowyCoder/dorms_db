import {AuthModule} from "@/auth/auth.module";
import {JwtAuthGuard} from "@/auth/guards/jwt-auth.guard";
import {RolesGuard} from "@/auth/guards/roles.guard";
import {DatabaseModule} from "@/database/database.module";
import {EquipmentModule} from "@/equipment/equipment.module";
import {HealthModule} from "@/health/health.module";
import {ParkingLotsModule} from "@/parking-lots/parking-lots.module";
import {ParkingPaymentsModule} from "@/parking-payments/parking-payments.module";
import {ParkingReservationsModule} from "@/parking-reservations/parking-reservations.module";
import {ResidentsModule} from "@/residents/residents.module";
import {RoomCategoriesModule} from "@/room-categories/room-categories.module";
import {RoomEquipmentModule} from "@/room-equipment/room-equipment.module";
import {RoomPaymentsModule} from "@/room-payments/room-payments.module";
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
		EquipmentModule,
		HealthModule,
		ParkingLotsModule,
		ParkingPaymentsModule,
		ParkingReservationsModule,
		ResidentsModule,
		RoomCategoriesModule,
		RoomEquipmentModule,
		RoomPaymentsModule,
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