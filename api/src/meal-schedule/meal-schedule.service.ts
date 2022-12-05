import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { MealScheduleStates } from '@global/constants';
import { existFoodMissing } from 'src/utils';

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
  async create(createMealSchedule: CreateMealScheduleDto, user_id: number) {
    const id = MealScheduleStates.TO_DO;
    return this.prisma.mealSchedule.create({
      data: {
        User: { connect: { id: user_id } },
        Plate: { connect: { id: createMealSchedule.plate_id } },
        state: { connect: { id: MealScheduleStates.TO_DO } },
        date: createMealSchedule.date,
      },
    });
  }

  async doneMealSchedule(id: number, user_id: number) {
    const mealSchedule = await this.prisma.mealSchedule.findUnique({
      where: { id },
      include: {
        Plate: {
          include: { FoodUserPlate: { include: { FoodUserStock: true } } },
        },
        state: true,
      },
    });
    const { missing } = existFoodMissing(mealSchedule);
    console.log(missing);
    if (missing.length === 0) return null;
    const updateStock = mealSchedule.Plate.FoodUserPlate.map((p) => {
      if (p.FoodUserStock.amount >= p.amount) {
        return this.prisma.foodUserStock.update({
          where: { food_id_user_id: { food_id: p.food_id, user_id } },
          data: {
            amount: { decrement: p.amount },
          },
        });
      }
      return null;
    }).filter((u) => u !== null);

    const changeState = this.prisma.mealSchedule.update({
      where: { id },
      data: {
        state: { connect: { id: MealScheduleStates.DONE } },
      },
    });

    return this.prisma.$transaction([...updateStock, changeState]);
  }

  async delete(id: number) {
    return this.prisma.mealSchedule.delete({ where: { id } });
  }
}
