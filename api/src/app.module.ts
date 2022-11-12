import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodModule } from './food/food.module';
import { PlateModule } from './plate/plate.module';

@Module({
  imports: [FoodModule, PlateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
