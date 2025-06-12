import React from 'react'
import TopNavOne from '../../components/Header/TopNav/TopNavOne'
import MenuOne from '../../components/Header/Menu/MenuOne'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Benefit from '../../components/Home1/Benefit'
import Newsletter from '../../components/Home4/Newsletter'
import Instagram from '../../components/Home6/Instagram'
import Brand from '../../components/Home1/Brand'
import Footer from '../../components/Footer/Footer'

const AboutUs = () => {
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='About Us' subHeading='About Us' />
            </div>
            <div className='about md:pt-20 pt-10 icon'>
                <div className="about-us-block">
                    <div className="container">
                        <div className="text flex items-center justify-center">
                            <div className="content md:w-5/6 w-full">
                                <div className="heading3 text-center">I{String.raw`'m`} obsessed with the dress Pippa Middleton wore to her brother{String.raw`'s`} wedding.</div>
                                <div className="body1 text-center md:mt-7 mt-5">Kim Kardashian West needs no introduction. In the 14 years since she first graced our screens in Keeping Up With The Kardashians, she has built her KKW beauty empire, filmed her show, wrapped her show, become a billionaire, studied law, campaigned for the rights of death row inmates, travelled the world to attend events such as Paris Fashion Week, raised four children and launched her wildly successful shapewear brand SKIMS.</div>
                            </div>
                        </div>
                        <div className="list-img grid sm:grid-cols-3 gap-[30px] md:pt-20 pt-10">
                            <div className="bg-img">
                                <img
                                    src={'https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fother%2Fabout-us1.png&w=3840&q=75'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px]'
                                />
                            </div>
                            <div className="bg-img">
                                <img
                                    src={'https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fother%2Fabout-us2.png&w=3840&q=75'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px]'
                                />
                            </div>
                            <div className="bg-img">
                                <img
                                    src={'https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fother%2Fabout-us3.png&w=3840&q=75'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px]'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Benefit props="md:pt-20 pt-10" />
            <Newsletter props="bg-[#d2ef9a] md:mt-20 mt-10" />
            <Instagram />
            <Brand />
            <Footer />
        </>
    )
}

export default AboutUs