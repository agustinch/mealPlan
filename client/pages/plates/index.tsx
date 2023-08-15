import {
  Add,
  ArrowBack,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import {
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
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiFetch from '../../shared/apiFetch';
import { IPlate } from '@global/entities';
import styles from '../../styles/Home.module.css';
import AddPlateForm from './addPlateForm';
import AuthCheck from '../../shared/utils/AuthCheck';
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
export default function Plates() {
  const [isAddPlateFormOpened, setIsAddPlateFormOpened] = useState(false);
  const queryClient = useQueryClient();
  const { data: plates } = useQuery<IPlate[]>('plates', () =>
    apiFetch.get('/plate')
  );

  const deletePlate = useMutation(
    (id: number) => apiFetch.delete(`/plate/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('plates') }
  );

  return (
    <AuthCheck>
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} py={2}>
            <Typography variant="h3">Plates</Typography>
          </Grid>
          <Grid item xs={12} md={12} textAlign="right" py={2}>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Ingredients</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plates?.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>
                        {p.FoodPlate?.map(
                          (i) =>
                            `${i.FoodStock.Food.name} (${i.amount} ${i.FoodStock.Unit.name})`
                        ).join(', ')}
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
      </Container>
    </AuthCheck>
  );
}
