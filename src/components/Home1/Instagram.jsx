import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import { Link } from 'react-router-dom';

const Instagram = () => {
    return (
        <>
            <div className="instagram-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading">
                        <div className="heading3 text-center">OPREEYO On Instagram</div>
                        <div className="text-center mt-3">#OPREEYOtheme</div>
                    </div>
                    <div className="list-instagram md:mt-10 mt-6">
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={2}
                            rewind={true}
                            modules={[Autoplay]}
                            autoplay={{
                                delay: 4000,
                            }}
                            breakpoints={{
                                500: {
                                    slidesPerView: 2,
                                    spaceBetween: 16,
                                },
                                680: {
                                    slidesPerView: 3,
                                    spaceBetween: 16,
                                },
                                992: {
                                    slidesPerView: 4,
                                    spaceBetween: 16,
                                },
                                1200: {
                                    slidesPerView: 5,
                                    spaceBetween: 16,
                                },
                            }}
                        >
                            <SwiperSlide>
                                <Link to={'https://www.instagram.com/'} target='_blank' className="item relative block rounded-[32px] overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/2a/88/95/2a8895f9cadf997abca28e8ac12fc52b.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-[400px] w-[400px] object-cover duration-500 relative'
                                    />
                                    <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                        <div className="icon-instagram text-2xl text-black"></div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                            <SwiperSlide>
                                <Link to={'https://www.instagram.com/'} target='_blank' className="item relative block rounded-[32px] overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/2d/fb/58/2dfb5802de66094eff8c1ed15a7de769.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-[400px] w-[400px] object-cover duration-500 relative'
                                    />
                                    <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                        <div className="icon-instagram text-2xl text-black"></div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                            <SwiperSlide>
                                <Link to={'https://www.instagram.com/'} target='_blank' className="item relative block rounded-[32px] overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/a4/7f/92/a47f9248f19781a0aa2b742409ecbc1a.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-[400px] w-[400px] object-cover duration-500 relative'
                                    />
                                    <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                        <div className="icon-instagram text-2xl text-black"></div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                            <SwiperSlide>
                                <Link to={'https://www.instagram.com/'} target='_blank' className="item relative block rounded-[32px] overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/c8/9e/84/c89e840b346997d3f2ea9ed712ea4a39.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-[400px] w-[400px] object-cover duration-500 relative'
                                    />
                                    <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                        <div className="icon-instagram text-2xl text-black"></div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                            <SwiperSlide>
                                <Link to={'https://www.instagram.com/'} target='_blank' className="item relative block rounded-[32px] overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/56/77/fa/5677fa5ced3f1e313068333a27ad5ab8.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-[400px] w-[400px] object-cover duration-500 relative'
                                    />
                                    <div className="icon w-12 h-12 bg-white hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                                        <div className="icon-instagram text-2xl text-black"></div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Instagram