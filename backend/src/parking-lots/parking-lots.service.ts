import {DatabaseService} from "@/database/database.service";
import {Injectable, NotFoundException} from "@nestjs/common";

import {CreateParkingLotDto} from "./dto/create-parking-lot.dto";
import {UpdateParkingLotDto} from "./dto/update-parking-lot.dto";
import {ParkingLot} from "./types";

@Injectable() export class ParkingLotsService
{
	public constructor( private readonly databaseService: DatabaseService ) {}

	public async findAll(): Promise< ParkingLot[] >
	{
		return this.databaseService.queryMany< ParkingLot >(
		    `SELECT id, parking_lot_type, placement
			 FROM parking_lots
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< ParkingLot >
	{
		const parkingLot = await this.databaseService.queryOne< ParkingLot >(
		    `SELECT id, parking_lot_type, placement
			 FROM parking_lots
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !parkingLot )
		{
			throw new NotFoundException( `Parking lot with id ${id} not found` );
		}

		return parkingLot;
	}

	public async ensureExists( id: number ): Promise< void >
	{
		await this.findOne( id );
	}

	public async create( dto: CreateParkingLotDto ): Promise< ParkingLot >
	{
		const createdParkingLot = await this.databaseService.queryOne< ParkingLot >(
		    `INSERT INTO parking_lots ( parking_lot_type, placement )
			 VALUES ( $1, $2 )
			 RETURNING id, parking_lot_type, placement`,
		    [
			    dto.parking_lot_type ?? null,
			    dto.placement ?? null,
		    ],
		);

		if ( !createdParkingLot )
		{
			throw new Error( "Failed to create parking lot" );
		}

		return createdParkingLot;
	}

	public async update(
	    id: number,
	    dto: UpdateParkingLotDto,
	    ): Promise< ParkingLot >
	{
		const existingParkingLot = await this.findOne( id );

		const updatedParkingLot = await this.databaseService.queryOne< ParkingLot >(
		    `UPDATE parking_lots
			 SET parking_lot_type = $2,
			     placement = $3
			 WHERE id = $1
			 RETURNING id, parking_lot_type, placement`,
		    [
			    id,
			    dto.parking_lot_type ?? existingParkingLot.parking_lot_type,
			    dto.placement ?? existingParkingLot.placement,
		    ],
		);

		if ( !updatedParkingLot )
		{
			throw new Error( "Failed to update parking lot" );
		}

		return updatedParkingLot;
	}

	public async remove( id: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM parking_lots
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException( `Parking lot with id ${id} not found` );
		}
	}
}