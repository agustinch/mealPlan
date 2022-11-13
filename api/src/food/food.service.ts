import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  create(createFoodDto: CreateFoodDto) {
    const { unit_id, user_id, amount, ...createFood } = createFoodDto;
    return this.prisma.food.create({
      data: {
        unit: { connect: { id: unit_id } },
        ...(user_id && {
          FoodUserStock: { create: { user_id, amount: amount || 0 } },
        }),
        ...createFood,
      },
    });
  }

  findAll() {
    return this.prisma.food.findMany();
  }

  findOne(id: number) {
    return this.prisma.food.findUnique({
      where: { id },
    });
  }

  findAllFoodByUser(user_id: number) {
    return this.prisma.foodUserStock.findMany({
      where: { user_id },
      include: { Food: { include: { unit: true } } },
    });
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return this.prisma.food.update({
      where: { id },
      data: updateFoodDto,
    });
  }

  remove(id: number) {
    return this.prisma.food.delete({ where: { id } });
  }
}
