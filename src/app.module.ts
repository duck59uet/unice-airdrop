import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    CacheModule.register({ ttl: 10_000 }),
    SharedModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_URL'),
          port: configService.get('REDIS_PORT'),
          db: configService.get('REDIS_DB'),
        },
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [SharedModule],
    //   useFactory: (customConfigService: CustomConfigService) =>
    //     customConfigService.typeOrmConfig,
    //   inject: [CustomConfigService],
    // }),
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  providers: [JwtStrategy],
  controllers: [],
})
export class AppModule {}
