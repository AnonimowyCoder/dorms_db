import {DatabaseService} from "@/database/database.service";
import {Injectable, NotFoundException} from "@nestjs/common";

import {CreateEquipmentDto} from "./dto/create-equipment.dto";
import {UpdateEquipmentDto} from "./dto/update-equipment.dto";
import {Equipment} from "./types";

@Injectable() export class EquipmentService
{
	public constructor( private readonly databaseService: DatabaseService ) {}

	public async findAll(): Promise< Equipment[] >
	{
		return this.databaseService.queryMany< Equipment >(
		    `SELECT id, equipment_name, description, id_signed_on_sticker
			 FROM equipment
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< Equipment >
	{
		const equipment = await this.databaseService.queryOne< Equipment >(
		    `SELECT id, equipment_name, description, id_signed_on_sticker
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
		    `INSERT INTO equipment ( equipment_name, description, id_signed_on_sticker )
			 VALUES ( $1, $2, $3 )
			 RETURNING id, equipment_name, description, id_signed_on_sticker`,
		    [
			    dto.equipment_name,
			    dto.description ?? null,
			    dto.id_signed_on_sticker ?? null,
		    ],
		);

		if ( !createdEquipment )
		{
			throw new Error( "Failed to create equipment" );
		}

		return createdEquipment;
	}

	public async update(
	    id: number,
	    dto: UpdateEquipmentDto,
	    ): Promise< Equipment >
	{
		const existingEquipment = await this.findOne( id );

		const updatedEquipment = await this.databaseService.queryOne< Equipment >(
		    `UPDATE equipment
			 SET equipment_name = $2,
			     description = $3,
			     id_signed_on_sticker = $4
			 WHERE id = $1
			 RETURNING id, equipment_name, description, id_signed_on_sticker`,
		    [
			    id,
			    dto.equipment_name ?? existingEquipment.equipment_name,
			    dto.description ?? existingEquipment.description,
			    dto.id_signed_on_sticker ?? existingEquipment.id_signed_on_sticker,
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
}