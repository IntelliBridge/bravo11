// material-ui
import { useTheme } from '@mui/material/styles';
import { CardMedia, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project-imports
import Avatar from 'components/ui/extended/Avatar';
import useConfig from 'hooks/useConfig';

// assets
import big from 'assets/images/customization/big.svg';
import small from 'assets/images/customization/small.svg';

// ==============================|| CUSTOMIZATION - MODE ||============================== //

const BoxContainer = () => {
    const theme = useTheme();
    const { container, onChangeContainer } = useConfig();

    const changeWidth = (e: any) => {
        const newContainer = e.target.value === 'container';
        if (newContainer !== container) {
            onChangeContainer(newContainer);
        }
    };

    return (
        <Stack direction="row" alignItems="center" pb={2} px={2} justifyContent="space-between" spacing={2} sx={{ width: '100%' }}>
            <Typography variant="h5">THEME WIDTH</Typography>
            <RadioGroup row aria-label="layout" value={container} onChange={changeWidth} name="row-radio-buttons-group">
                <FormControlLabel
                    control={<Radio value="fluid" sx={{ display: 'none' }} />}
                    label={
                        <Avatar
                            size="md"
                            variant="rounded"
                            outline
                            sx={{ mr: 1.25, width: 48, height: 48, ...(container && { borderColor: theme.palette.divider }) }}
                        >
                            <CardMedia component="img" src={big} alt="defaultLayout" sx={{ width: 28, height: 28 }} />
                        </Avatar>
                    }
                />
                <FormControlLabel
                    control={<Radio value="container" sx={{ display: 'none' }} />}
                    label={
                        <Avatar
                            size="md"
                            variant="rounded"
                            outline
                            sx={{ width: 48, height: 48, ...(!container && { borderColor: theme.palette.divider }) }}
                        >
                            <CardMedia component="img" src={small} alt="defaultLayout" sx={{ width: 16, height: 28 }} />
                        </Avatar>
                    }
                />
            </RadioGroup>
        </Stack>
    );
};

export default BoxContainer;
