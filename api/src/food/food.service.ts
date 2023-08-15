import { BadRequestException, Injectable } from '@nestjs/common';
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
    const {
      unit_id,
      user_id,
      fridge_amount,
      frozen_amount = null,
      frozen_quantity_per_package = null,
      allow_use_frozen_amount,
      order,
      ...createFood
    } = createFoodDto;
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
        fridge_amount: fridge_amount || 0,
        frozen_amount,
        frozen_quantity_per_package,
        allow_use_frozen_amount,
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

  addFood(
    food_id: number,
    user_id: number,
    updateFoodStockAmount: UpdateFoodStockAmount,
  ) {
    const { fridge_amount, frozen_amount } = updateFoodStockAmount;

    return this.prisma.foodUserStock.update({
      where: { food_id_user_id: { food_id, user_id } },
      data: {
        ...(fridge_amount > 0 && {
          fridge_amount: { increment: fridge_amount },
        }),
        ...(frozen_amount > 0 && {
          frozen_amount: { increment: frozen_amount },
        }),
      },
    });
  }

  async defrozenFood(
    food_id: number,
    user_id: number,
    updateFoodStockAmount: { frozen_amount: number },
  ) {
    const { frozen_amount } = updateFoodStockAmount;
    const result = await this.prisma.foodUserStock.findUnique({
      where: { food_id_user_id: { food_id, user_id } },
    });

    if (result.frozen_amount < frozen_amount)
      throw new BadRequestException('No hay suficiente cantidad congelada');

    return this.prisma.foodUserStock.update({
      where: { food_id_user_id: { food_id, user_id } },
      data: {
        fridge_amount: {
          increment: frozen_amount,
        },
        frozen_amount: {
          decrement: frozen_amount,
        },
      },
    });
  }

  updateFoodStock(food_id: number, user_id: number, updateFood: UpdateFoodDto) {
    const {
      fridge_amount,
      frozen_amount = null,
      unit_id,
      frozen_quantity_per_package,
    } = updateFood;
    return this.prisma.foodUserStock.update({
      where: { food_id_user_id: { food_id, user_id } },
      data: {
        fridge_amount,
        ...(frozen_amount !== null && { frozen_amount }),
        unit_id,
        frozen_quantity_per_package,
      },
    });
  }

  updateShowOnList(
    food_id: number,
    user_id: number,
    updateFoodStockShowList: UpdateFoodStockShowList,
  ) {
    const {
      fridge_amount,
      frozen_amount = null,
      unit_id,
      frozen_quantity_per_package,
      show_on_list,
      order,
    } = updateFoodStockShowList;
    return this.prisma.foodUserStock.update({
      where: { food_id_user_id: { food_id, user_id } },
      data: {
        fridge_amount,
        frozen_amount,
        unit_id,
        frozen_quantity_per_package,
        show_on_list,
        order,
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
