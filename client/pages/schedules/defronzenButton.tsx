import { Grid, TextField, InputAdornment, Button } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import apiFetch, { ErrorResponse } from '../../shared/apiFetch';
import toast from '../../shared/utils/toast';

interface Props {
  food_id: number;
  scheduleId: number;
  defaultAmount: number;
  unit: string;
}

interface DefrozenFoodForm {
  food_id: number;
  frozen_amount: number;
}

const DefrozenButton = ({
  food_id,
  defaultAmount,
  scheduleId,
  unit,
}: Props) => {
  const [amount, setAmount] = useState(defaultAmount || 0);
  const queryClient = useQueryClient();
  const defrozenFood = useMutation(
    ({ food_id, frozen_amount }: DefrozenFoodForm) =>
      apiFetch.patch(`/food/${food_id}/defrozen`, {
        body: { frozen_amount },
      }),
    {
      onSuccess: () => {
        toast.success('Alimento descongelado!');
        queryClient.invalidateQueries(['meal-schedule', scheduleId]);
        queryClient.invalidateQueries('meal-schedule-list');
      },
      onError: (error: ErrorResponse) => {
        toast.error(error.message);
      },
    }
  );
  return (
    <Grid container>
      <Grid xs={12} mb={1}>
        <TextField
          type="number"
          size="small"
          value={amount}
          fullWidth
          onChange={(e) => setAmount(Number(e.target.value))}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">{unit}</InputAdornment>
              </>
            ),
          }}
        />
      </Grid>
      <Grid xs={12}>
        <Button
          fullWidth
          onClick={() =>
            defrozenFood.mutate({
              food_id,
              frozen_amount: amount,
            })
          }
          variant="outlined"
        >
          Descongelar
        </Button>
      </Grid>
    </Grid>
  );
};

export default DefrozenButton;
