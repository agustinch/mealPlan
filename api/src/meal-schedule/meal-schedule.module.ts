import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FoodService } from 'src/food/food.service';
import { PrismaService } from 'src/prisma.service';
import { MealScheduleController } from './meal-schedule.controller';
import { MealScheduleService } from './meal-schedule.service';

@Module({
  controllers: [MealScheduleController],
  providers: [MealScheduleService, FoodService, PrismaService],
})
export class MealScheduleModule {}
