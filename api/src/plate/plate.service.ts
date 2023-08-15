import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePlateDto } from './dto/create-plate.dto';
import { UpdatePlateDto } from './dto/update-plate.dto';

@Injectable()
export class PlateService {
  constructor(private prisma: PrismaService) {}

  create(createPlateDto: CreatePlateDto) {
    const { user_id, ingredients, ...createPlate } = createPlateDto;
    return this.prisma.plate.create({
      data: {
        ...createPlate,
        image: '',
        FoodUserPlate: {
          createMany: {
            data: ingredients.map((f) => ({
              food_id: f.id,
              user_id: user_id,
              amount: f.amount,
            })),
          },
        },
        User: { connect: { id: user_id } },
      },
    });
  }

  findAll() {
    return this.prisma.plate.findMany({
      include: {
        FoodUserPlate: {
          include: { FoodUserStock: { include: { Unit: true, Food: true } } },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} plate`;
  }

  update(id: number, updatePlateDto: UpdatePlateDto) {
    return `This action updates a #${id} plate`;
  }

  remove(id: number) {
    const deleteFoodPlate = this.prisma.foodUserPlate.deleteMany({
      where: {
        plate_id: id,
      },
    });

    const deletePlate = this.prisma.plate.delete({
      where: { id },
    });
    return this.prisma.$transaction([deleteFoodPlate, deletePlate]);
  }
}
