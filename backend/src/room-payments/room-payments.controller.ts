import {Roles} from "@/auth/decorators/roles.decorator";
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from "@nestjs/common";

import {CreateRoomPaymentDto} from "./dto/create-room-payment.dto";
import {UpdateRoomPaymentDto} from "./dto/update-room-payment.dto";
import {RoomPaymentsService} from "./room-payments.service";

@Roles( "admin", "manager" ) @Controller( "room-payments" ) export class RoomPaymentsController
{
	public constructor(
	    private readonly roomPaymentsService: RoomPaymentsService,
	)
	{}

	@Get() public findAll()
	{
		return this.roomPaymentsService.findAll();
	}

	@Get( ":id" ) public findOne( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.roomPaymentsService.findOne( id );
	}

	@Post() public create( @Body() dto: CreateRoomPaymentDto )
	{
		return this.roomPaymentsService.create( dto );
	}

	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateRoomPaymentDto,
	)
	{
		return this.roomPaymentsService.update( id, dto );
	}

	@Delete( ":id" ) public remove( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.roomPaymentsService.remove( id );
	}
}