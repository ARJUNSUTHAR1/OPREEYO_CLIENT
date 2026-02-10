import React from 'react';
import Product from '../Product/Product';

const NewArrivals = ({ data, start, limit }) => {
    // Filter products marked as "new"
    const newProducts = data && data.length > 0 
        ? data.filter((product) => product.new === true) 
        : [];

    return (
        <>
            <div className="new-arrivals-block md:!pt-20 !pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3 fig font-[600]">New Arrivals</div>
                        <div className="text-secondary mt-3">
                            Check out our latest collection of products
                        </div>
                    </div>

                    <div className="list-product hide-product-sold !grid md:!grid-cols-4 !grid-cols-2 justify-center md:justify-start sm:!gap-[30px] !gap-y-[100px] gap-x-[10px] md:!mt-10 !mt-6">
                        {newProducts.length > 0 ? (
                            newProducts.slice(start, limit).map((prd) => (
                                <Product data={prd} type='grid' key={prd._id || prd.id} style='style-1' />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-secondary">No new arrivals at the moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewArrivals;
