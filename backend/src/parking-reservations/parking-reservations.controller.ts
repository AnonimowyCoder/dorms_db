import {Roles} from "@/auth/decorators/roles.decorator";
import {GetAvailableParkingLotsDto} from "@/parking-lots/dto/get-available-parking-lots.dto";
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from "@nestjs/common";

import {CreateParkingReservationDto} from "./dto/create-parking-reservation.dto";
import {UpdateParkingReservationDto} from "./dto/update-parking-reservation.dto";
import {ParkingReservationsService} from "./parking-reservations.service";

@Roles( "admin", "manager" ) @Controller( "parking-reservations" ) export class ParkingReservationsController
{
	public constructor(
	    private readonly parkingReservationsService: ParkingReservationsService,
	)
	{}

	@Get() public findAll()
	{
		return this.parkingReservationsService.findAll();
	}

	@Get( "available" ) public findAvailableParkingLots( @Query() query: GetAvailableParkingLotsDto )
	{
		return this.parkingReservationsService.findAvailableParkingLots( query );
	}

	@Get( ":id" ) public findOne( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.parkingReservationsService.findOne( id );
	}

	@Post() public create( @Body() dto: CreateParkingReservationDto )
	{
		return this.parkingReservationsService.create( dto );
	}

	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateParkingReservationDto,
	)
	{
		return this.parkingReservationsService.update( id, dto );
	}

	@Delete( ":id" ) public remove( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.parkingReservationsService.remove( id );
	}
}