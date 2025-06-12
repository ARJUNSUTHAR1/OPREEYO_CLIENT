import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import { Link } from 'react-router-dom'

const Instagram = () => {
    return (
        <>
            <div className="instagram-block md:pt-20 pt-10 icon">
                <div className="heading">
                    <div className="heading3 text-center">OPREEYO On Instagram</div>
                    <div className="text-center mt-3">#Basictheme</div>
                </div>
                <div className="list-instagram md:mt-7 mt-4">
                    <Swiper
                        slidesPerView={2}
                        loop={true}
                        modules={[Autoplay]}
                        autoplay={{
                            delay: 4000,
                        }}
                        breakpoints={{
                            500: {
                                slidesPerView: 2,
                            },
                            680: {
                                slidesPerView: 3,
                            },
                            992: {
                                slidesPerView: 4,
                            },
                            1200: {
                                slidesPerView: 5,
                            },
                        }}
                    >
                        <SwiperSlide>
                            <Link to={'https://www.instagram.com/'} target='_blank' className="h-[500px] item relative block overflow-hidden">
                                <img
                                    src={'https://i.pinimg.com/736x/93/0e/44/930e44bec7959dbd14c8d4a1d03aaa89.jpg'}
                                    width={500}
                                    height={500}
                                    alt='1'
                                    className='object-cover h-full w-full duration-500 relative'
                                />
                                <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                    <i className="fab fa-instagram text-2xl text-black"></i>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={'https://www.instagram.com/'} target='_blank' className="h-[500px] item relative block overflow-hidden">
                                <img
                                    src={'https://i.pinimg.com/736x/3b/2d/08/3b2d08ddd352e93298054a1ed92ba987.jpg'}
                                    width={500}
                                    height={500}
                                    alt='1'
                                    className='object-cover h-full w-full duration-500 relative'
                                />
                                <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                    <i className="fab fa-instagram text-2xl text-black"></i>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={'https://www.instagram.com/'} target='_blank' className="h-[500px] item relative block overflow-hidden">
                                <img
                                    src={'https://i.pinimg.com/736x/50/ab/da/50abda37532a8842e49afb46b954b980.jpg'}
                                    width={500}
                                    height={500}
                                    alt='1'
                                    className='object-cover h-full w-full duration-500 relative'
                                />
                                <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                    <i className="fab fa-instagram text-2xl text-black"></i>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={'https://www.instagram.com/'} target='_blank' className="h-[500px] item relative block overflow-hidden">
                                <img
                                    src={'https://i.pinimg.com/736x/21/ac/01/21ac0140b8636925d6354e391a18643c.jpg'}
                                    width={500}
                                    height={500}
                                    alt='1'
                                    className='object-cover h-full w-full duration-500 relative'
                                />
                                <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                    <i className="fab fa-instagram text-2xl text-black"></i>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={'https://www.instagram.com/'} target='_blank' className="h-[500px] item relative block overflow-hidden">
                                <img
                                    src={'https://i.pinimg.com/736x/eb/25/13/eb25136caa3cef58bd9504a59fb385cf.jpg'}
                                    width={500}
                                    height={500}
                                    alt='1'
                                    className='object-cover h-full w-full duration-500 relative'
                                />
                                <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                    <i className="fab fa-instagram text-2xl text-black"></i>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={'https://www.instagram.com/'} target='_blank' className="h-[500px] item relative block overflow-hidden">
                                <img
                                    src={'https://i.pinimg.com/736x/57/32/f7/5732f795a5deec2f4cbfc5eb7882085a.jpg'}
                                    width={500}
                                    height={500}
                                    alt='1'
                                    className='object-cover h-full w-full duration-500 relative'
                                />
                                <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                    <i className="fab fa-instagram text-2xl text-black"></i>
                                </div>
                            </Link>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default Instagram