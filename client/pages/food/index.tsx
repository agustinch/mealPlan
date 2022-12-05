import {
  ArrowBack,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Remove,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import apiFetch from "../../shared/apiFetch";
import CreatableInput, {
  CreatableInputOption,
} from "../../shared/components/CreatableInput";
import AuthCheck from "../../shared/utils/AuthCheck";
import withAuth from "../../shared/utils/AuthCheck";
import styles from "../../styles/Home.module.css";
import { IFood, IUnit } from "@global/entities";

export const Food = () => {
  const { data: food } = useQuery<IFood[]>("food", () => apiFetch.get("/food"));
  const { data: units } = useQuery<IUnit[]>("units", () =>
    apiFetch.get("/food/units")
  );
  const { data: foodSuggestion } = useQuery<IFood[]>("food-suggestion", () =>
    apiFetch.get("/food/suggestion")
  );
  const [foodInput, setFoodInput] = useState({ value: "", label: "" });
  const [unitInput, setUnitInput] = useState(-1);

  const queryClient = useQueryClient();
  const addFood = useMutation(
    (food: any) => apiFetch.post("/food", { body: food }),
    {
      onSuccess: () => queryClient.invalidateQueries("food"),
    }
  );

  const addFoodAmount = useMutation(
    (food: any) =>
      apiFetch.patch(`/food/${food.id}/amount`, {
        body: { amount: food.amount },
      }),
    {
      onSuccess: () => queryClient.invalidateQueries("food"),
    }
  );

  const deleteFood = useMutation(
    (foodId: number) => apiFetch.delete(`/food/${foodId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("food");
        queryClient.invalidateQueries("food-suggestion");
      },
    }
  );

  const filteredFood = useMemo(
    () => food?.filter((f) => f.show_on_list),
    [food]
  );

  const handleKeyDownFoodInput = (event: any) => {
    if (event.key === "Enter" && foodInput.label) {
      addFood.mutate({
        food_id: Number(foodInput.value) || undefined,
        name: foodInput.label,
        unit_id: unitInput,
        order: Number(filteredFood?.length || 0) + 1,
      });
      event.target.value = "";
    }
  };

  const filteredFoodSuggestion = useMemo(
    () =>
      foodSuggestion
        ?.filter((fs) => !filteredFood?.some((f) => f.id === fs.id))
        .map((f) => ({ value: String(f.id), label: f.name })),
    [foodSuggestion, filteredFood]
  );

  const handleChangeCreatableInput = (
    newValue: CreatableInputOption | string
  ) => {
    if (typeof newValue === "string") {
      setFoodInput({ value: "", label: newValue });
      return;
    }
    if (newValue?.isNew && newValue?.inputValue) {
      setFoodInput({ value: "", label: newValue.inputValue });

      return;
    }
    if (newValue?.value) {
      setFoodInput({ value: String(newValue.value), label: newValue.label });
      return;
    }
    setFoodInput({ value: "", label: "" });
  };
  return (
    <AuthCheck>
      <Container>
        <Typography variant="h3">Food</Typography>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <List>
              {filteredFood?.map((f) => (
                <ListItem
                  key={f.id}
                  secondaryAction={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TextField
                        size="small"
                        type="number"
                        defaultValue={f.amount}
                        sx={{ width: 120 }}
                        onBlur={(e: any) =>
                          addFoodAmount.mutate({
                            id: f.id,
                            amount: Number(e.target.value),
                          })
                        }
                        InputProps={{
                          endAdornment: (
                            <>
                              <InputAdornment position="end">
                                {f.Unit.abbreviation}
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                      <IconButton onClick={() => deleteFood.mutate(f.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText primary={f.name} />
                </ListItem>
              ))}

              <ListItem>
                <CreatableInput
                  size="small"
                  id="select-email"
                  value={foodInput}
                  label="Add new food"
                  name="food"
                  onKeyDown={handleKeyDownFoodInput}
                  onChange={(e, value) => {
                    handleChangeCreatableInput(value);
                  }}
                  options={filteredFoodSuggestion || []}
                />
                <Select
                  size="small"
                  labelId="units-label"
                  id="select-units"
                  placeholder="unit"
                  onChange={(e: any) => setUnitInput(Number(e.target.value))}
                  value={unitInput}
                >
                  {units?.map((u) => (
                    <MenuItem value={u.id}>{u.name}</MenuItem>
                  ))}
                </Select>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </AuthCheck>
  );
};
export default Food;
