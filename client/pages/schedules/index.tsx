import {
  Add,
  ArrowBack,
  Check,
  CheckCircle,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { format, parse, parseISO } from 'date-fns';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiFetch, { ErrorResponse } from '../../shared/apiFetch';
import { IMealSchedule, IPlate } from '@global/entities';
import styles from '../../styles/Home.module.css';
import AddPlateForm from './../plates/addPlateForm';
import AddScheduleForm from './addScheduleForm';
import AuthCheck from '../../shared/utils/AuthCheck';
import MealScheduleState from '../../shared/components/MealScheduleState';
import { ScheduleStates } from '../../shared/utils/constants';
import ScheduleManager from './scheduleManager';
import toast from '../../shared/utils/toast';

export default function Schedules() {
  const [isAddPlateFormOpened, setIsAddPlateFormOpened] = useState(false);
  const [isAddScheduleOpened, setIsAddScheduleOpened] = useState(false);
  const [isScheduleManager, setIsScheduleManager] =
    useState<IMealSchedule['id']>();

  const queryClient = useQueryClient();
  const { data: mealSchedules } = useQuery<IMealSchedule[]>(
    'meal-schedule-list',
    () => apiFetch.get('/meal-schedule')
  );

  const deleteSchedule = useMutation(
    (id: number) => apiFetch.delete(`/meal-schedule/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('meal-schedule-list') }
  );

  const doneSchedule = useMutation(
    (id: number) => apiFetch.patch(`/meal-schedule/done/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries('meal-schedule-list'),
      onError: (error: ErrorResponse) => toast.error(error.message),
    }
  );

  const revertSchedule = useMutation(
    (id: number) => apiFetch.patch(`/meal-schedule/to-do/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('meal-schedule-list') }
  );

  return (
    <AuthCheck>
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} py={2}>
            <Typography variant="h3">Schedules!!!</Typography>
          </Grid>
          <Grid item xs={12} md={12} textAlign="right" py={2}>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setIsAddScheduleOpened(true)}
            >
              Schedule
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
                      <TableCell
                        sx={{ cursor: 'pointer' }}
                        onClick={() => setIsScheduleManager(p.id)}
                      >
                        {p.Plate.name}
                        {p.missing.length > 0 && (
                          <Alert severity="error">
                            Existen faltantes:{' '}
                            {p.missing
                              .map(
                                (m) =>
                                  `${m.FoodStock.Food.name} (${Math.abs(
                                    m.missingAmount
                                  )}${m.FoodStock.Unit.abbreviation})`
                              )
                              .join(', ')}
                          </Alert>
                        )}
                        {p.frozen.length > 0 && (
                          <Alert severity="warning">
                            Hay alimentos congelados:{' '}
                            {p.frozen
                              .map(
                                (m) =>
                                  `${m.FoodStock.Food.name} (${m.amount}${m.FoodStock.Unit.abbreviation})`
                              )
                              .join(', ')}
                          </Alert>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(String(p.date)), 'EEEE dd MMM HH:mm')}
                      </TableCell>
                      <TableCell>
                        <MealScheduleState state={p.state} />
                      </TableCell>
                      <TableCell>
                        {p.state.id === ScheduleStates.TO_DO && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              sx={{ mr: 2 }}
                              onClick={() => doneSchedule.mutate(p.id)}
                            >
                              Done
                            </Button>
                            <IconButton
                              onClick={() => deleteSchedule.mutate(p.id)}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        )}
                        {p.state.id === ScheduleStates.DONE && (
                          <>
                            <Button
                              variant="contained"
                              color="info"
                              sx={{ mr: 2 }}
                              onClick={() => revertSchedule.mutate(p.id)}
                            >
                              To Do
                            </Button>
                          </>
                        )}
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
        <ScheduleManager
          open={!!isScheduleManager}
          scheduleId={isScheduleManager}
          onClose={() => setIsScheduleManager(undefined)}
        />
      </Container>
    </AuthCheck>
  );
}
