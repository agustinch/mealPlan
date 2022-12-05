import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import React from "react";

export interface CreatableInputOption {
  inputValue?: string;
  value?: number | string;
  label: string;
  isNew?: boolean;
}
interface Props {
  onChange: (event: any, newValue: any) => void;
  onKeyDown?: (event?: any) => void;
  value?: CreatableInputOption;
  options: CreatableInputOption[];
  id: string;
  label: string;
  name: string;
  size?: "small" | "medium" | undefined;
  error?: boolean;
}

const filter = createFilterOptions<CreatableInputOption>();

const CreatableInput = ({
  onChange,
  onKeyDown = () => {},
  value,
  options,
  label,
  error = false,
  name,
  id,
  size = undefined,
}: Props) => {
  return (
    <Autocomplete
      id={id}
      value={value}
      size={size}
      onChange={onChange}
      onKeyDown={onKeyDown}
      fullWidth
      onBlur={(e: any) => {
        if (e.target.value === value?.label) return;
        const option = options.find((o) => o.label === e.target.value);
        onChange(e, option || e.target.value);
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.label
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            label: `Agregar "${inputValue}"`,
            isNew: true,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          name={name}
          id={id}
        />
      )}
    />
  );
};
export default CreatableInput;
