import {DatabaseService} from "@/database/database.service";
import {ParkingLotsService} from "@/parking-lots/parking-lots.service";
import {ResidentsService} from "@/residents/residents.service";
import {ensureDateRangeIsValid} from "@/utility/date-range";
import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";

import {CreateParkingReservationDto} from "./dto/create-parking-reservation.dto";
import {UpdateParkingReservationDto} from "./dto/update-parking-reservation.dto";
import {ParkingReservation} from "./types";

@Injectable() export class ParkingReservationsService
{
	public constructor(
	    private readonly databaseService: DatabaseService,
	    private readonly parkingLotsService: ParkingLotsService,
	    private readonly residentsService: ResidentsService,
	)
	{}

	public async findAll(): Promise< ParkingReservation[] >
	{
		return this.databaseService.queryMany< ParkingReservation >(
		    `SELECT id, start_date_reserv, end_date_reserv, id_parking_lot, id_resident
			 FROM parking_reservations
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< ParkingReservation >
	{
		const reservation = await this.databaseService.queryOne< ParkingReservation >(
		    `SELECT id, start_date_reserv, end_date_reserv, id_parking_lot, id_resident
			 FROM parking_reservations
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !reservation )
		{
			throw new NotFoundException(
			    `Parking reservation with id ${id} not found`,
			);
		}

		return reservation;
	}

	public async ensureExists( id: number ): Promise< void >
	{
		await this.findOne( id );
	}

	public async create(
	    dto: CreateParkingReservationDto,
	    ): Promise< ParkingReservation >
	{
		ensureDateRangeIsValid( dto.start_date_reserv, dto.end_date_reserv );
		await this.parkingLotsService.ensureExists( dto.id_parking_lot );
		await this.residentsService.ensureExists( dto.id_resident );
		await this.ensureIsAvailable( dto.id_parking_lot, dto.start_date_reserv, dto.end_date_reserv );

		const createdReservation = await this.databaseService.queryOne< ParkingReservation >(
		    `INSERT INTO parking_reservations (
				     start_date_reserv,
				     end_date_reserv,
				     id_parking_lot,
				     id_resident
				 )
				 VALUES ( $1, $2, $3, $4 )
				 RETURNING id, start_date_reserv, end_date_reserv, id_parking_lot, id_resident`,
		    [
			    dto.start_date_reserv,
			    dto.end_date_reserv,
			    dto.id_parking_lot,
			    dto.id_resident,
		    ],
		);

		if ( !createdReservation )
		{
			throw new Error( "Failed to create parking reservation" );
		}

		return createdReservation;
	}

	public async update(
	    id: number,
	    dto: UpdateParkingReservationDto,
	    ): Promise< ParkingReservation >
	{
		const existingReservation = await this.findOne( id );

		const nextStartDate    = dto.start_date_reserv ?? existingReservation.start_date_reserv;
		const nextEndDate      = dto.end_date_reserv ?? existingReservation.end_date_reserv;
		const nextParkingLotId = dto.id_parking_lot ?? existingReservation.id_parking_lot;
		const nextResidentId   = dto.id_resident ?? existingReservation.id_resident;

		ensureDateRangeIsValid( nextStartDate, nextEndDate );
		await this.parkingLotsService.ensureExists( nextParkingLotId );
		await this.residentsService.ensureExists( nextResidentId );
		await this.ensureIsAvailable( nextParkingLotId, nextStartDate, nextEndDate, id );

		const updatedReservation = await this.databaseService.queryOne< ParkingReservation >(
		    `UPDATE parking_reservations
				 SET start_date_reserv = $2,
				     end_date_reserv = $3,
				     id_parking_lot = $4,
				     id_resident = $5
				 WHERE id = $1
				 RETURNING id, start_date_reserv, end_date_reserv, id_parking_lot, id_resident`,
		    [
			    id,
			    nextStartDate,
			    nextEndDate,
			    nextParkingLotId,
			    nextResidentId,
		    ],
		);

		if ( !updatedReservation )
		{
			throw new Error( "Failed to update parking reservation" );
		}

		return updatedReservation;
	}

	public async remove( id: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM parking_reservations
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException(
			    `Parking reservation with id ${id} not found`,
			);
		}
	}

	private async ensureIsAvailable(
	    parkingLotId: number,
	    start_date_reserv: string,
	    end_date_reserv: string,
	    excludeReservationId?: number,
	    ): Promise< void >
	{
		const overlappingCount = await this.databaseService.queryValue< number >(
		    `SELECT COUNT(*)::int
			 FROM parking_reservations
			 WHERE id_parking_lot = $1
			   AND daterange(start_date_reserv, end_date_reserv, '[]')
			       && daterange($2::date, $3::date, '[]')
			   AND ($4::int IS NULL OR id <> $4::int)`,
		    [
			    parkingLotId,
			    start_date_reserv,
			    end_date_reserv,
			    excludeReservationId ?? null,
		    ],
		);

		if ( ( overlappingCount ?? 0 ) > 0 )
		{
			throw new BadRequestException(
			    "Parking lot is not available in the selected period",
			);
		}
	}
}