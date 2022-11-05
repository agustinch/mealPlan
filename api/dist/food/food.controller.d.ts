import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
export declare class FoodController {
    private readonly foodService;
    constructor(foodService: FoodService);
    create(createFoodDto: CreateFoodDto): import(".prisma/client").Prisma.Prisma__FoodClient<import(".prisma/client").Food, never>;
    findAll(): import(".prisma/client").PrismaPromise<import(".prisma/client").Food[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__FoodClient<import(".prisma/client").Food, never>;
    update(id: string, updateFoodDto: UpdateFoodDto): string;
    remove(id: string): string;
}
