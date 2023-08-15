import { Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiFetch from '../../shared/apiFetch';
import AuthCheck from '../../shared/utils/AuthCheck';
import { IFoodStock } from '@global/entities';
import AddUpdateFoodForm from './addUpdateFoodForm';

export const Food = () => {
  const { data: food } = useQuery<IFoodStock[]>('food', () =>
    apiFetch.get('/food')
  );

  const [editFood, setEditFood] = useState<IFoodStock>();
  const [isOpenFoodForm, setIsOpenFoodForm] = useState(false);
  const queryClient = useQueryClient();

  const deleteFood = useMutation(
    (foodId: number) => apiFetch.delete(`/food/${foodId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('food');
        queryClient.invalidateQueries('food-suggestion');
      },
    }
  );

  const filteredFood = useMemo(
    () => food?.filter((f) => f.show_on_list),
    [food]
  );

  const formatterAmountFoodText = (
    fridge_amount: number | null,
    frozen_amount: number | null,
    unit_name: string
  ) =>
    frozen_amount
      ? `Descongelado: ${fridge_amount} ${unit_name} | Congelado: ${frozen_amount} ${unit_name}`
      : `Descongelado: ${fridge_amount} ${unit_name}`;

  return (
    <AuthCheck>
      <Container sx={{ padding: 0 }}>
        <Typography variant="h3">Food</Typography>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} textAlign="end">
            <Button variant="contained" onClick={() => setIsOpenFoodForm(true)}>
              Add food
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <List>
              {filteredFood?.map((f) => (
                <ListItem
                  key={f.Food.id}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Box>
                    <ListItemText
                      primary={f.Food.name}
                      secondary={formatterAmountFoodText(
                        f.fridge_amount,
                        f.frozen_amount,
                        f.Unit.abbreviation
                      )}
                    />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <IconButton
                      onClick={() => {
                        setEditFood(f);
                        setIsOpenFoodForm(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => deleteFood.mutate(f.Food.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <AddUpdateFoodForm
          onOpen={() => setIsOpenFoodForm(true)}
          onClose={() => {
            setIsOpenFoodForm(false);
            setEditFood(undefined);
          }}
          open={isOpenFoodForm}
          foodList={filteredFood}
          editFood={editFood}
        />
      </Container>
    </AuthCheck>
  );
};
export default Food;
