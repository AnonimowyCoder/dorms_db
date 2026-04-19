import {Public} from '@/auth/decorators/public.decorator';
import {Controller, Get} from '@nestjs/common';

import {AppService} from './app.service';

@Public() @Controller() export class AppController
{
	constructor( private readonly appService: AppService ) {}

	@Get() getWelcome(): string
	{
		return this.appService.getWelcome();
	}
}
