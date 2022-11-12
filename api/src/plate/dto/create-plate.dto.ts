import { Food, FoodPlate } from '@prisma/client';

export class CreatePlateDto {
  name: string;
  image: string;
  ingredientes: { id: number; amount: number }[];
}
