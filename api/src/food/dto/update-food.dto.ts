import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {}

export interface UpdateFoodStockAmount {
  fridge_amount: number;
  frozen_amount: number;
}

export interface UpdateFoodStockShowList {
  show_on_list: boolean;
  fridge_amount?: number;
  frozen_amount?: number;
  order?: number;
  unit_id?: number;
  frozen_quantity_per_package?: number;
  allow_use_frozen_amount?: boolean;
}
