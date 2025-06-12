import React from 'react';
import { useLocation } from 'react-router-dom';
import TopNavOne from '../../components/Header/TopNav/TopNavOne';
import MenuOne from '../../components/Header/Menu/MenuOne';
import BreadcrumbProduct from '../../components/Breadcrumb/BreadcrumbProduct';
import Default from '../../components/Product/Detail/Default';
import Footer from '../../components/Footer/Footer';
import useProductStore from '../../store/productStore';

const ProductDefault = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let productId = queryParams.get('id') || '1';
  const { products, fetchProducts } = useProductStore()

  return (
    <>
      <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-white" />
        {/* <BreadcrumbProduct data={productData} productPage="default" productId={productId} /> */}
      </div>
      <Default data={products} productId={productId} />
      <Footer />
    </>
  );
};

export default ProductDefault;
