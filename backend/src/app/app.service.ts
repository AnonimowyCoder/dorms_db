import {Injectable} from '@nestjs/common';

@Injectable() export class AppService
{
	getWelcome(): string
	{
		return 'Check backend/test/requests.http for endpoints.';
	}
}
