import {Roles} from "@/auth/decorators/roles.decorator";
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from "@nestjs/common";

import {CreateParkingLotDto} from "./dto/create-parking-lot.dto";
import {UpdateParkingLotDto} from "./dto/update-parking-lot.dto";
import {ParkingLotsService} from "./parking-lots.service";

@Roles( "admin", "manager" ) @Controller( "parking-lots" ) export class ParkingLotsController
{
	public constructor( private readonly parkingLotsService: ParkingLotsService ) {}

	@Get() public findAll()
	{
		return this.parkingLotsService.findAll();
	}

	@Get( ":id" ) public findOne( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.parkingLotsService.findOne( id );
	}

	@Post() public create( @Body() dto: CreateParkingLotDto )
	{
		return this.parkingLotsService.create( dto );
	}

	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateParkingLotDto,
	)
	{
		return this.parkingLotsService.update( id, dto );
	}

	@Delete( ":id" ) public remove( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.parkingLotsService.remove( id );
	}
}