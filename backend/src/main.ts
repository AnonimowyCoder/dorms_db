import 'dotenv/config';

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { getEnv } from './utility/get-env';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.enableShutdownHooks();
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const serverPort = getEnv('BACKEND_PORT', Number);
	await app.listen(serverPort);
}
bootstrap().catch(console.error);
