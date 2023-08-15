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
import { DateTimePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import React, { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiFetch, { ErrorResponse } from '../../shared/apiFetch';
import { IFood, IMealSchedule } from '@global/entities';
import { yellow } from '@mui/material/colors';
import { format } from 'date-fns';
import toast from '../../shared/utils/toast';
import DefrozenButton from './defronzenButton';

interface Props {
  open: boolean;
  scheduleId?: IMealSchedule['id'];
  onClose: () => void;
}

interface IngredientOption {
  value: string;
  label: string;
}

interface AddFoodForm {
  food_id: number;
  fridge_amount: number;
}

const ScheduleManager = ({ open, onClose, scheduleId }: Props) => {
  const queryClient = useQueryClient();
  const { data: schedule } = useQuery<IMealSchedule>(
    ['meal-schedule', scheduleId],
    () => apiFetch.get(`/meal-schedule/${scheduleId}`),
    { enabled: !!scheduleId }
  );
  const addFood = useMutation(
    ({ food_id, fridge_amount }: AddFoodForm) =>
      apiFetch.patch(`/food/${food_id}/add`, {
        body: { fridge_amount },
      }),
    {
      onSuccess: () => {
        toast.success('Alimento agregado!');
        queryClient.invalidateQueries(['meal-schedule', scheduleId]);
        queryClient.invalidateQueries('meal-schedule-list');
      },
    }
  );

  const isMissing = (id: number, missing: IMealSchedule['missing']) => {
    const food = missing.find((p) => p.FoodStock.Food.id === id);
    return food;
  };
  const isFrozen = (id: number, frozen: IMealSchedule['frozen']) => {
    const food = frozen.find((p) => p.FoodStock.Food.id === id);
    return food;
  };
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <Container maxWidth="sm">
        <Grid container spacing={1} p={1}>
          <Grid item xs={12} mb={3} mt={1}>
            <Typography variant="h4" color="initial">
              {schedule?.Plate.name}
            </Typography>
            <Typography variant="subtitle1" color="initial">
              {schedule?.date &&
                format(new Date(schedule?.date), 'EEEE dd HH:mm')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" color="initial">
              Ingredients
            </Typography>
            <List>
              {schedule?.Plate.FoodPlate?.map((f) => {
                const isMissingFood = isMissing(
                  f.FoodStock.Food.id,
                  schedule.missing
                );
                const isFrozenFood = isFrozen(
                  f.FoodStock.Food.id,
                  schedule.frozen
                );
                return (
                  <ListItem key={f.FoodStock.Food.id}>
                    <Grid container>
                      <Grid sm={9}>
                        {f.FoodStock.Food.name} ({f.amount}{' '}
                        {f.FoodStock.Unit.abbreviation})
                        {isMissingFood && (
                          <Typography variant="body1" color="red">
                            Faltante ({Math.abs(isMissingFood.missingAmount)}{' '}
                            {isMissingFood.FoodStock.Unit.abbreviation})
                          </Typography>
                        )}
                        {isFrozenFood && (
                          <Typography variant="body1" color={yellow[900]}>
                            Está congelado (
                            {Math.abs(isFrozenFood.frozenAmount)}{' '}
                            {isFrozenFood.FoodStock.Unit.abbreviation})
                          </Typography>
                        )}
                      </Grid>
                      <Grid sm={3}>
                        {isMissingFood && (
                          <Button
                            onClick={() =>
                              addFood.mutate({
                                food_id: f.FoodStock.Food.id,
                                fridge_amount: isMissingFood.missingAmount,
                              })
                            }
                            variant="contained"
                          >
                            Add
                          </Button>
                        )}
                        {isFrozenFood && (
                          <DefrozenButton
                            scheduleId={schedule.id}
                            defaultAmount={
                              f.FoodStock.frozen_quantity_per_package ||
                              f.amount
                            }
                            food_id={f.FoodStock.Food.id}
                            unit={f.FoodStock.Unit.abbreviation}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </Container>
    </Drawer>
  );
};

export default ScheduleManager;
