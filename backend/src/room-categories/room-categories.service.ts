import {DatabaseService} from "@/database/database.service";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

import {CreateRoomCategoryDto} from "./dto/create-room-category.dto";
import {UpdateRoomCategoryDto} from "./dto/update-room-category.dto";
import {RoomCategory} from "./types";

@Injectable() export class RoomCategoriesService
{
	public constructor( private readonly databaseService: DatabaseService ) {}

	public async findAll(): Promise< RoomCategory[] >
	{
		return this.databaseService.queryMany< RoomCategory >(
		    `SELECT id, monthly_rent, if_kitchen, category_name
			 FROM room_categories
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< RoomCategory >
	{
		const category = await this.databaseService.queryOne< RoomCategory >(
		    `SELECT id, monthly_rent, if_kitchen, category_name
			 FROM room_categories
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !category )
		{
			throw new NotFoundException(
			    `Room category with id ${id} not found`,
			);
		}

		return category;
	}

	public async create(
	    dto: CreateRoomCategoryDto,
	    ): Promise< RoomCategory >
	{
		const createdCategory = await this.databaseService.queryOne< RoomCategory >(
		    `INSERT INTO room_categories ( monthly_rent, if_kitchen, category_name )
			 VALUES ( $1, $2, $3 )
			 RETURNING id, monthly_rent, if_kitchen, category_name`,
		    [ dto.monthly_rent, dto.if_kitchen, dto.category_name ],
		);

		if ( !createdCategory )
		{
			throw new Error( "Failed to create room category" );
		}

		return createdCategory;
	}

	public async update(
	    id: number,
	    dto: UpdateRoomCategoryDto,
	    ): Promise< RoomCategory >
	{
		const existingCategory = await this.findOne( id );

		const updatedCategory = await this.databaseService.queryOne< RoomCategory >(
		    `UPDATE room_categories
			 SET monthly_rent = $2,
			     if_kitchen = $3,
			     category_name = $4
			 WHERE id = $1
			 RETURNING id, monthly_rent, if_kitchen, category_name`,
		    [
			    id,
			    dto.monthly_rent ?? existingCategory.monthly_rent,
			    dto.if_kitchen ?? existingCategory.if_kitchen,
			    dto.category_name ?? existingCategory.category_name,
		    ],
		);

		if ( !updatedCategory )
		{
			throw new Error( "Failed to update room category" );
		}

		return updatedCategory;
	}

	public async remove( id: number ): Promise< void >
	{
		await this.findOne( id );

		const roomsUsingCategory = await this.databaseService.queryValue< number >(
		    `SELECT COUNT(*)::int
			 FROM rooms
			 WHERE id_category = $1`,
		    [ id ],
		);

		if ( ( roomsUsingCategory ?? 0 ) > 0 )
		{
			throw new BadRequestException(
			    `Cannot delete room category with id ${id} because it is used by existing rooms`,
			);
		}

		const result = await this.databaseService.query(
		    `DELETE FROM room_categories
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException(
			    `Room category with id ${id} not found`,
			);
		}
	}

	public async ensureExists( id: number ): Promise< void >
	{
		await this.findOne( id );
	}
}