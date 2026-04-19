import {Roles} from "@/auth/decorators/roles.decorator";
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from "@nestjs/common";

import {CreateParkingPaymentDto} from "./dto/create-parking-payment.dto";
import {UpdateParkingPaymentDto} from "./dto/update-parking-payment.dto";
import {ParkingPaymentsService} from "./parking-payments.service";

@Roles( "admin", "manager" ) @Controller( "parking-payments" ) export class ParkingPaymentsController
{
	public constructor(
	    private readonly parkingPaymentsService: ParkingPaymentsService,
	)
	{}

	@Get() public findAll()
	{
		return this.parkingPaymentsService.findAll();
	}

	@Get( ":id" ) public findOne( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.parkingPaymentsService.findOne( id );
	}

	@Post() public create( @Body() dto: CreateParkingPaymentDto )
	{
		return this.parkingPaymentsService.create( dto );
	}

	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateParkingPaymentDto,
	)
	{
		return this.parkingPaymentsService.update( id, dto );
	}

	@Delete( ":id" ) public remove( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.parkingPaymentsService.remove( id );
	}
}