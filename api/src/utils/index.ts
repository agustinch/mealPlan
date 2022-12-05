import { MealScheduleStates } from '@global/constants';
import { IFoodPlate } from '@global/entities';
import { ParseFilePipeBuilder } from '@nestjs/common';

export const existFoodMissing = (schedule: any) => {
  const missing = [];
  if (schedule.state.id !== MealScheduleStates.TO_DO) return { missing };

  const foods = schedule.Plate.FoodUserPlate;
  for (const food of foods) {
    const newAmount = food.FoodUserStock.amount - food.amount;
    if (newAmount >= 0) continue;
    missing.push({
      ...food,
      missingAmount: newAmount,
    });
  }

  return { missing };
};
