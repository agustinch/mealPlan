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
  Checkbox,
  FormControlLabel,
  FormGroup,
  styled,
  SwipeableDrawer,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import React, { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiFetch from '../../shared/apiFetch';
import { IFood, IFoodStock, IUnit } from '@global/entities';
import { grey } from '@mui/material/colors';
import { values } from 'lodash';
import CreatableInput, {
  CreatableInputOption,
} from '../../shared/components/CreatableInput';
import AddPlateForm from '../plates/addPlateForm';
import { isMobile } from 'react-device-detect';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  foodList?: IFoodStock[];
  editFood?: IFoodStock;
}

interface FoodForm {
  food?: CreatableInputOption;
  food_id?: number;
  food_name?: string;
  unit_id: number;
  fridge_amount: number | null;
  frozen_amount: number | null;
  frozen_quantity_per_package?: number | null;
  allow_use_frozen_amount: boolean;
  frozen_food: boolean;
  use_frozen_packages: boolean;
}

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const AddUpdateFoodForm = ({
  open,
  onClose,
  onOpen,
  foodList,
  editFood,
}: Props) => {
  const { data: units } = useQuery<IUnit[]>('units', () =>
    apiFetch.get('/food/units')
  );
  const { data: foodSuggestion } = useQuery<IFood[]>('food-suggestion', () =>
    apiFetch.get('/food/suggestion')
  );
  const queryClient = useQueryClient();
  const foodForm: FoodForm = useMemo(
    () =>
      editFood
        ? {
            food: { value: editFood.Food.id, label: editFood.Food.name },
            unit_id: editFood.Unit.id,
            fridge_amount: editFood.fridge_amount,
            frozen_amount: editFood.frozen_amount,
            frozen_quantity_per_package:
              editFood.frozen_quantity_per_package || null,
            allow_use_frozen_amount: editFood.allow_use_frozen_amount,
            frozen_food: editFood.frozen_amount !== null ? true : false,
            use_frozen_packages: !!editFood.frozen_quantity_per_package,
          }
        : {
            food: { value: '', label: '' },
            unit_id: -1,
            fridge_amount: 0,
            frozen_amount: null,
            frozen_quantity_per_package: null,
            allow_use_frozen_amount: false,
            frozen_food: false,
            use_frozen_packages: false,
          },
    [editFood]
  );

  const addFood = useMutation((body: any) => apiFetch.post('/food', { body }), {
    onSuccess: () => queryClient.invalidateQueries('food'),
  });

  const updateFood = useMutation(
    (food: any) =>
      apiFetch.patch(`/food/${food.food_id}`, {
        body: food,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('food');
        onClose();
      },
    }
  );

  const onSubmitForm = (
    data: FoodForm,
    { resetForm }: FormikHelpers<FoodForm>
  ) => {
    let body: any = {
      ...data,
      food_id: Number(data.food?.value) || undefined,
      name: data.food?.label || '',
      use_frozen_packages: undefined,
      food: undefined,
      frozen_food: undefined,
    };
    if (editFood) {
      updateFood.mutate(body);
      return;
    }
    body = { ...body, order: foodList?.length ? foodList?.length + 1 : 1 };
    addFood.mutate(body);
    resetForm();
  };

  const { handleChange, values, handleSubmit, setFieldValue } = useFormik({
    initialValues: foodForm,
    onSubmit: onSubmitForm,
    enableReinitialize: true,
  });
  const handleChangeCreatableInput = (
    newValue: CreatableInputOption | string
  ) => {
    if (typeof newValue === 'string') {
      setFieldValue('food', { value: '', label: newValue });
      return;
    }
    if (newValue?.isNew && newValue?.inputValue) {
      setFieldValue('food', { value: '', label: newValue.inputValue });

      return;
    }
    if (newValue?.value) {
      setFieldValue('food', {
        value: String(newValue.value),
        label: newValue.label,
      });
      return;
    }
    setFieldValue('food', { value: '', label: '' });
  };

  const filteredFoodSuggestion = useMemo(
    () =>
      foodSuggestion
        ?.filter((fs) => !foodList?.some((f) => f.Food.id === fs.id))
        .map((f) => ({ value: String(f.id), label: f.name })),
    [foodSuggestion, foodList]
  );

  return (
    <SwipeableDrawer
      onClose={onClose}
      onOpen={onOpen}
      disableBackdropTransition={true}
      disableDiscovery={true}
      open={open}
      anchor="bottom"
      hideBackdrop={true}
      PaperProps={{
        style: { borderTopLeftRadius: 15, borderTopRightRadius: 15 },
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          component="div"
          sx={{
            width: '100%',
            display: 'flex',
            backgroundColor: 'white',
            padding: '12px',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {isMobile ? (
                <Puller />
              ) : (
                <Box textAlign="right">
                  <IconButton onClick={onClose}>
                    <Close />
                  </IconButton>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <CreatableInput
                size="small"
                id="select-email"
                value={values.food}
                label="Food"
                name="food"
                onChange={(e, value) => {
                  handleChangeCreatableInput(value);
                }}
                options={filteredFoodSuggestion || []}
              />
            </Grid>

            <Grid xs={12} item>
              <FormControl fullWidth>
                <InputLabel id="units-label">Units</InputLabel>
                <Select
                  size="small"
                  labelId="units-label"
                  id="select-units"
                  sx={{ width: '100%' }}
                  defaultValue={units?.[0]?.id}
                  label="Unit"
                  onChange={(e: any) =>
                    setFieldValue('unit_id', Number(e.target.value))
                  }
                  value={values.unit_id || units?.[0]?.id}
                >
                  {units?.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} item>
              <FormGroup>
                <FormControlLabel
                  onChange={handleChange}
                  value={values.frozen_food}
                  name="frozen_food"
                  checked={values.frozen_food}
                  control={<Checkbox defaultChecked />}
                  label="Vas a congerlar una parte o todo?"
                />
              </FormGroup>
            </Grid>
            <Grid xs={values.frozen_food ? 6 : 12} item>
              <TextField
                size="small"
                type="number"
                defaultValue={0}
                name="fridge_amount"
                fullWidth
                label={
                  values.frozen_food ? 'Cantidad descongelada' : 'Cantidad'
                }
                onChange={handleChange}
                value={values.fridge_amount}
                InputProps={{
                  endAdornment: (
                    <>
                      <InputAdornment position="end">
                        {
                          units?.find((u) => u.id === values.unit_id)
                            ?.abbreviation
                        }
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            </Grid>
            {values.frozen_food && (
              <Grid xs={6} item>
                <TextField
                  size="small"
                  type="number"
                  defaultValue={0}
                  value={values.frozen_amount}
                  name="frozen_amount"
                  label="Cantidad congelada"
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <>
                        <InputAdornment position="end">
                          {
                            units?.find((u) => u.id === values.unit_id)
                              ?.abbreviation
                          }
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              </Grid>
            )}
            <Grid item>
              <FormGroup>
                <FormControlLabel
                  onChange={handleChange}
                  checked={values.use_frozen_packages}
                  name="use_frozen_packages"
                  control={<Checkbox defaultChecked />}
                  label="Descongelar paquetes"
                />
              </FormGroup>
            </Grid>
            {values.use_frozen_packages && (
              <Grid xs={12} item>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  onChange={handleChange}
                  value={values.frozen_quantity_per_package}
                  name="frozen_quantity_per_package"
                  defaultValue={0}
                  label="Cantidad por paquete"
                />
              </Grid>
            )}
            <Grid xs={12} item>
              <Button type="submit" fullWidth variant="contained">
                {editFood ? 'Save' : 'Add'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </SwipeableDrawer>
  );
};

export default AddUpdateFoodForm;
