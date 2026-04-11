import {DatabaseService} from "@/database/database.service";
import {getEnv} from "@/utility/get-env";
import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {PublicUser} from "./types";

type PrivateUser = {
	id: number; email : string; password_hash : string; role : string;
};

@Injectable() export class UsersService
{
	private readonly saltRounds = getEnv( "HASH_SALT_ROUNDS", Number );

	public constructor( private readonly databaseService: DatabaseService ) {}

	public async findAll(): Promise< PublicUser[] >
	{
		return this.databaseService.queryMany< PublicUser >(
		    `SELECT id, email, role
			 FROM users
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< PublicUser >
	{
		const user = await this.databaseService.queryOne< PublicUser >(
		    `SELECT id, email, role
			 FROM users
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !user )
		{
			throw new NotFoundException( `User with id ${id} not found` );
		}

		return user;
	}

	public async create( dto: CreateUserDto ): Promise< PublicUser >
	{
		const existingUser = await this.findByEmail( dto.email );
		if ( existingUser )
		{
			throw new ConflictException( `User with email ${dto.email} already exists` );
		}

		const passwordHash = await bcrypt.hash( dto.password, this.saltRounds );

		const createdUser = await this.databaseService.queryOne< PublicUser >(
		    `INSERT INTO users ( email, password_hash, role )
			 VALUES ( $1, $2, $3 )
			 RETURNING id, email, role`,
		    [ dto.email, passwordHash, dto.role ],
		);

		if ( !createdUser )
		{
			throw new Error( "Failed to create user" );
		}

		return createdUser;
	}

	public async update(
	    id: number,
	    dto: UpdateUserDto,
	    ): Promise< PublicUser >
	{
		const existingUser = await this.databaseService.queryOne< PrivateUser >(
		    `SELECT id, email, password_hash, role
			 FROM users
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !existingUser )
		{
			throw new NotFoundException( `User with id ${id} not found` );
		}
		if ( ( dto.email && dto.email !== existingUser.email ) && await this.isEmailUnique( dto.email, id ) )
		{
			throw new ConflictException( `User with email ${dto.email} already exists` );
		}

		const updatedUser = await this.databaseService.queryOne< PublicUser >(
		    `UPDATE users
			 SET email = $2,
			     password_hash = $3,
			     role = $4
			 WHERE id = $1
			 RETURNING id, email, role`,
		    [
			    id,
			    dto.email ?? existingUser.email,
			    dto.password ? await bcrypt.hash( dto.password, 10 ) : existingUser.password_hash,
			    dto.role ?? existingUser.role,
		    ],
		);

		if ( !updatedUser )
		{
			throw new Error( "Failed to update user" );
		}

		return updatedUser;
	}

	public async remove( id: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM users
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException( `User with id ${id} not found` );
		}
	}

	public async findByEmail( email: string ): Promise< PrivateUser|null >
	{
		return this.databaseService.queryOne< PrivateUser >(
		    `SELECT id, email, password_hash, role FROM users WHERE email = $1`, [ email ] );
	}

	private async isEmailUnique( email: string, excludeId?: number ): Promise< boolean >
	{
		const query =
		    excludeId ? `SELECT id FROM users WHERE email = $1 AND id <> $2` : `SELECT id FROM users WHERE email = $1`;
		const params = excludeId ? [ email, excludeId ] : [ email ];

		const existing = await this.databaseService.queryOne< { id : number } >( query, params );
		return existing != null;
	}
}