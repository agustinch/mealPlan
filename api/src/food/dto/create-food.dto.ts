export class CreateFoodDto {
  food_id?: number;
  name: string;
  image?: string;
  unit_id: number;
  user_id?: number;
  fridge_amount?: number;
  frozen_amount?: number;
  order?: number;
  frozen_quantity_per_package?: number;
  allow_use_frozen_amount?: boolean;
}
