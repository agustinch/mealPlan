import {
  IFoodPlate,
  IFoodStock,
  IFood,
  IMealSchedule,
  IPlate,
} from '@global/entities';
import { Plate } from '@prisma/client';

export const formatPlate = (p: any): IPlate => ({
  id: p.id,
  name: p.name,
  image: p.image,
  FoodPlate:
    (p?.FoodUserPlate?.map((f: any) =>
      formatFoodUserPlate(f),
    ) as IFoodPlate[]) || undefined,
});

export const formatFood = (f: any) => ({
  id: f?.id,
  name: f?.name,
  image: f?.image,
});

export const formatFoodUserStock = (f: any): IFood => ({
  ...formatFood(f.Food),
  show_on_list: f.show_on_list,
  amount: f.amount,
  Unit: f?.Unit,
});

export const formatFoodUserPlate = (f: any): IFoodPlate => ({
  FoodStock: formatFoodUserStock(f.FoodUserStock),
  amount: f.amount,
});

export const formatMealSchedule = (s: any): IMealSchedule => ({
  id: s.id,
  Plate: formatPlate(s.Plate),
  date: s.date,
  state: s.state,
  missing:
    s?.missing?.map((f) => ({
      missingAmount: f.missingAmount,
      ...formatFoodUserPlate(f),
    })) || undefined,
});
