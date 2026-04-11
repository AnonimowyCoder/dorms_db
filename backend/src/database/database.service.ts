import {getEnv} from "@/utility/get-env";
import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common";
import {Pool, PoolClient, QueryResult, QueryResultRow} from 'pg';

@Injectable() export class DatabaseService implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger( DatabaseService.name );
	private readonly pool: Pool;

	public constructor()
	{
		this.pool = this.createPool();
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

	public async queryOne< T extends QueryResultRow >(
	    text: string,
	    params: unknown[] = [],
	    ): Promise< T|null >
	{
		const result = await this.query< T >( text, params );
		return result.rows[ 0 ] ?? null;
	}

	public async queryMany< T extends QueryResultRow >(
	    text: string,
	    params: unknown[] = [],
	    ): Promise< T[] >
	{
		const result = await this.query< T >( text, params );
		return result.rows;
	}

	public async queryValue< T >(
	    text: string,
	    params: unknown[] = [],
	    ): Promise< T|null >
	{
		const result = await this.pool.query< Record< string, T >>( text, params );
		const row    = result.rows[ 0 ];

		if ( !row )
		{
			return null;
		}

		const firstKey = Object.keys( row )[ 0 ];
		return firstKey ? row[ firstKey ] : null;
	}

	public async query< T extends QueryResultRow >(
	    text: string,
	    params: unknown[] = [],
	    ): Promise< QueryResult< T >>
	{
		try
		{
			return await this.pool.query< T >( text, params );
		}
		catch ( error )
		{
			this.logger.error( `Query failed. SQL: ${text}. | Params: ${JSON.stringify( params )}. | Error: ${error}` );
			throw error;
		}
	}

	private createPool(): Pool
	{
		const connectionString = getEnv( 'DATABASE_URL', String );

		return new Pool( {
			connectionString,
			ssl : {
				rejectUnauthorized : false,
			},
		} );
	}

	public async withTransaction< T >(
	    callback: ( client: PoolClient ) => Promise< T >,
	    ): Promise< T >
	{
		const client = await this.pool.connect();

		try
		{
			await client.query( "BEGIN" );
			const result = await callback( client );
			await client.query( "COMMIT" );
			return result;
		}
		catch ( error )
		{
			try
			{
				await client.query( "ROLLBACK" );
			}
			catch ( rollbackError )
			{
				this.logger.error( "Transaction rollback failed", rollbackError );
			}

			throw error;
		}
		finally
		{
			client.release();
		}
	}
}