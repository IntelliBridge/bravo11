import { useEffect, useState, ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// third-party
import Slider from 'react-slick';

// project imports
import ProductCard from 'components/ui/cards/ProductCard';
import { Products } from 'types/e-commerce';
import { useDispatch, useSelector } from 'store/slices/legacy';
import { getRelatedProducts } from 'store/slices/legacy/product';

// ==============================|| PRODUCT DETAILS - RELATED PRODUCTS ||============================== //

const RelatedProducts = ({ id }: { id?: string }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [related, setRelated] = useState<Products[]>([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
    const matchDownXL = useMediaQuery(theme.breakpoints.down('xl'));
    const matchUpXL = useMediaQuery(theme.breakpoints.up('xl'));
    const { relatedProducts } = useSelector((state) => state.product);

    useEffect(() => {
        setRelated(relatedProducts);
    }, [relatedProducts]);

    useEffect(() => {
        dispatch(getRelatedProducts(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (matchDownSM) {
            setItemsToShow(1);
            return;
        }
        if (matchDownMD) {
            setItemsToShow(2);
            return;
        }
        if (matchDownLG) {
            setItemsToShow(3);
            return;
        }
        if (matchDownXL) {
            setItemsToShow(4);
            return;
        }
        if (matchUpXL) {
            setItemsToShow(5);
        }
    }, [matchDownSM, matchDownMD, matchDownLG, matchDownXL, matchUpXL, itemsToShow]);

    const settings = {
        dots: false,
        centerMode: true,
        swipeToSlide: true,
        focusOnSelect: true,
        centerPadding: '0px',
        slidesToShow: itemsToShow
    };

    let productResult: ReactElement | ReactElement[] = <></>;
    if (related) {
        productResult = related.map((product: Products, index) => (
            <Box key={index} sx={{ p: 1.5 }}>
                <ProductCard
                    key={index}
                    id={product.id}
                    image={product.image}
                    name={product.name}
                    offerPrice={product.offerPrice}
                    salePrice={product.salePrice}
                    rating={product.rating}
                />
            </Box>
        ));
    }

    return <Slider {...settings}>{productResult}</Slider>;
};

export default RelatedProducts;
