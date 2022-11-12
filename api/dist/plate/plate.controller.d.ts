import { PlateService } from './plate.service';
import { CreatePlateDto } from './dto/create-plate.dto';
import { UpdatePlateDto } from './dto/update-plate.dto';
export declare class PlateController {
    private readonly plateService;
    constructor(plateService: PlateService);
    create(createPlateDto: CreatePlateDto): import(".prisma/client").Prisma.Prisma__PlateClient<import(".prisma/client").Plate, never>;
    findAll(): import(".prisma/client").PrismaPromise<(import(".prisma/client").Plate & {
        ingredientes: (import(".prisma/client").FoodPlate & {
            food: import(".prisma/client").Food;
        })[];
    })[]>;
    findOne(id: string): string;
    update(id: string, updatePlateDto: UpdatePlateDto): string;
    remove(id: string): string;
}
