import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodModule } from './food/food.module';
import { PlateModule } from './plate/plate.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MealScheduleModule } from './meal-schedule/meal-schedule.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TimezoneMiddleware } from './middleware/timezone.middleware';

@Module({
  imports: [
    FoodModule,
    PlateModule,
    AuthModule,
    UsersModule,
    MealScheduleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimezoneMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
