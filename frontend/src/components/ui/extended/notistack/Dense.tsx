import { useState, ChangeEvent } from 'react';

// material-ul
import { Button, Checkbox } from '@mui/material';

// third-party
import { enqueueSnackbar } from 'notistack';

// project import
import SubCard from 'components/ui/cards/SubCard';
import { handlerDense } from 'store/slices/legacy/snackbar';
import { dispatch } from 'store/slices/legacy';

// ==============================|| NOTISTACK - DENSE ||============================== //

export default function Dense() {
    const [checked, setChecked] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        dispatch(handlerDense({ dense: event.target.checked }));
    };

    return (
        <SubCard title="Dense">
            <Checkbox checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
            Dense margins
            <Button variant="outlined" fullWidth sx={{ marginBlockStart: 2 }} onClick={() => enqueueSnackbar('Your notification here')}>
                Show snackbar
            </Button>
        </SubCard>
    );
}
