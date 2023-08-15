import { MealScheduleStates } from '@global/constants';
import { IFoodPlate, IFoodStock } from '@global/entities';
import { ParseFilePipeBuilder } from '@nestjs/common';
import { Food, FoodUserStock, Unit } from '@prisma/client';
import { utcToZonedTime } from 'date-fns-tz';
import { ArgTimezone } from './constants';

export const existFoodMissing = (
  schedule: any,
  allFoodStocks: (FoodUserStock & { Food: Food; Unit: Unit })[],
) => {
  const missing = [];
  const frozen = [];
  if (schedule.state.id !== MealScheduleStates.TO_DO)
    return { missing, frozen };
  const foods = schedule.Plate.FoodUserPlate;
  let foodStocks = allFoodStocks;
  for (const food of foods) {
    let newAmount = food.amount;
    const foodStockIdx = foodStocks.findIndex(
      (f) => f.Food.id === food.food_id,
    );

    if (
      foodStockIdx &&
      foodStocks[foodStockIdx] &&
      foodStocks[foodStockIdx].show_on_list
    ) {
      newAmount = foodStocks[foodStockIdx].fridge_amount - food.amount;
      foodStocks[foodStockIdx].fridge_amount = newAmount;
      if (newAmount >= 0) continue;
      if (food.FoodUserStock.frozen_amount >= food.amount) {
        frozen.push({
          ...food,
          frozenAmount: food.amount,
        });
        continue;
      }
    }
    missing.push({
      ...food,
      missingAmount: Math.abs(newAmount),
    });
  }

  return { missing, frozen, allFoodStocksUpdated: foodStocks };
};

export const today = (timezone = ArgTimezone) =>
  utcToZonedTime(new Date(), timezone);
