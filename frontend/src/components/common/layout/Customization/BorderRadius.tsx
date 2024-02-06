// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Slider, Stack, Typography } from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';

// concat 'px'
function valueText(value: number) {
    return `${value}px`;
}

const BorderRadius = () => {
    const theme = useTheme();
    const { borderRadius, onChangeBorderRadius } = useConfig();

    return (
        <Stack spacing={2.5} pl={2} pb={2} pr={4}>
            <Typography variant="h5">BORDER RADIUS</Typography>
            <Grid item xs={12} container spacing={1.25} alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h6">4px</Typography>
                </Grid>
                <Grid item xs>
                    <Slider
                        size="small"
                        value={borderRadius}
                        onChange={onChangeBorderRadius}
                        getAriaValueText={valueText}
                        valueLabelDisplay="on"
                        aria-labelledby="discrete-slider-small-steps"
                        min={4}
                        max={24}
                        color="primary"
                        sx={{
                            '& .MuiSlider-valueLabel': {
                                color: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light'
                            }
                        }}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="h6">24px</Typography>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default BorderRadius;
