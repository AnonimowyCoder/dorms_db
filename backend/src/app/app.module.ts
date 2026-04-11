import {DatabaseModule} from "@/database/database.module";
import {ResidentsModule} from "@/residents/residents.module";
import {UsersModule} from "@/users/users.module";
import {Module} from "@nestjs/common";

@Module( {
	imports : [
		DatabaseModule,
		UsersModule,
		ResidentsModule,
	],
} )
export class AppModule
{}