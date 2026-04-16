import {DatabaseService} from "@/database/database.service";
import {EquipmentService} from "@/equipment/equipment.service";
import {RoomsService} from "@/rooms/rooms.service";
import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";

import {CreateRoomEquipmentDto} from "./dto/create-room-equipment.dto";
import {RoomEquipmentAssignmentResult, RoomEquipmentDetails} from "./types";

@Injectable() export class RoomEquipmentService
{
	public constructor(
	    private readonly databaseService: DatabaseService,
	    private readonly roomsService: RoomsService,
	    private readonly equipmentService: EquipmentService,
	)
	{}

	public async findAll(): Promise< RoomEquipmentDetails[] >
	{
		return this.databaseService.queryMany< RoomEquipmentDetails >(
		    `SELECT
			     re.id_room,
			     r.room_number,
			     re.id_equipment,
			     e.equipment_name,
			     e.description
			 FROM room_equipment re
			 JOIN rooms r
			   ON r.id = re.id_room
			 JOIN equipment e
			   ON e.id = re.id_equipment
			 ORDER BY re.id_room ASC, re.id_equipment ASC`,
		);
	}

	public async findByRoom( roomId: number ): Promise< RoomEquipmentDetails[] >
	{
		await this.roomsService.ensureExists( roomId );

		return this.databaseService.queryMany< RoomEquipmentDetails >(
		    `SELECT
			     re.id_room,
			     r.room_number,
			     re.id_equipment,
			     e.equipment_name,
			     e.description
			 FROM room_equipment re
			 JOIN rooms r
			   ON r.id = re.id_room
			 JOIN equipment e
			   ON e.id = re.id_equipment
			 WHERE re.id_room = $1
			 ORDER BY re.id_equipment ASC`,
		    [ roomId ],
		);
	}

	public async findByEquipment( equipmentId: number ): Promise< RoomEquipmentDetails[] >
	{
		await this.equipmentService.ensureExists( equipmentId );

		return this.databaseService.queryMany< RoomEquipmentDetails >(
		    `SELECT
			     re.id_room,
			     r.room_number,
			     re.id_equipment,
			     e.equipment_name,
			     e.description
			 FROM room_equipment re
			 JOIN rooms r
			   ON r.id = re.id_room
			 JOIN equipment e
			   ON e.id = re.id_equipment
			 WHERE re.id_equipment = $1
			 ORDER BY re.id_room ASC`,
		    [ equipmentId ],
		);
	}

	public async create(
	    dto: CreateRoomEquipmentDto,
	    ): Promise< RoomEquipmentAssignmentResult >
	{
		const requestedCount = dto.count ?? 1;

		await this.roomsService.ensureExists( dto.id_room );
		await this.equipmentService.ensureExists( dto.id_equipment );
		await this.ensureEquipmentIsAvailable( dto.id_equipment, requestedCount );

		await this.databaseService.withTransaction< void >( async ( client ) => {
			for ( let i = 0; i < requestedCount; ++i )
			{
				await client.query(
				    `INSERT INTO room_equipment ( id_room, id_equipment )
				 VALUES ( $1, $2 )`,
				    [ dto.id_room, dto.id_equipment ],
				);
			}
		} );

		return {
			id_room : dto.id_room,
			id_equipment : dto.id_equipment,
			assigned_count : requestedCount,
		};
	}

	public async remove( roomId: number, equipmentId: number ): Promise< void >
	{
		const deleted = await this.databaseService.query(
		    `DELETE FROM room_equipment
			 WHERE ctid IN (
			     SELECT ctid
			     FROM room_equipment
			     WHERE id_room = $1
			       AND id_equipment = $2
			     LIMIT 1
			 )`,
		    [ roomId, equipmentId ],
		);

		if ( ( deleted.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException(
			    `Room equipment assignment not found for room ${roomId} and equipment ${equipmentId}`,
			);
		}
	}

	private async ensureEquipmentIsAvailable(
	    equipmentId: number,
	    requestedCount: number,
	    ): Promise< void >
	{
		const availability = await this.databaseService.queryOne< { total_count : number; assigned_count : number; } >(
		    `SELECT
		     e.count AS total_count,
		     COUNT( re.id_equipment )::int AS assigned_count
		 FROM equipment e
		 LEFT JOIN room_equipment re
		   ON re.id_equipment = e.id
		 WHERE e.id = $1
		 GROUP BY e.id, e.count`,
		    [ equipmentId ],
		);

		if ( !availability )
		{
			throw new NotFoundException(
			    `Equipment with id ${equipmentId} not found`,
			);
		}

		const availableCount = availability.total_count - availability.assigned_count;

		if ( requestedCount > availableCount )
		{
			throw new BadRequestException(
			    `Only ${availableCount} unassigned unit(s) of this equipment are available`,
			);
		}
	}
}