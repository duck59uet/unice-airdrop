import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { middleware as expressCtx } from 'express-ctx';
import bodyParser from 'body-parser';
import * as swaggerStats from 'swagger-stats';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';

// eslint-disable-next-line no-void
void (async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );

  // enable cors
  app.enableCors();
  app.use(expressCtx);

  // increase limit
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  const configService = app.select(SharedModule).get(ConfigService);

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('Pumpfun API')
    .setVersion('v1')
    .addServer('/')
    .addServer(configService.get<string>('SWAGGER_PATH'))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  app.use(swaggerStats.getMiddleware({ swaggerSpec: document }));
  SwaggerModule.setup('documentation', app, document);

  await app.listen(3000);
})();
