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

import {CreateRoomDto} from "./dto/create-room.dto";
import {UpdateRoomDto} from "./dto/update-room.dto";
import {RoomsService} from "./rooms.service";

@Roles( "admin", "manager" ) @Controller( "rooms" ) export class RoomsController
{
	public constructor( private readonly roomsService: RoomsService ) {}

	@Get() public findAll()
	{
		return this.roomsService.findAll();
	}

	@Get( "available" ) public findAvailable()
	{
		return this.roomsService.findAvailable();
	}

	@Get( ":id" ) public findOne( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.roomsService.findOne( id );
	}

	@Post() public create( @Body() dto: CreateRoomDto )
	{
		return this.roomsService.create( dto );
	}

	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateRoomDto,
	)
	{
		return this.roomsService.update( id, dto );
	}

	@Delete( ":id" ) public remove( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.roomsService.remove( id );
	}
}