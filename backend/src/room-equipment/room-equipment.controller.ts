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

import {CreateRoomEquipmentDto} from "./dto/create-room-equipment.dto";
import {UpdateRoomEquipmentDto} from "./dto/update-room-equipment.dto";
import {RoomEquipmentService} from "./room-equipment.service";

@Roles( "admin", "manager" ) @Controller( "room-equipment" ) export class RoomEquipmentController
{
	public constructor(
	    private readonly roomEquipmentService: RoomEquipmentService,
	)
	{}

	@Get() public findAll()
	{
		return this.roomEquipmentService.findAll();
	}

	@Patch( "room/:roomId/equipment/:equipmentId" )
	public update(
	    @Param( "roomId", ParseIntPipe ) roomId: number,
	    @Param( "equipmentId", ParseIntPipe ) equipmentId: number,
	    @Body() dto: UpdateRoomEquipmentDto,
	)
	{
		return this.roomEquipmentService.update(
		    roomId,
		    equipmentId,
		    dto.count,
		);
	}

	@Get( "room/:roomId" ) public findByRoom( @Param( "roomId", ParseIntPipe ) roomId: number )
	{
		return this.roomEquipmentService.findByRoom( roomId );
	}

	@Get( "equipment/:equipmentId" )
	public findByEquipment(
	    @Param( "equipmentId", ParseIntPipe ) equipmentId: number,
	)
	{
		return this.roomEquipmentService.findByEquipment( equipmentId );
	}

	@Post() public create( @Body() dto: CreateRoomEquipmentDto )
	{
		return this.roomEquipmentService.create( dto );
	}

	@Delete( "room/:roomId/equipment/:equipmentId" )
	public remove(
	    @Param( "roomId", ParseIntPipe ) roomId: number,
	    @Param( "equipmentId", ParseIntPipe ) equipmentId: number,
	)
	{
		return this.roomEquipmentService.remove( roomId, equipmentId );
	}
}