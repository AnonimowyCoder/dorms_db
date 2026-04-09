import {getEnv} from "@/utility/get-env";
import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common";
import * as pg from 'pg';

@Injectable() export class DatabaseService implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger( DatabaseService.name );
	private readonly pool: pg.Pool;

	public constructor()
	{
		const connectionString = getEnv( 'DATABASE_URL', String );

		this.pool = new pg.Pool( {
			connectionString,
			ssl : {
				rejectUnauthorized : false,
			},
		} );
	}

	public async onModuleInit(): Promise< void >
	{
		try
		{
			const result = await this.query< { now : string } >( "SELECT NOW()::text AS now" );
			this.logger.log( `Database connected successfully at ${result.rows[ 0 ]?.now}` );
		}
		catch ( error )
		{
			this.logger.error( "Failed to connect to database", error );
			throw error;
		}
	}

	public async onModuleDestroy(): Promise< void >
	{
		await this.pool.end();
		this.logger.log( "Database pool closed" );
	}

	public async query< T extends pg.QueryResultRow >(
	    text: string,
	    params: unknown[] = [],
	    ): Promise< pg.QueryResult< T >>
	{
		return this.pool.query< T >( text, params );
	}

	public getPool(): pg.Pool
	{
		return this.pool;
	}
}