import React, { useState } from 'react'
import Product from '../Product/Product'
import { motion } from 'framer-motion'



const WhatNewOne= ({ data, start, limit }) => {
    const [activeTab, setActiveTab] = useState('t-shirt');

    const handleTabClick = (type) => {
        setActiveTab(type);
    };

    const filteredProducts = data.filter((product) => product.type === activeTab && (product.category === 'fashion'));

    return (
        <>
            <div className="whate-new-block md:!pt-20 !pt-10">
                <div className="container flex  flex-col items-center !justify-center">
                    <div className="heading gap-4 flex flex-col items-center text-center">
                        <div className="heading3 fig font-[600]">What{String.raw`'s`} new</div>
                        <div className="menu-tab !flex !items-center !gap-2 !p-1 bg-[#f7f7f7] !rounded-2xl mt-6">
                            {['top', 't-shirt', 'dress', 'sets', 'shirt'].map((type) => (
                                <div
                                    key={type}
                                    className={`tab-item relative text-secondary text-button-uppercase !py-2 !px-5 !cursor-pointer duration-500 hover:text-black ${activeTab === type ? 'active' : ''}`}
                                    onClick={() => handleTabClick(type)}
                                >
                                    {activeTab === type && (
                                        <motion.div layoutId='active-pill' className='absolute inset-0 rounded-2xl bg-white'></motion.div>
                                    )}
                                    <span className='relative text-button-uppercase fig z-[1] '>
                                        {type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="list-product hide-product-sold !grid md:!grid-cols-4 !grid-cols-2 justify-center md:justify-start sm:!gap-[30px] !gap-y-[100px] gap-x-[10px] md:!mt-10 !mt-6">
                        {filteredProducts.slice(start, limit).map((prd, index) => (
                            <Product data={prd} type='grid' key={index} style='style-1' />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default WhatNewOne