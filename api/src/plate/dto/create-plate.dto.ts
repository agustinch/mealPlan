import { Food } from '@prisma/client';

export class CreatePlateDto {
  name: string;
  image: string;
  user_id: number;
  ingredients: { id: number; amount: number }[];
}
