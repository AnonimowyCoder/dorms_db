import {CurrentUser} from "@/auth/decorators/current-user.decorator";
import {Roles} from "@/auth/decorators/roles.decorator";
import type {JwtUser} from "@/auth/types";
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from "@nestjs/common";

import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UsersService} from "./users.service";

@Roles( "admin" ) @Controller( "users" ) export class UsersController
{
	public constructor( private readonly usersService: UsersService ) {}

	@Get() public findAll()
	{
		return this.usersService.findAll();
	}

	@Get( ":id" )
	public findOne(
	    @Param( "id", ParseIntPipe ) id: number,
	)
	{
		return this.usersService.findOne( id );
	}

	@Post()
	public create(
	    @Body() dto: CreateUserDto,
	)
	{
		return this.usersService.create( dto );
	}

	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateUserDto,
	)
	{
		return this.usersService.update( id, dto );
	}

	@Delete( ":id" )
	public remove(
	    @Param( "id", ParseIntPipe ) id: number,
	    @CurrentUser() user: JwtUser,
	)
	{
		return this.usersService.remove( id, user );
	}
}