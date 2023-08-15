import { IState } from "@global/entities";
import { Chip, ChipTypeMap } from "@mui/material";
import { ScheduleStates } from "../../utils/constants";

interface Props {
  state: IState;
}

const stateColor = {
  [String(ScheduleStates.TO_DO)]: {
    color: "primary",
  },
  [String(ScheduleStates.DONE)]: {
    color: "success",
  },
};

export const MealScheduleState = ({ state }: Props) => {
  return (
    <Chip
      label={state.name}
      color={
        (stateColor?.[String(state.id)]
          ?.color as ChipTypeMap["props"]["color"]) || "default"
      }
    />
  );
};
export default MealScheduleState;
