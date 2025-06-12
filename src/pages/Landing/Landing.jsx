import React from 'react'
import TopNavOne from '../../components/Header/TopNav/TopNavOne'
import MenuOne from '../../components/Header/Menu/MenuOne'
import SliderOne from '../../components/Slider/SliderOne'
import productData from '../../data/Product.json'; // Adjust path
import Collection from '../../components/Home2/Collection'
import TabFeatures from '../../components/Home2/TabFeatures'
import WhatNewOne from '../../components/Home1/WhatNewOne'
import Banner from '../../components/Home1/Banner'
import Benefit from '../../components/Home1/Benefit'
import testimonialData from '../../data/Testimonial.json'
import Testimonial from '../../components/Home1/Testimonial'
import Instagram from '../../components/Home1/Instagram'
import Brand from '../../components/Home1/Brand'
import Footer from '../../components/Footer/Footer'
import ModalNewsletter from '../../components/Modal/ModalNewsletter'

const Landing = () => {
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full !mb-6'>
                <MenuOne props="bg-transparent" />
                <SliderOne />
            </div>
            <Collection props="pt-5" />
            <WhatNewOne data={productData} start={0} limit={4} />
            <Banner />
            <Benefit props="md:py-20 py-10" />
            <Testimonial data={testimonialData} limit={6} />
            <Instagram />
            <Brand />
            <Footer />
            <ModalNewsletter />
        </>
    )
}

export default Landing
