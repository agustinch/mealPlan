import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePlateDto } from './dto/create-plate.dto';
import { UpdatePlateDto } from './dto/update-plate.dto';

@Injectable()
export class PlateService {
  constructor(private prisma: PrismaService) {}

  create(createPlateDto: CreatePlateDto) {
    return this.prisma.plate.create({
      data: {
        ...createPlateDto,
        ingredientes: {
          createMany: {
            data: createPlateDto.ingredientes.map((f) => ({
              food_id: f.id,
              amount: f.amount,
            })),
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.plate.findMany({
      include: { ingredientes: { include: { food: true } } },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} plate`;
  }

  update(id: number, updatePlateDto: UpdatePlateDto) {
    return `This action updates a #${id} plate`;
  }

  remove(id: number) {
    return `This action removes a #${id} plate`;
  }
}
