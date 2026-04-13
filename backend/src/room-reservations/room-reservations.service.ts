import {DatabaseService} from "@/database/database.service";
import {ResidentsService} from "@/residents/residents.service";
import {RoomsService} from "@/rooms/rooms.service";
import {ensureDateRangeIsValid} from "@/utility/date-range";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

import {CreateRoomReservationDto} from "./dto/create-room-reservation.dto";
import {UpdateRoomReservationDto} from "./dto/update-room-reservation.dto";
import {RoomReservation} from "./types";

@Injectable() export class RoomReservationsService
{
	public constructor(
	    private readonly databaseService: DatabaseService,
	    private readonly roomsService: RoomsService,
	    private readonly residentsService: ResidentsService,
	)
	{}

	public async findAll(): Promise< RoomReservation[] >
	{
		return this.databaseService.queryMany< RoomReservation >(
		    `SELECT id, start_date_reserv, end_date_reserv, id_room, id_resident
			 FROM room_reservations
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< RoomReservation >
	{
		const reservation = await this.databaseService.queryOne< RoomReservation >(
		    `SELECT id, start_date_reserv, end_date_reserv, id_room, id_resident
			 FROM room_reservations
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !reservation )
		{
			throw new NotFoundException(
			    `Room reservation with id ${id} not found`,
			);
		}

		return reservation;
	}

	public async create(
	    dto: CreateRoomReservationDto,
	    ): Promise< RoomReservation >
	{
		ensureDateRangeIsValid( dto.start_date_reserv, dto.end_date_reserv );
		await this.roomsService.ensureExists( dto.id_room );
		await this.residentsService.ensureExists( dto.id_resident );
		await this.ensureIsAvailable( dto.id_room, dto.start_date_reserv, dto.end_date_reserv );

		const created = await this.databaseService.queryOne< RoomReservation >(
		    `INSERT INTO room_reservations (
			     start_date_reserv,
			     end_date_reserv,
			     id_room,
			     id_resident
			 )
			 VALUES ( $1, $2, $3, $4 )
			 RETURNING id, start_date_reserv, end_date_reserv, id_room, id_resident`,
		    [
			    dto.start_date_reserv,
			    dto.end_date_reserv,
			    dto.id_room,
			    dto.id_resident,
		    ],
		);

		if ( !created )
		{
			throw new Error( "Failed to create reservation" );
		}

		return created;
	}

	public async update(
	    id: number,
	    dto: UpdateRoomReservationDto,
	    ): Promise< RoomReservation >
	{
		const existingReservation = await this.findOne( id );

		const nextStartDate  = dto.start_date_reserv ?? existingReservation.start_date_reserv;
		const nextEndDate    = dto.end_date_reserv ?? existingReservation.end_date_reserv;
		const nextRoomId     = dto.id_room ?? existingReservation.id_room;
		const nextResidentId = dto.id_resident ?? existingReservation.id_resident;

		ensureDateRangeIsValid( nextStartDate, nextEndDate );
		await this.roomsService.ensureExists( nextRoomId );
		await this.residentsService.ensureExists( nextResidentId );
		await this.ensureIsAvailable( nextRoomId, nextStartDate, nextEndDate, id );

		const updatedReservation = await this.databaseService.queryOne< RoomReservation >(
		    `UPDATE room_reservations
		 SET start_date_reserv = $2,
		     end_date_reserv = $3,
		     id_room = $4,
		     id_resident = $5
		 WHERE id = $1
		 RETURNING id, start_date_reserv, end_date_reserv, id_room, id_resident`,
		    [
			    id,
			    nextStartDate,
			    nextEndDate,
			    nextRoomId,
			    nextResidentId,
		    ],
		);

		if ( !updatedReservation )
		{
			throw new Error( "Failed to update reservation" );
		}

		return updatedReservation;
	}

	public async remove( id: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM room_reservations
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException(
			    `Room reservation with id ${id} not found`,
			);
		}
	}

	public async ensureExists( id: number ): Promise< void >
	{
		await this.findOne( id );
	}

	private async ensureIsAvailable(
	    roomId: number,
	    startDate: string,
	    endDate: string,
	    excludeReservationId?: number,
	    ): Promise< void >
	{
		const room = await this.databaseService.queryOne< { num_of_beds : number } >(
		    `SELECT num_of_beds
		 FROM rooms
		 WHERE id = $1`,
		    [ roomId ],
		);

		if ( !room )
		{
			throw new NotFoundException( `Room with id ${roomId} not found` );
		}

		const overlappingCount = await this.databaseService.queryValue< number >(
		    `SELECT COUNT(*)::int
		 FROM room_reservations
		 WHERE id_room = $1
		   AND daterange(start_date_reserv, end_date_reserv, '[]')
		       && daterange($2::date, $3::date, '[]')
		   AND ($4::int IS NULL OR id <> $4::int)`,
		    [ roomId, startDate, endDate, excludeReservationId ?? null ],
		);

		if ( ( overlappingCount ?? 0 ) >= room.num_of_beds )
		{
			throw new BadRequestException(
			    "Room has no available beds in the selected period",
			);
		}
	}
}