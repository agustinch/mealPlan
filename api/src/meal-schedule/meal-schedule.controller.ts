import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
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
import { IFoodStock, IMealSchedule } from '@global/entities';
import {
  formatFoodUserStock,
  formatMealSchedule,
  formatTimezoneSchedule,
} from 'src/utils/formatters';
import { ArgTimezone } from 'src/utils/constants';
import { MealScheduleStates } from '@global/constants';
import _ from 'lodash';
import { existFoodMissing } from 'src/utils';
import { isSameDay, isToday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

@Controller('meal-schedule')
export class MealScheduleController {
  constructor(
    private readonly mealScheduleService: MealScheduleService,
    private readonly foodService: FoodService,
  ) {}

  @Get()
  async findAll(@Req() req): Promise<IMealSchedule[]> {
    const schedulesService = await this.mealScheduleService.findAll(
      req.user.id,
    );
    let allFoodStock = await this.foodService.findAllFoodStockByUser(
      req.user.id,
    );
    const schedules = schedulesService.map((s) =>
      formatTimezoneSchedule<typeof s>(s, req.timezone),
    );

    let scheduleMap = schedules.map((s) => ({
      ...s,
      missing: [],
      frozen: [],
    }));

    for (const idx in scheduleMap) {
      let schedule = scheduleMap[idx];
      const { missing, frozen, allFoodStocksUpdated } = existFoodMissing(
        schedule,
        allFoodStock,
      );
      allFoodStock = allFoodStocksUpdated;
      scheduleMap[idx] = { ...schedule, missing };

      if (isSameDay(schedule.date, utcToZonedTime(new Date(), req.timezone)))
        schedule.frozen = frozen;
    }

    return scheduleMap?.map((s) => formatMealSchedule(s));
  }

  @Get('/:id')
  async findMealScheduleById(
    @Req() req,
    @Param('id', new DefaultValuePipe('-1'), ParseIntPipe) id: number,
  ): Promise<IMealSchedule> {
    const scheduleService = await this.mealScheduleService.findById(id);
    const allFoodStock = _.uniqBy(
      scheduleService.Plate.FoodUserPlate.flatMap((p) => p.FoodUserStock),
      'food_id',
    );
    if (scheduleService.user_id !== req.user.id)
      throw new ForbiddenException('No tienes permisos para ver este dato');

    const schedule = formatTimezoneSchedule<typeof scheduleService>(
      scheduleService,
      req.timezone,
    );
    const scheduleResponse = { ...schedule, frozen: [], missing: [] };

    const { missing, frozen } = existFoodMissing(
      scheduleResponse,
      allFoodStock,
    );
    scheduleResponse.missing = missing;

    if (
      isSameDay(scheduleResponse.date, utcToZonedTime(new Date(), req.timezone))
    )
      scheduleResponse.frozen = frozen;

    return formatMealSchedule(scheduleResponse);
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
    return this.mealScheduleService.doneMealSchedule(
      id,
      req.user.id,
      req.timezone,
    );
  }

  @Patch('/to-do/:id')
  async toDoMealSchedule(
    @Req() req,
    @Body() @Param('id', new DefaultValuePipe('-1'), ParseIntPipe) id: number,
  ) {
    return this.mealScheduleService.revertToDoMealSchedule(id, req.user.id);
  }

  @Delete('/:id')
  async delete(
    @Req() req,
    @Param('id', new DefaultValuePipe('-1'), ParseIntPipe) id: number,
  ) {
    return this.mealScheduleService.delete(id);
  }
}
