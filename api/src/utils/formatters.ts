import {
  IFoodPlate,
  IFoodStock,
  IFood,
  IMealSchedule,
  IPlate,
} from '@global/entities';
import { Plate } from '@prisma/client';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { ArgTimezone } from './constants';

export const formatPlate = (p: any): IPlate => ({
  id: p.id,
  name: p.name,
  image: p.image,
  FoodPlate:
    (p?.FoodUserPlate?.map((f: any) =>
      formatFoodUserPlate(f),
    ) as IFoodPlate[]) || undefined,
});

export const formatFood = (f: any): IFood => ({
  id: f?.id,
  name: f?.name,
  image: f?.image,
});

export const formatFoodUserStock = (f: any): IFoodStock => ({
  Food: formatFood(f.Food),
  show_on_list: f.show_on_list,
  fridge_amount: f.fridge_amount,
  frozen_amount: f.frozen_amount,
  frozen_quantity_per_package: f.frozen_quantity_per_package,
  allow_use_frozen_amount: f.allow_use_frozen_amount,
  Unit: f?.Unit,
});

export const formatFoodUserPlate = (f: any): IFoodPlate => ({
  FoodStock: formatFoodUserStock(f.FoodUserStock),
  amount: f.amount,
});

export const formatMealSchedule = (s: any): IMealSchedule => ({
  id: s.id,
  Plate: formatPlate(s.Plate),
  date: `${format(s.date, 'yyyy-MM-dd')}T${format(s.date, 'HH:mm:ss')}`,
  state: s.state,
  missing:
    s?.missing?.map((f) => ({
      missingAmount: f.missingAmount,
      ...formatFoodUserPlate(f),
    })) || undefined,
  frozen:
    s?.frozen?.map((f) => ({
      frozenAmount: f.frozenAmount,
      ...formatFoodUserPlate(f),
    })) || [],
});

export const formatTimezoneSchedule = <T>(
  schedule: any,
  timezone = ArgTimezone,
): T => ({
  ...schedule,
  date: utcToZonedTime(schedule.date as Date, timezone || ArgTimezone),
});
