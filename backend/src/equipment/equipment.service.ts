import {DatabaseService} from "@/database/database.service";
import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";

import {CreateEquipmentDto} from "./dto/create-equipment.dto";
import {UpdateEquipmentDto} from "./dto/update-equipment.dto";
import {Equipment} from "./types";

@Injectable() export class EquipmentService
{
	public constructor( private readonly databaseService: DatabaseService ) {}

	public async findAll(): Promise< Equipment[] >
	{
		return this.databaseService.queryMany< Equipment >(
		    `SELECT id, equipment_name, description, count
			 FROM equipment
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< Equipment >
	{
		const equipment = await this.databaseService.queryOne< Equipment >(
		    `SELECT id, equipment_name, description, count
			 FROM equipment
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !equipment )
		{
			throw new NotFoundException( `Equipment with id ${id} not found` );
		}

		return equipment;
	}

	public async ensureExists( id: number ): Promise< void >
	{
		await this.findOne( id );
	}

	public async create( dto: CreateEquipmentDto ): Promise< Equipment >
	{
		const createdEquipment = await this.databaseService.queryOne< Equipment >(
		    `INSERT INTO equipment ( equipment_name, description, count )
			 VALUES ( $1, $2, $3 )
			 RETURNING id, equipment_name, description, count`,
		    [
			    dto.equipment_name,
			    dto.description ?? null,
			    dto.count,
		    ],
		);

		if ( !createdEquipment )
		{
			throw new Error( "Failed to create equipment" );
		}

		return createdEquipment;
	}

	public async update( id: number, dto: UpdateEquipmentDto ): Promise< Equipment >
	{
		const existingEquipment = await this.findOne( id );

		if ( dto.count !== undefined && dto.count !== null )
			await this.ensureCountIsNotBelowAssigned( id, dto.count );

		const updatedEquipment = await this.databaseService.queryOne< Equipment >(
		    `UPDATE equipment
			 SET equipment_name = $2,
			     description = $3,
			     count = $4
			 WHERE id = $1
			 RETURNING id, equipment_name, description, count`,
		    [
			    id,
			    dto.equipment_name ?? existingEquipment.equipment_name,
			    dto.description ?? existingEquipment.description,
			    dto.count ?? existingEquipment.count,
		    ],
		);

		if ( !updatedEquipment )
		{
			throw new Error( "Failed to update equipment" );
		}

		return updatedEquipment;
	}

	public async remove( id: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM equipment
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException( `Equipment with id ${id} not found` );
		}
	}

	public async getAvailableCount( id: number ): Promise< number >
	{
		await this.ensureExists( id );

		const availableCount = await this.databaseService.queryValue< number >(
		    `SELECT
		     ( e.count - COALESCE( SUM( re.count ), 0 ) )::int
		 FROM equipment e
		 LEFT JOIN room_equipment re
		   ON re.id_equipment = e.id
		 WHERE e.id = $1
		 GROUP BY e.id, e.count`,
		    [ id ],
		);

		return availableCount ?? 0;
	}

	private async ensureCountIsNotBelowAssigned(
	    equipmentId: number,
	    newTotalCount: number,
	    ): Promise< void >
	{
		const assignedCount = await this.databaseService.queryValue< number >(
		    `SELECT COALESCE( SUM( count ), 0 )::int
		 FROM room_equipment
		 WHERE id_equipment = $1`,
		    [ equipmentId ],
		);

		if ( newTotalCount < ( assignedCount ?? 0 ) )
		{
			throw new BadRequestException(
			    `Equipment count cannot be lower than already assigned count (${assignedCount ?? 0})`,
			);
		}
	}
}