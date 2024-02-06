import React from 'react';

// material-ui
import { Grid, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

// project imports
import CustomDateTime from './CustomDateTime';
import MainCard from 'components/ui/cards/MainCard';
import SubCard from 'components/ui/cards/SubCard';
import SecondaryAction from 'components/ui/cards/CardSecondaryAction';
import { gridSpacing } from 'store/slices/legacy/constant';

// ==============================|| DATETIME ||============================== //

const DateTime = () => {
    const [valueBasic, setValueBasic] = React.useState<Date | null>(new Date());

    return (
        <MainCard title="Date & Time" secondary={<SecondaryAction link="https://next.material-ui.com/components/date-time-picker/" />}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={6}>
                    <SubCard title="Basic Datetime Picker">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                                label="Date & Time"
                                value={valueBasic}
                                onChange={(newValue: Date | null) => {
                                    setValueBasic(newValue);
                                }}
                            />
                        </LocalizationProvider>
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="Disabled">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                                label="Date & Time"
                                value={valueBasic}
                                onChange={(newValue) => {
                                    setValueBasic(newValue);
                                }}
                                disabled
                            />
                        </LocalizationProvider>
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="Mobile Mode">
                        <CustomDateTime />
                    </SubCard>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default DateTime;
