import {Roles} from "@/auth/decorators/roles.decorator";
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from "@nestjs/common";

import {CreateRoomCategoryDto} from "./dto/create-room-category.dto";
import {UpdateRoomCategoryDto} from "./dto/update-room-category.dto";
import {RoomCategoriesService} from "./room-categories.service";

@Controller( "room-categories" ) export class RoomCategoriesController
{
	public constructor(
	    private readonly roomCategoriesService: RoomCategoriesService,
	)
	{}

	@Roles( "admin", "manager" ) @Get() public findAll()
	{
		return this.roomCategoriesService.findAll();
	}

	@Roles( "admin", "manager" ) @Get( ":id" ) public findOne( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.roomCategoriesService.findOne( id );
	}

	@Roles( "admin" ) @Post() public create( @Body() dto: CreateRoomCategoryDto )
	{
		return this.roomCategoriesService.create( dto );
	}

	@Roles( "admin" )
	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateRoomCategoryDto,
	)
	{
		return this.roomCategoriesService.update( id, dto );
	}

	@Roles( "admin" ) @Delete( ":id" ) public remove( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.roomCategoriesService.remove( id );
	}
}