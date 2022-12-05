import {
  Add,
  ArrowBack,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import apiFetch from "../../shared/apiFetch";
import { IMealSchedule, IPlate } from "@global/entities";
import styles from "../../styles/Home.module.css";
import AddPlateForm from "./../plates/addPlateForm";
import AddScheduleForm from "./addScheduleForm";
import AuthCheck from "../../shared/utils/AuthCheck";
import MealScheduleState from "../../shared/components/MealScheduleState";

export default function Schedules() {
  const [isAddPlateFormOpened, setIsAddPlateFormOpened] = useState(false);
  const [isAddScheduleOpened, setIsAddScheduleOpened] = useState(false);

  const queryClient = useQueryClient();
  const { data: mealSchedules } = useQuery<IMealSchedule[]>(
    "meal-schedule-list",
    () => apiFetch.get("/meal-schedule")
  );

  const deletePlate = useMutation(
    (id: number) => apiFetch.delete(`/meal-schedule/${id}`),
    { onSuccess: () => queryClient.invalidateQueries("meal-schedule-list") }
  );

  return (
    <AuthCheck>
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} py={2}>
            <Typography variant="h3">Schedules</Typography>
          </Grid>
          <Grid item xs={12} md={12} textAlign="right" py={2}>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setIsAddScheduleOpened(true)}
            >
              Schedule
            </Button>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setIsAddPlateFormOpened(true)}
            >
              Plate
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Plate</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Accion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mealSchedules?.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {p.Plate.name}
                        {p.missing.length > 0 && (
                          <Alert severity="error">
                            Existen faltantes:{" "}
                            {p.missing
                              .map(
                                (m) =>
                                  `${m.FoodStock.name} (${m.amount}${m.FoodStock.Unit.abbreviation})`
                              )
                              .join(", ")}
                          </Alert>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(p.date), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <MealScheduleState state={p.state} />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => deletePlate.mutate(p.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <AddPlateForm
          open={isAddPlateFormOpened}
          onClose={() => setIsAddPlateFormOpened(false)}
        />

        <AddScheduleForm
          open={isAddScheduleOpened}
          onClose={() => setIsAddScheduleOpened(false)}
        />
      </Container>
    </AuthCheck>
  );
}
