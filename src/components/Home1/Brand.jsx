import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

const Brand = () => {
    return (
        <>
            <div className="brand-block md:py-[60px] py-[32px]">
                <div className="container">
                    <div className="list-brand">
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
                                    slidesPerView: 3,
                                    spaceBetween: 16,
                                },
                                680: {
                                    slidesPerView: 4,
                                    spaceBetween: 16,
                                },
                                992: {
                                    slidesPerView: 5,
                                    spaceBetween: 16,
                                },
                                1200: {
                                    slidesPerView: 6,
                                    spaceBetween: 16,
                                },
                            }}
                        >
                            <SwiperSlide>
                                <div className="brand-item relative flex items-center justify-center h-[150px] w-[150px] rounded-full overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/66/dd/d0/66ddd0a43433943549bd2beb9cec5273.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-full w-full duration-500 relative object-cover'
                                    />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="brand-item relative flex items-center justify-center h-[150px] w-[150px] rounded-full overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/6c/a5/7e/6ca57e3f5e421b16c312f32146aa7c99.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-full w-full duration-500 relative object-cover'
                                    />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="brand-item relative flex items-center justify-center h-[150px] w-[150px] rounded-full overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/a0/0f/e9/a00fe997bcb58efa0894e9c405c64b41.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-full w-full duration-500 relative object-cover'
                                    />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="brand-item relative flex items-center justify-center h-[150px] w-[150px] rounded-full overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/b8/d3/ad/b8d3ad0384ee06651ae2ac8a49ce5f18.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-full w-full duration-500 relative object-cover'
                                    />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="brand-item relative flex items-center justify-center h-[150px] w-[150px] rounded-full overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/f8/a6/38/f8a6383ee35903c977d2dc21dbad3699.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-full w-full duration-500 relative object-cover'
                                    />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="brand-item relative flex items-center justify-center h-[150px] w-[150px] rounded-full overflow-hidden">
                                    <img
                                        src={'https://i.pinimg.com/736x/02/0d/01/020d01e63973eba9fdc1cec2ced8e378.jpg'}
                                        width={300}
                                        height={300}
                                        alt='1'
                                        className='h-full w-full duration-500 relative object-cover'
                                    />
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Brand