import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FoodService } from 'src/food/food.service';
import { MealScheduleService } from './meal-schedule.service';
import { IMealSchedule } from '@global/entities';
import { formatMealSchedule } from 'src/utils/formatters';
import { MealScheduleStates } from '@global/constants';
import { existFoodMissing } from 'src/utils';

@Controller('meal-schedule')
export class MealScheduleController {
  constructor(
    private readonly mealScheduleService: MealScheduleService,
    private readonly foodService: FoodService,
  ) {}

  @Get()
  async findAll(@Req() req): Promise<IMealSchedule[]> {
    const schedules = await this.mealScheduleService.findAll(req.user.id);

    let scheduleMap = schedules.map((s) => ({
      ...s,
      missing: [],
    }));

    for (const idx in scheduleMap) {
      const schedule = scheduleMap[idx];
      const { missing } = existFoodMissing(schedule);
      schedule.missing = missing;
    }

    return scheduleMap?.map((s) => formatMealSchedule(s));
  }
  @Post()
  async create(@Req() req, @Body() body: CreateMealScheduleDto) {
    return this.mealScheduleService.create(body, req.user.id);
  }

  @Patch('/done/:id')
  async doneMealSchedule(
    @Req() req,
    @Body() @Param('id', new DefaultValuePipe('-1'), ParseIntPipe) id: number,
  ) {
    return this.mealScheduleService.doneMealSchedule(id, req.user.id);
  }

  @Delete('/:id')
  async delete(
    @Req() req,
    @Param('id', new DefaultValuePipe('-1'), ParseIntPipe) id: number,
  ) {
    return this.mealScheduleService.delete(id);
  }
}
