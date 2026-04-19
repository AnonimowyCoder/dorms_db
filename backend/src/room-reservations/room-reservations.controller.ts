import {Roles} from "@/auth/decorators/roles.decorator";
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from "@nestjs/common";

import {CreateRoomReservationDto} from "./dto/create-room-reservation.dto";
import {GetAvailableRoomsDto} from "./dto/get-available-rooms.dto";
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

	@Get( "available" ) public findAvailableRooms( @Query() query: GetAvailableRoomsDto )
	{
		return this.roomReservationsService.findAvailableRooms( query );
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