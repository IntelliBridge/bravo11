import { useEffect, useState, SyntheticEvent } from 'react';
import { Link, useParams } from 'react-router-dom';

// material-ui
import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';

// project imports
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';
import ProductDescription from './ProductDescription';
import ProductReview from './ProductReview';
import RelatedProducts from './RelatedProducts';

import Loader from 'components/ui/Loader';
import MainCard from 'components/ui/cards/MainCard';
import Chip from 'components/ui/extended/Chip';
import FloatingCart from 'components/ui/cards/FloatingCart';

import { useDispatch, useSelector } from 'store/slices/legacy';
import { gridSpacing } from 'store/slices/legacy/constant';
import { getProduct } from 'store/slices/legacy/product';
import { resetCart } from 'store/slices/legacy/cart';

// types
import { DefaultRootStateProps, TabsProps } from 'types';

function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`product-details-tabpanel-${index}`}
            aria-labelledby={`product-details-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `product-details-tab-${index}`,
        'aria-controls': `product-details-tabpanel-${index}`
    };
}

const ProductDetails = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const cart = useSelector((state: DefaultRootStateProps) => state.cart);
    const { product } = useSelector((state) => state.product);

    const [loading, setLoading] = useState<boolean>(true);

    // product description tabs
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        dispatch(getProduct(id)).then(() => setLoading(false));

        // clear cart if complete order
        if (cart.checkout.step > 2) {
            dispatch(resetCart());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(getProduct(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) return <Loader />;

    return (
        <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
            <Grid item xs={12} lg={10}>
                <MainCard>
                    {product && product?.id === Number(id) && (
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={6}>
                                <ProductImages product={product} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ProductInfo product={product} />
                            </Grid>
                            <Grid item xs={12}>
                                <Tabs
                                    value={value}
                                    indicatorColor="primary"
                                    onChange={handleChange}
                                    sx={{}}
                                    aria-label="product description tabs example"
                                    variant="scrollable"
                                >
                                    <Tab component={Link} to="#" label="Description" {...a11yProps(0)} />
                                    <Tab
                                        component={Link}
                                        to="#"
                                        label={
                                            <Stack direction="row" alignItems="center">
                                                Reviews{' '}
                                                <Chip
                                                    label={String(product.salePrice)}
                                                    size="small"
                                                    chipcolor="secondary"
                                                    sx={{ ml: 1.5 }}
                                                />
                                            </Stack>
                                        }
                                        {...a11yProps(1)}
                                    />
                                </Tabs>
                                <TabPanel value={value} index={0}>
                                    <ProductDescription />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <ProductReview product={product} />
                                </TabPanel>
                            </Grid>
                        </Grid>
                    )}
                </MainCard>
            </Grid>
            <Grid item xs={12} lg={10} sx={{ mt: 3 }}>
                <Typography variant="h2">Related Products</Typography>
            </Grid>
            <Grid item xs={11} lg={10}>
                <RelatedProducts id={id} />
            </Grid>
            <FloatingCart />
        </Grid>
    );
};

export default ProductDetails;
