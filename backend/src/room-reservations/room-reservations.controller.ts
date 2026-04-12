import {Roles} from "@/auth/decorators/roles.decorator";
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from "@nestjs/common";

import {CreateRoomReservationDto} from "./dto/create-room-reservation.dto";
import {UpdateRoomReservationDto} from "./dto/update-room-reservation.dto";
import {RoomReservationsService} from "./room-reservations.service";

@Roles( "admin", "manager" ) @Controller( "room-reservations" ) export class RoomReservationsController
{
	public constructor(
	    private readonly roomReservationsService: RoomReservationsService,
	)
	{}

	@Get() public findAll()
	{
		return this.roomReservationsService.findAll();
	}

	@Get( ":id" ) public findOne( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.roomReservationsService.findOne( id );
	}

	@Post() public create( @Body() dto: CreateRoomReservationDto )
	{
		return this.roomReservationsService.create( dto );
	}

	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateRoomReservationDto,
	)
	{
		return this.roomReservationsService.update( id, dto );
	}

	@Delete( ":id" ) public remove( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.roomReservationsService.remove( id );
	}
}