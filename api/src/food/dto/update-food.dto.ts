import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {}

export interface UpdateFoodStockAmount {
  amount: number;
}

export interface UpdateFoodStockShowList {
  show_on_list: boolean;
  order: number;
}
