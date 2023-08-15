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
import apiFetch from '../../shared/apiFetch';
import { IFood, IPlate } from '@global/entities';
import CreatableInput, {
  CreatableInputOption,
} from '../../shared/components/CreatableInput';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface IngredientOption {
  value: string;
  label: string;
}

interface PlateForm {
  plate: CreatableInputOption;
  plate_id: number;
  date: Date;
}

const AddScheduleForm = ({ open, onClose }: Props) => {
  const initialValues: PlateForm = {
    plate: { value: '', label: '' },
    plate_id: -1,
    date: new Date(),
  };

  const queryClient = useQueryClient();

  const { data: plateSuggestion } = useQuery<IPlate[]>('plate-list', () =>
    apiFetch.get('/plate')
  );

  const addPlate = useMutation(
    (plate: PlateForm) =>
      apiFetch.post('/meal-schedule', {
        body: {
          plate_id: Number(plate.plate.value) || undefined,
          date: plate.date,
          plate_name: plate.plate.label,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('meal-schedule-list');
        onClose();
      },
    }
  );
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    onSubmit: (values) => addPlate.mutate(values),
  });

  const handleChangeCreatableInput = (
    newValue: CreatableInputOption | string
  ) => {
    if (typeof newValue === 'string') {
      setFieldValue('plate', { value: '', label: newValue });
      return;
    }
    if (newValue?.isNew && newValue?.inputValue) {
      setFieldValue('plate', { value: '', label: newValue.inputValue });

      return;
    }
    if (newValue?.value) {
      setFieldValue('plate', {
        value: String(newValue.value),
        label: newValue.label,
      });
      return;
    }
    setFieldValue('plate', { value: '', label: '' });
  };

  const filteredPlateSuggestion = useMemo(
    () => plateSuggestion?.map((f) => ({ value: String(f.id), label: f.name })),
    [plateSuggestion]
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} p={2}>
            <Grid item xs={12} mb={3} mt={1}>
              <Typography variant="h3" color="initial">
                Add Schedule
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CreatableInput
                size="small"
                id="select-plate"
                value={values.plate}
                label="Food"
                name="food"
                onChange={(e, value) => {
                  handleChangeCreatableInput(value);
                }}
                options={filteredPlateSuggestion || []}
              />
            </Grid>
            <Grid item xs={12}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} fullWidth />}
                label="Fecha y hora"
                value={values.date}
                onChange={(value) => setFieldValue('date', value)}
              />
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

export default AddScheduleForm;
