import {DatabaseModule} from '@/database/database.module';
import {Module} from '@nestjs/common';

import {HealthController} from './health.controller';
import {HealthService} from './health.service';

@Module( {
	imports : [ DatabaseModule ],
	controllers : [ HealthController ],
	providers : [ HealthService ],
} )
export class HealthModule
{}
