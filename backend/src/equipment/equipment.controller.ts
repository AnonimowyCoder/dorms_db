import {Roles} from "@/auth/decorators/roles.decorator";
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from "@nestjs/common";

import {CreateEquipmentDto} from "./dto/create-equipment.dto";
import {UpdateEquipmentDto} from "./dto/update-equipment.dto";
import {EquipmentService} from "./equipment.service";

@Roles( "admin", "manager" ) @Controller( "equipment" ) export class EquipmentController
{
	public constructor( private readonly equipmentService: EquipmentService ) {}

	@Get() public findAll()
	{
		return this.equipmentService.findAll();
	}

	@Get( ":id" ) public findOne( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.equipmentService.findOne( id );
	}

	@Post() public create( @Body() dto: CreateEquipmentDto )
	{
		return this.equipmentService.create( dto );
	}

	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateEquipmentDto,
	)
	{
		return this.equipmentService.update( id, dto );
	}

	@Delete( ":id" ) public remove( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.equipmentService.remove( id );
	}
}