import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';
import MainCard from 'components/ui/cards/MainCard';

const FontFamily = () => {
    const theme = useTheme();
    const { fontFamily, onChangeFontFamily } = useConfig();

    let initialFont;
    switch (fontFamily) {
        case 'Inter':
            initialFont = 'Inter';
            break;
        case 'Poppins':
            initialFont = 'Poppins';
            break;
        case `'Roboto', sans-serif`:
        default:
            initialFont = 'Roboto';
            break;
    }

    // state - font family
    const [font, setFont] = useState(initialFont);

    const handleFont = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFont(event.target.value);
        onChangeFontFamily(event.target.value);
    };

    const bgColor = theme.palette.mode === 'dark' ? 'dark.800' : 'grey.50';
    const bgActiveColor = theme.palette.mode === 'dark' ? 'primary.800' : 'primary.light';

    return (
        <Stack p={2} spacing={2.5} sx={{ width: '100%' }}>
            <Typography variant="h5">FONT STYLE</Typography>
            <RadioGroup aria-label="payment-card" name="payment-card" value={font} onChange={handleFont}>
                <Grid container spacing={1.25}>
                    <Grid item xs={12}>
                        <MainCard content={false} sx={{ p: 0.75, bgcolor: font === 'Inter' ? bgActiveColor : bgColor }}>
                            <MainCard
                                content={false}
                                border
                                sx={{
                                    p: 1.75,
                                    borderWidth: 1,
                                    ...(font === 'Inter' && { borderColor: theme.palette.primary.main })
                                }}
                            >
                                <FormControlLabel
                                    sx={{ width: 1 }}
                                    control={<Radio value="Inter" sx={{ display: 'none' }} />}
                                    label={
                                        <Typography variant="h5" sx={{ pl: 2, fontFamily: `'Inter', sans-serif` }}>
                                            Inter
                                        </Typography>
                                    }
                                />
                            </MainCard>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                        <MainCard content={false} sx={{ p: 0.75, bgcolor: font === 'Poppins' ? bgActiveColor : bgColor }}>
                            <MainCard
                                content={false}
                                border
                                sx={{
                                    p: 1.75,
                                    borderWidth: 1,
                                    ...(font === 'Poppins' && { borderColor: theme.palette.primary.main })
                                }}
                            >
                                <FormControlLabel
                                    sx={{ width: 1 }}
                                    control={<Radio value="Poppins" sx={{ display: 'none' }} />}
                                    label={
                                        <Typography variant="h5" sx={{ pl: 2, fontFamily: `'Poppins', sans-serif` }}>
                                            Poppins
                                        </Typography>
                                    }
                                />
                            </MainCard>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                        <MainCard content={false} sx={{ p: 0.75, bgcolor: font === 'Roboto' ? bgActiveColor : bgColor }}>
                            <MainCard
                                content={false}
                                border
                                sx={{
                                    p: 1.75,
                                    borderWidth: 1,
                                    ...(font === 'Roboto' && { borderColor: theme.palette.primary.main })
                                }}
                            >
                                <FormControlLabel
                                    sx={{ width: 1 }}
                                    control={<Radio value="Roboto" sx={{ display: 'none' }} />}
                                    label={
                                        <Typography variant="h5" sx={{ pl: 2, fontFamily: `'Roboto', sans-serif` }}>
                                            Roboto
                                        </Typography>
                                    }
                                />
                            </MainCard>
                        </MainCard>
                    </Grid>
                </Grid>
            </RadioGroup>
        </Stack>
    );
};

export default FontFamily;
