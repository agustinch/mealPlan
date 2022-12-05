import { Delete } from "@mui/icons-material";
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
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import React, { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import apiFetch from "../../shared/apiFetch";
import { IFood } from "@global/entities";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface IngredientOption {
  value: string;
  label: string;
}

interface PlateForm {
  plate_id: number;
  date: Date;
}

const AddScheduleForm = ({ open, onClose }: Props) => {
  const initialValues: PlateForm = {
    plate_id: -1,
    date: new Date(),
  };

  const queryClient = useQueryClient();

  const { data: plateSuggestion } = useQuery<IFood[]>("plate-list", () =>
    apiFetch.get("/plate")
  );

  const addPlate = useMutation(
    (plate: PlateForm) =>
      apiFetch.post("/meal-schedule", {
        body: plate,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("meal-schedule-list");
        onClose();
      },
    }
  );
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    onSubmit: (values) => addPlate.mutate(values),
  });

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1} p={2}>
          <Grid item xs={12} mb={3} mt={1}>
            <Typography variant="h3" color="initial">
              Add Schedule
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="ingredients-label">Plates</InputLabel>
              <Select
                labelId="ingredients-label"
                id="select-ingredients"
                label="Plates"
                onChange={(e: any) =>
                  setFieldValue("plate_id", Number(e.target.value))
                }
                value={values.plate_id}
              >
                {plateSuggestion?.map((f) => (
                  <MenuItem value={f.id}>{f.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Fecha y hora"
              value={values.date}
              onChange={(value) => setFieldValue("date", value)}
            />
          </Grid>
          <Grid item xs={12} textAlign="right" mt={4}>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Drawer>
  );
};

export default AddScheduleForm;
