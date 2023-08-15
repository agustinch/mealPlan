import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { MealScheduleStates } from '@global/constants';
import { existFoodMissing, today } from 'src/utils';
import { formatTimezoneSchedule } from 'src/utils/formatters';
import {
  differenceInCalendarDays,
  differenceInDays,
  isAfter,
  isFuture,
  isSameDay,
} from 'date-fns';
import _ from 'lodash';

@Injectable()
export class MealScheduleService {
  constructor(private prisma: PrismaService) {}

  async findAll(user_id: number) {
    return this.prisma.mealSchedule.findMany({
      where: {
        AND: {
          user_id,
          date: {
            gte: new Date(),
          },
        },
      },
      include: {
        Plate: {
          include: {
            FoodUserPlate: {
              include: {
                FoodUserStock: { include: { Food: true, Unit: true } },
              },
            },
          },
        },
        state: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prisma.mealSchedule.findUnique({
      where: {
        id,
      },
      include: {
        Plate: {
          include: {
            FoodUserPlate: {
              include: {
                FoodUserStock: { include: { Food: true, Unit: true } },
              },
            },
          },
        },
        state: true,
      },
    });
  }
  async create(createMealSchedule: CreateMealScheduleDto, user_id: number) {
    const id = MealScheduleStates.TO_DO;
    return this.prisma.mealSchedule.create({
      data: {
        User: { connect: { id: user_id } },
        Plate: {
          connectOrCreate: {
            where: { id: createMealSchedule.plate_id || -1 },
            create: {
              name: createMealSchedule.plate_name,
              image: '',
              User: { connect: { id: user_id } },
            },
          },
        },
        state: { connect: { id: MealScheduleStates.TO_DO } },
        date: createMealSchedule.date,
      },
    });
  }

  async doneMealSchedule(id: number, user_id: number, timezone: string) {
    /*
    const mealScheduleService = await this.prisma.mealSchedule.findUnique({
      where: { id },
      include: {
        Plate: {
          include: {
            FoodUserPlate: {
              include: {
                FoodUserStock: { include: { Food: true, Unit: true } },
              },
            },
          },
        },
        state: true,
      },
    });
    const allFoodStock = _.uniqBy(
      mealScheduleService.Plate.FoodUserPlate.flatMap((p) => p.FoodUserStock),
      'food_id',
    );
    const mealSchedule = formatTimezoneSchedule<typeof mealScheduleService>(
      mealScheduleService,
      timezone,
    );
    const { missing, frozen } = existFoodMissing(mealSchedule, allFoodStock);

    if (differenceInCalendarDays(mealSchedule.date, today(timezone)) > 0)
      throw new BadRequestException(
        'No se puede completar un plato programado para un día futuro',
      );
    if (missing.length > 0)
      throw new BadRequestException(
        'No se puede completar un plato porque hay faltantes',
      );

    if (frozen.length > 0)
      throw new BadRequestException(
        'No se puede completar un plato con alimentos congelados',
      );
      
    const updateStock = mealSchedule.Plate.FoodUserPlate.map((p) => {
      if (p.FoodUserStock.fridge_amount >= p.amount) {
        return this.prisma.foodUserStock.update({
          where: { food_id_user_id: { food_id: p.food_id, user_id } },
          data: {
            fridge_amount: { decrement: p.amount },
          },
        });
      }
      return null;
    }).filter((u) => u !== null);
*/
    const changeState = this.prisma.mealSchedule.update({
      where: { id },
      data: {
        state: { connect: { id: MealScheduleStates.DONE } },
      },
    });
    return changeState;
    // return this.prisma.$transaction([...updateStock, changeState]);
  }

  async revertToDoMealSchedule(id: number, user_id: number) {
    const mealSchedule = await this.prisma.mealSchedule.findUnique({
      where: { id },
      include: {
        Plate: {
          include: { FoodUserPlate: { include: { FoodUserStock: true } } },
        },
        state: true,
      },
    });
    if (mealSchedule.state.id === MealScheduleStates.TO_DO) return null;
    const updateStock = mealSchedule.Plate.FoodUserPlate.map((p) => {
      return this.prisma.foodUserStock.update({
        where: { food_id_user_id: { food_id: p.food_id, user_id } },
        data: {
          fridge_amount: { increment: p.amount },
        },
      });
    }).filter((u) => u !== null);

    const changeState = this.prisma.mealSchedule.update({
      where: { id },
      data: {
        state: { connect: { id: MealScheduleStates.TO_DO } },
      },
    });

    return this.prisma.$transaction([...updateStock, changeState]);
  }

  async delete(id: number) {
    return this.prisma.mealSchedule.delete({ where: { id } });
  }
}
