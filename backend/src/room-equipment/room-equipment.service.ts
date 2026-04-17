import {DatabaseService} from "@/database/database.service";
import {EquipmentService} from "@/equipment/equipment.service";
import {RoomsService} from "@/rooms/rooms.service";
import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";

import {CreateRoomEquipmentDto} from "./dto/create-room-equipment.dto";
import {RoomEquipment, RoomEquipmentDetails} from "./types";

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
			     e.description,
			     re.count
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
			     e.description,
			     re.count
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
			     e.description,
			     re.count
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

	public async create( dto: CreateRoomEquipmentDto ): Promise< RoomEquipment >
	{
		const requestedCount = dto.count ?? 1;

		await this.roomsService.ensureExists( dto.id_room );
		await this.equipmentService.ensureExists( dto.id_equipment );
		await this.ensureEquipmentIsAvailable( dto.id_equipment, requestedCount );

		const assignment = await this.databaseService.queryOne< RoomEquipment >(
		    `INSERT INTO room_equipment ( id_room, id_equipment, count )
			 VALUES ( $1, $2, $3 )
			 ON CONFLICT ( id_room, id_equipment )
			 DO UPDATE
			 SET count = room_equipment.count + EXCLUDED.count
			 RETURNING id_room, id_equipment, count`,
		    [ dto.id_room, dto.id_equipment, requestedCount ],
		);

		if ( !assignment )
		{
			throw new Error( "Failed to assign equipment to room" );
		}

		return assignment;
	}

	public async remove( roomId: number, equipmentId: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM room_equipment
			 WHERE id_room = $1
			   AND id_equipment = $2`,
		    [ roomId, equipmentId ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
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
			     COALESCE( SUM( re.count ), 0 )::int AS assigned_count
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

	public async update(
	    roomId: number,
	    equipmentId: number,
	    count: number,
	    ): Promise< RoomEquipment >
	{
		await this.findOne( roomId, equipmentId );
		await this.ensureUpdatedEquipmentCountIsAvailable(
		    equipmentId,
		    roomId,
		    count,
		);

		const updatedAssignment = await this.databaseService.queryOne< RoomEquipment >(
		    `UPDATE room_equipment
		 SET count = $3
		 WHERE id_room = $1
		   AND id_equipment = $2
		 RETURNING id_room, id_equipment, count`,
		    [ roomId, equipmentId, count ],
		);

		if ( !updatedAssignment )
		{
			throw new Error( "Failed to update room equipment assignment" );
		}

		return updatedAssignment;
	}

	private async ensureUpdatedEquipmentCountIsAvailable(
	    equipmentId: number,
	    roomId: number,
	    newCount: number,
	    ): Promise< void >
	{
		const currentAssignment = await this.findOne( roomId, equipmentId );

		if ( newCount <= currentAssignment.count )
		{
			return;
		}

		const additionalNeeded = newCount - currentAssignment.count;

		const availability = await this.databaseService.queryOne< { total_count : number; assigned_count : number; } >(
		    `SELECT
             e.count AS total_count,
             COALESCE( SUM( re.count ), 0 )::int AS assigned_count
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

		if ( additionalNeeded > availableCount )
		{
			throw new BadRequestException(
			    `Only ${availableCount} additional unit(s) of this equipment are available`,
			);
		}
	}

	public async findOne(
	    roomId: number,
	    equipmentId: number,
	    ): Promise< RoomEquipment >
	{
		const assignment = await this.databaseService.queryOne< RoomEquipment >(
		    `SELECT id_room, id_equipment, count
		 FROM room_equipment
		 WHERE id_room = $1
		   AND id_equipment = $2`,
		    [ roomId, equipmentId ],
		);

		if ( !assignment )
		{
			throw new NotFoundException(
			    `Room equipment assignment not found for room ${roomId} and equipment ${equipmentId}`,
			);
		}

		return assignment;
	}
}