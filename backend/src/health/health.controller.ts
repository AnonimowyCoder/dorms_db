import {Public} from '@/auth/decorators/public.decorator';
import {Controller, Get} from '@nestjs/common';

import {HealthService} from './health.service';

@Public() @Controller( "health" ) export class HealthController
{
	constructor( private readonly healthService: HealthService ) {}

	@Get() public getHealth()
	{
		return this.healthService.getHealth();
	}

	@Get( 'db' ) public async getDbHealth()
	{
		return this.healthService.getDbHealth();
	}
}
