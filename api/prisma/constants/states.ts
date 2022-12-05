import { StateType } from '@prisma/client';

const mealScheduleStates = {
  TO_DO: {
    id: 1,
    name: 'To Do',
    type: StateType.MEAL_SCHEDULE,
  },
  DONE: {
    id: 2,
    name: 'Done',
    type: StateType.MEAL_SCHEDULE,
  },
};

export default [mealScheduleStates.TO_DO, mealScheduleStates.DONE];
