import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import {
  UpdateFoodDto,
  UpdateFoodStockAmount,
  UpdateFoodStockShowList,
} from './dto/update-food.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  create(createFoodDto: CreateFoodDto) {
    const { unit_id, user_id, amount, order, ...createFood } = createFoodDto;
    return this.prisma.foodUserStock.create({
      data: {
        Food: {
          connectOrCreate: {
            where: { id: createFood?.food_id || -1 },
            create: {
              ...createFood,
            },
          },
        },
        Unit: { connect: { id: unit_id } },
        User: { connect: { id: user_id } },
        amount: amount || 0,
        show_on_list: true,
        order,
      },
    });
  }

  findOne(food_id: number, user_id: number) {
    return this.prisma.foodUserStock.findUnique({
      where: { food_id_user_id: { food_id, user_id } },
    });
  }

  findAll() {
    return this.prisma.food.findMany();
  }

  findAllFoodStockByUser(user_id: number) {
    return this.prisma.foodUserStock.findMany({
      where: { user_id },
      include: { Food: true, Unit: true },
      orderBy: { order: 'asc' },
    });
  }

  findAllSuggestionFood() {
    return this.prisma.food.findMany();
  }

  updateAmount(
    food_id: number,
    user_id: number,
    updateFoodStockAmount: UpdateFoodStockAmount,
  ) {
    const { amount } = updateFoodStockAmount;
    return this.prisma.foodUserStock.update({
      where: { food_id_user_id: { food_id, user_id } },
      data: {
        amount,
      },
    });
  }

  updateShowOnList(
    food_id: number,
    user_id: number,
    updateFoodStockShowList: UpdateFoodStockShowList,
  ) {
    return this.prisma.foodUserStock.update({
      where: { food_id_user_id: { food_id, user_id } },
      data: {
        show_on_list: updateFoodStockShowList.show_on_list,
        order: updateFoodStockShowList.order,
      },
    });
  }

  remove(food_id: number, user_id: number) {
    return this.prisma.foodUserStock.update({
      where: { food_id_user_id: { food_id, user_id } },
      data: { show_on_list: false },
    });
  }

  findAllUnits() {
    return this.prisma.unit.findMany();
  }
}
