import { GStatesType } from "../constants";

export interface IFood {
  id: number;
  name: string;
  image: string;
  unit_id?: number;
  amount: number;
  Unit: IUnit;
  show_on_list: boolean;
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
  FoodStock: IFood;
}

export interface IFoodStock {
  amount: number;
  Food: IFood;
}

export interface IMealSchedule {
  id: number;
  Plate: IPlate;
  date: Date;
  missing: (IFoodPlate & { missingAmount: number })[];
  state: IState;
}

export interface IState {
  id: number;
  name: string;
  type: GStatesType;
}
