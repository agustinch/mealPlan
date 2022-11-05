import { PrismaService } from 'src/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Prisma } from '@prisma/client';
export declare class FoodService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createFoodDto: CreateFoodDto): Prisma.Prisma__FoodClient<import(".prisma/client").Food, never>;
    findAll(): import(".prisma/client").PrismaPromise<import(".prisma/client").Food[]>;
    findOne(id: number): Prisma.Prisma__FoodClient<import(".prisma/client").Food, never>;
    update(id: number, updateFoodDto: UpdateFoodDto): string;
    remove(id: number): string;
}
