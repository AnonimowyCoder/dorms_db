import 'dotenv/config';

import {NestFactory} from '@nestjs/core';

import {AppModule} from './app/app.module';
import {getEnv} from './utility/get-env';

async function bootstrap()
{
	const app = await NestFactory.create( AppModule );

	const serverPort = getEnv( 'BACKEND_PORT', Number );
	await app.listen( serverPort );
}
bootstrap().catch( console.error );
