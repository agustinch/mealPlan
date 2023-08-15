import { Close, Delete } from '@mui/icons-material';
import {
  Drawer,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Container,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiFetch from '../../shared/apiFetch';
import { IFood, IFoodStock } from '@global/entities';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface IngredientOption {
  value: string;
  label: string;
}

interface PlateForm {
  name: string;
  ingredientId: number;
  ingredients: {
    id: number;
    amount: number;
  }[];
}

const AddPlateForm = ({ open, onClose }: Props) => {
  const initialValues: PlateForm = {
    name: '',
    ingredientId: -1,
    ingredients: [],
  };

  const queryClient = useQueryClient();

  const { data: foodSuggestion } = useQuery<IFoodStock[]>(
    'food-suggestion-list',
    () => apiFetch.get('food')
  );

  const addIngredient = (ingredientId: number): PlateForm['ingredients'][0] => {
    const ingredient = foodSuggestion?.find((f) => f.Food.id === ingredientId);
    return {
      id: ingredient?.Food.id || -1,
      amount: 0,
    };
  };
  const addPlate = useMutation(
    (plate: PlateForm) =>
      apiFetch.post('/plate', {
        body: { name: plate.name, ingredients: plate.ingredients },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('plates');
        onClose();
      },
    }
  );
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    onSubmit: (values) => addPlate.mutate(values),
  });
  const foodSuggestionFiltered = useMemo(
    () =>
      foodSuggestion?.filter(
        (f) => !values.ingredients.some((i) => i.id === f.Food.id)
      ),
    [values, foodSuggestion]
  );

  const handleAddIngredient = () => {
    setFieldValue('ingredients', [
      ...values.ingredients,
      addIngredient(values.ingredientId),
    ]);
  };

  const handleChangeAmountIngredient = (idx: number, amount: number) => {
    setFieldValue(`ingredients.${idx}.amount`, amount);
  };

  const handleRemoveIngredient = (id: number) => {
    const newIngredients = values.ingredients.filter((i) => i.id !== id);
    setFieldValue('ingredients', newIngredients);
  };
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12} mb={3} mt={1}>
              <Typography variant="h3" color="initial">
                Add Plate
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="name"
                onChange={handleChange}
                value={values.name}
                label="Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <FormControl fullWidth>
                    <InputLabel id="ingredients-label">Ingredients</InputLabel>
                    <Select
                      labelId="ingredients-label"
                      id="select-ingredients"
                      label="Ingredients"
                      onChange={(e: any) =>
                        setFieldValue('ingredientId', e.target.value)
                      }
                      value={values.ingredientId}
                    >
                      {foodSuggestionFiltered?.map((f) => (
                        <MenuItem key={f.Food.id} value={f.Food.id}>
                          {f.Food.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAddIngredient}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <List subheader={<ListSubheader>Ingredients</ListSubheader>}>
                {values.ingredients.map((i, idx) => {
                  const ingredient = foodSuggestion?.find(
                    (f) => f.Food.id === i.id
                  );

                  return (
                    <ListItem
                      key={i.id}
                      secondaryAction={
                        <Box>
                          <TextField
                            size="small"
                            type="number"
                            value={values.ingredients[idx].amount}
                            sx={{ width: 120 }}
                            onChange={(e: any) =>
                              handleChangeAmountIngredient(
                                idx,
                                Number(e.target.value)
                              )
                            }
                            InputProps={{
                              endAdornment: (
                                <>
                                  <InputAdornment position="end">
                                    {ingredient?.Unit.name}
                                  </InputAdornment>
                                </>
                              ),
                            }}
                          />
                          <IconButton
                            onClick={() => handleRemoveIngredient(i.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText primary={ingredient?.Food.name} />
                    </ListItem>
                  );
                })}
                {values.ingredients.length < 1 && (
                  <Box textAlign="center">
                    <Typography variant="body1">
                      No hay ningún ingrediente seleccionado aún
                    </Typography>
                  </Box>
                )}
              </List>
            </Grid>
            <Grid item xs={12} textAlign="right" mt={4}>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Drawer>
  );
};

export default AddPlateForm;
