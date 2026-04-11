import {DatabaseService} from "@/database/database.service";
import {Injectable, NotFoundException} from "@nestjs/common";

import {CreateResidentDto} from "./dto/create-resident.dto";
import {UpdateResidentDto} from "./dto/update-resident.dto";

type ResidentRow = {
	id: number; first_name : string; last_name : string; department : string | null;
};

@Injectable() export class ResidentsService
{
	public constructor( private readonly databaseService: DatabaseService ) {}

	public async findAll(): Promise< ResidentRow[] >
	{
		return this.databaseService.queryMany< ResidentRow >(
		    `SELECT id, first_name, last_name, department
			 FROM residents
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< ResidentRow >
	{
		const resident = await this.databaseService.queryOne< ResidentRow >(
		    `SELECT id, first_name, last_name, department
			 FROM residents
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !resident )
		{
			throw new NotFoundException( `Resident with id ${id} not found` );
		}

		return resident;
	}

	public async create( dto: CreateResidentDto ): Promise< ResidentRow >
	{
		const resident = await this.databaseService.queryOne< ResidentRow >(
		    `INSERT INTO residents ( first_name, last_name, department )
			 VALUES ( $1, $2, $3 )
			 RETURNING id, first_name, last_name, department`,
		    [ dto.first_name, dto.last_name, dto.department ?? null ],
		);

		if ( !resident )
		{
			throw new Error( "Failed to create resident" );
		}

		return resident;
	}

	public async update(
	    id: number,
	    dto: UpdateResidentDto,
	    ): Promise< ResidentRow >
	{
		const existingResident = await this.findOne( id );
		const updatedResident  = await this.databaseService.queryOne< ResidentRow >(
		    `UPDATE residents
			 SET first_name = $2,
			     last_name = $3,
			     department = $4
			 WHERE id = $1
			 RETURNING id, first_name, last_name, department`,
		    [
			    id,
			    dto.first_name ?? existingResident.first_name,
			    dto.last_name ?? existingResident.last_name,
			    dto.department ?? existingResident.department,
		    ],
		);

		if ( !updatedResident )
		{
			throw new Error( "Failed to update resident" );
		}

		return updatedResident;
	}

	public async remove( id: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM residents
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException( `Resident with id ${id} not found` );
		}
	}
}