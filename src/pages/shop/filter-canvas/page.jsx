import React from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNavOne from '../../components/Header/TopNav/TopNavOne';
import MenuOne from '../../components/Header/Menu/MenuOne';
import ShopFilterCanvas from '../../components/Shop/ShopFilterCanvas';
import productData from '../../data/Product.json';
import Footer from '../../components/Footer/Footer';

const FilterCanvas = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <ShopFilterCanvas data={productData} productPerPage={12} dataType={type} />
            <Footer />
        </>
    )
}


export default FilterCanvas;