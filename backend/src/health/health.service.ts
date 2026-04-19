import {DatabaseService} from '@/database/database.service';
import {Injectable} from '@nestjs/common';

@Injectable() export class HealthService
{
	public constructor( private readonly databaseService: DatabaseService ) {}

	public getHealth(): string
	{
		return "ok";
	}

	public async getDbHealth(): Promise< string >
	{
		await this.databaseService.query( "SELECT 1" );
		return "ok";
	}
}
