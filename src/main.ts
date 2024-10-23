import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as logger from 'morgan';

import { AppModule } from '@/src/app.module';
import { ENV_VARIABLES } from '@/src/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: true, // allow all origin all types of http req
    });

    app.setGlobalPrefix('api'); // add prefix in all http routes

    app.enableVersioning({
      type: VersioningType.URI,
    });

    app.use(helmet()); // will add general security header

    app.use(compression({}));

    app.use(cookieParser()); //  parsing and using cookie functionality using req & res Objects

    app.use(logger('dev')); //  Logging http-api calls

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // This will apply validation for all route. whitelist option is for to remove unwanted obj property not in dto

    const port = ENV_VARIABLES.PORT || 3000;
    await app.listen(port);
    Logger.log(`Listing on port: ${port}`, 'MAIN');
  } catch (err) {
    Logger.error(`Something went wrong: ${err.message}`);
  }
}
bootstrap();
