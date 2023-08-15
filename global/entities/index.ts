import { GStatesType } from '../constants';

export interface IFood {
  id: number;
  name: string;
  image: string;
}

export interface IUnit {
  id: number;
  name: string;
  abbreviation: string;
}

export interface IPlate {
  id: number;
  name: string;
  image: string;
  FoodPlate?: IFoodPlate[];
}

export interface IFoodPlate {
  amount: number;
  FoodStock: IFoodStock;
}

export interface IFoodStock {
  Food: IFood;
  Unit: IUnit;
  frozen_amount: number | null;
  fridge_amount: number | null;
  frozen_quantity_per_package: number | null;
  allow_use_frozen_amount: boolean;
  show_on_list: boolean;
}

export interface IMealSchedule {
  id: number;
  Plate: IPlate;
  date: string;
  missing: (IFoodPlate & { missingAmount: number })[];
  frozen: (IFoodPlate & { frozenAmount: number })[];
  state: IState;
}

export interface IState {
  id: number;
  name: string;
  type: GStatesType;
}
