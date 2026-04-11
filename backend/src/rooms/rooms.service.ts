import {DatabaseService} from "@/database/database.service";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

import {CreateRoomDto} from "./dto/create-room.dto";
import {UpdateRoomDto} from "./dto/update-room.dto";

type RoomRow = {
	id: number; room_number : number; floor_number : number; num_of_beds : number; id_category : number;
	monthly_rent : number;
	if_kitchen : boolean | null;
	category_name : string | null;
};

type BasicRoomRow = {
	id: number; room_number : number; floor_number : number; num_of_beds : number; id_category : number;
};

type AvailableRoomRow = RoomRow&
{
	active_reservations_count: number;
	free_beds: number;
};

@Injectable() export class RoomsService
{
	public constructor( private readonly databaseService: DatabaseService ) {}

	public async findAll(): Promise< RoomRow[] >
	{
		return this.databaseService.queryMany< RoomRow >(
		    `SELECT
			     r.id,
			     r.room_number,
			     r.floor_number,
			     r.num_of_beds,
			     r.id_category,
			     rc.monthly_rent,
			     rc.if_kitchen,
			     rc.category_name
			 FROM rooms r
			 JOIN room_categories rc
			   ON rc.id = r.id_category
			 ORDER BY r.id ASC`,
		);
	}

	public async findOne( id: number ): Promise< RoomRow >
	{
		const room = await this.databaseService.queryOne< RoomRow >(
		    `SELECT
			     r.id,
			     r.room_number,
			     r.floor_number,
			     r.num_of_beds,
			     r.id_category,
			     rc.monthly_rent,
			     rc.if_kitchen,
			     rc.category_name
			 FROM rooms r
			 JOIN room_categories rc
			   ON rc.id = r.id_category
			 WHERE r.id = $1`,
		    [ id ],
		);

		if ( !room )
		{
			throw new NotFoundException( `Room with id ${id} not found` );
		}

		return room;
	}

	public async findAvailable(): Promise< AvailableRoomRow[] >
	{
		return this.databaseService.queryMany< AvailableRoomRow >(
		    `SELECT
			     r.id,
			     r.room_number,
			     r.floor_number,
			     r.num_of_beds,
			     r.id_category,
			     rc.monthly_rent,
			     rc.if_kitchen,
			     rc.category_name,
			     COUNT( rr.id )::int AS active_reservations_count,
			     ( r.num_of_beds - COUNT( rr.id )::int ) AS free_beds
			 FROM rooms r
			 JOIN room_categories rc
			   ON rc.id = r.id_category
			 LEFT JOIN room_reservations rr
			   ON rr.id_room = r.id
			  AND CURRENT_DATE BETWEEN rr.start_date_reserv AND rr.end_date_reserv
			 GROUP BY
			     r.id,
			     r.room_number,
			     r.floor_number,
			     r.num_of_beds,
			     r.id_category,
			     rc.monthly_rent,
			     rc.if_kitchen,
			     rc.category_name
			 HAVING ( r.num_of_beds - COUNT( rr.id )::int ) > 0
			 ORDER BY r.id ASC`,
		);
	}

	public async create( dto: CreateRoomDto ): Promise< RoomRow >
	{
		const categoryExists = await this.databaseService.queryOne< { id : number } >(
		    `SELECT id
			 FROM room_categories
			 WHERE id = $1`,
		    [ dto.id_category ],
		);

		if ( !categoryExists )
		{
			throw new BadRequestException(
			    `Room category with id ${dto.id_category} does not exist`,
			);
		}

		const room = await this.databaseService.queryOne< BasicRoomRow >(
		    `INSERT INTO rooms ( room_number, floor_number, num_of_beds, id_category )
			 VALUES ( $1, $2, $3, $4 )
			 RETURNING id, room_number, floor_number, num_of_beds, id_category`,
		    [
			    dto.room_number,
			    dto.floor_number,
			    dto.num_of_beds,
			    dto.id_category,
		    ],
		);

		if ( !room )
		{
			throw new Error( "Failed to create room" );
		}

		return this.findOne( room.id );
	}

	public async update(
	    id: number,
	    dto: UpdateRoomDto,
	    ): Promise< RoomRow >
	{
		const existingRoom = await this.databaseService.queryOne< BasicRoomRow >(
		    `SELECT id, room_number, floor_number, num_of_beds, id_category
			 FROM rooms
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !existingRoom )
		{
			throw new NotFoundException( `Room with id ${id} not found` );
		}

		const nextCategoryId = dto.id_category ?? existingRoom.id_category;

		const categoryExists = await this.databaseService.queryOne< { id : number } >(
		    `SELECT id
			 FROM room_categories
			 WHERE id = $1`,
		    [ nextCategoryId ],
		);

		if ( !categoryExists )
		{
			throw new BadRequestException(
			    `Room category with id ${nextCategoryId} does not exist`,
			);
		}

		const updatedRoom = await this.databaseService.queryOne< BasicRoomRow >(
		    `UPDATE rooms
			 SET room_number = $2,
			     floor_number = $3,
			     num_of_beds = $4,
			     id_category = $5
			 WHERE id = $1
			 RETURNING id, room_number, floor_number, num_of_beds, id_category`,
		    [
			    id,
			    dto.room_number ?? existingRoom.room_number,
			    dto.floor_number ?? existingRoom.floor_number,
			    dto.num_of_beds ?? existingRoom.num_of_beds,
			    nextCategoryId,
		    ],
		);

		if ( !updatedRoom )
		{
			throw new Error( "Failed to update room" );
		}

		return this.findOne( updatedRoom.id );
	}

	public async remove( id: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM rooms
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException( `Room with id ${id} not found` );
		}
	}
}