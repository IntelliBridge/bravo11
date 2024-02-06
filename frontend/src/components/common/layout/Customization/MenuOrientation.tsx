// material-ui
import { useTheme } from '@mui/material/styles';
import { CardMedia, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project-imports
import Avatar from 'components/ui/extended/Avatar';
import useConfig from 'hooks/useConfig';

// assets
import vertical from 'assets/images/customization/vertical.svg';
import horizontal from 'assets/images/customization/horizontal.svg';

// ==============================|| CUSTOMIZATION - MODE ||============================== //

const MenuOrientation = () => {
    const theme = useTheme();
    const { layout, onChangeLayout } = useConfig();
    return (
        <Stack direction="row" alignItems="center" pb={2} px={2} justifyContent="space-between" spacing={2.5} sx={{ width: '100%' }}>
            <Typography variant="h5">MENU ORIENTATION</Typography>
            <RadioGroup
                row
                aria-label="layout"
                value={layout}
                onChange={(e) => onChangeLayout(e.target.value)}
                name="row-radio-buttons-group"
            >
                <FormControlLabel
                    control={<Radio value="vertical" sx={{ display: 'none' }} />}
                    label={
                        <Avatar
                            size="md"
                            variant="rounded"
                            outline
                            sx={{ mr: 1.25, width: 48, height: 48, ...(layout !== 'vertical' && { borderColor: theme.palette.divider }) }}
                        >
                            <CardMedia component="img" src={vertical} alt="defaultLayout" sx={{ width: 34, height: 34 }} />
                        </Avatar>
                    }
                />
                <FormControlLabel
                    control={<Radio value="horizontal" sx={{ display: 'none' }} />}
                    label={
                        <Avatar
                            size="md"
                            variant="rounded"
                            outline
                            sx={{ width: 48, height: 48, ...(layout !== 'horizontal' && { borderColor: theme.palette.divider }) }}
                        >
                            <CardMedia component="img" src={horizontal} alt="defaultLayout" sx={{ width: 34, height: 34 }} />
                        </Avatar>
                    }
                />
            </RadioGroup>
        </Stack>
    );
};

export default MenuOrientation;
