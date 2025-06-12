import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopNavOne from '../../../components/Header/TopNav/TopNavOne';
import MenuOne from '../../../components/Header/Menu/MenuOne';
import ShopBreadCrumb1 from '../../../components/Shop/ShopBreadCrumb1';
// import productData from '../../../data/Product.json';
import Footer from '../../../components/Footer/Footer';
import useProductStore from '../../../store/productStore';

export default function BreadCrumb1() {
    const location = useLocation();
    const [type, setType] = useState(null);

    const searchParams = new URLSearchParams(location.search);
    const datatype = searchParams.get('type');
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');

    useEffect(() => {
        setType(datatype);
    }, [datatype]);

    const { products, fetchProducts } = useProductStore()

    useEffect(() => {
        fetchProducts()
    }, [])



    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <ShopBreadCrumb1 data={products} productPerPage={9} dataType={type} gender={gender} category={category} />
            <Footer />
        </>
    )
}
