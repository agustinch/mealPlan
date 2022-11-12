import { PrismaService } from 'src/prisma.service';
import { CreatePlateDto } from './dto/create-plate.dto';
import { UpdatePlateDto } from './dto/update-plate.dto';
export declare class PlateService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPlateDto: CreatePlateDto): import(".prisma/client").Prisma.Prisma__PlateClient<import(".prisma/client").Plate, never>;
    findAll(): import(".prisma/client").PrismaPromise<(import(".prisma/client").Plate & {
        ingredientes: (import(".prisma/client").FoodPlate & {
            food: import(".prisma/client").Food;
        })[];
    })[]>;
    findOne(id: number): string;
    update(id: number, updatePlateDto: UpdatePlateDto): string;
    remove(id: number): string;
}
