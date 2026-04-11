import {Injectable} from '@nestjs/common';

@Injectable() export class AppService
{
	getHello(): string
	{
		return 'Hello. Check backend/src/test/request.http for the list of endpoints.';
	}
}
