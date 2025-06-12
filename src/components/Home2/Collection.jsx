import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { useNavigate } from 'react-router-dom'

const Collection = ({ props }) => {
    const navigate = useNavigate()

    const handleTypeClick = (type) => {
        navigate(`/shop/breadcrumb1?type=${type}`)
    }

    return (
        <div className={`collection-block ${props}`}>
            <div className="list-collection section-swiper-navigation !sm:px-5 !px-4">
                <Swiper
                    spaceBetween={12}
                    slidesPerView={2}
                    navigation
                    loop={true}
                    modules={[Navigation, Autoplay]}
                    breakpoints={{
                        576: {
                            slidesPerView: 2,
                            spaceBetween: 12,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1200: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                    }}
                    className="h-full"
                >
                    <SwiperSlide>
                        <div className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => handleTypeClick('swimwear')}>
                            <div className="bg-img">
                                <img
                                    src="https://i.pinimg.com/736x/8d/6d/7d/8d6d7d4ff9ef0b728e23961ff5bb0958.jpg"
                                    style={{ width: 550, height: 450,objectFit:"cover" }}
                                    alt="swimwear"
                                />
                            </div>
                            <div className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:!py-3 md:!text-[1.7rem] !font-[600] !py-1.5 bg-white rounded-xl duration-500 fig">
                                Swimwear
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => handleTypeClick('top')}>
                            <div className="bg-img">
                                <img
                                    src="https://i.pinimg.com/736x/b4/a4/ef/b4a4efbfa262002c7f07fbd5589d8eba.jpg"
                                    style={{ width: 550, height: 450,objectFit:"cover" }}
                                    alt="top"
                                />
                            </div>
                            <div className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:!py-3 md:!text-[1.7rem] !font-[600] !py-1.5 bg-white rounded-xl duration-500 fig">
                                top
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => handleTypeClick('sets')}>
                            <div className="bg-img">
                                <img
                                    src="https://i.pinimg.com/736x/44/36/9b/44369bcfb660c1f7ed4b5856fd68f99a.jpg"
                                    style={{ width: 550, height: 450,objectFit:"cover" }}
                                    alt="sets"
                                />
                            </div>
                            <div className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:!py-3 md:!text-[1.7rem] !font-[600] !py-1.5 bg-white rounded-xl duration-500 fig">
                                sets
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => handleTypeClick('outerwear')}>
                            <div className="bg-img">
                                <img
                                    src="https://i.pinimg.com/736x/af/c9/97/afc9971b52c2e3daabd512d4e47d770c.jpg"
                                    style={{ width: 550, height: 450,objectFit:"cover" }}
                                    alt="outerwear"
                                />
                            </div>
                            <div className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:!py-3 md:!text-[1.7rem] !font-[600] !py-1.5 bg-white rounded-xl duration-500 fig">
                                outerwear
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => handleTypeClick('underwear')}>
                            <div className="bg-img">
                                <img
                                    src="https://i.pinimg.com/736x/a0/59/0f/a0590f5ca2f3e7bc35d0ef3ad4072478.jpg"
                                    style={{ width: 550, height: 450,objectFit:"cover" }}
                                    alt="underwear"
                                />
                            </div>
                            <div className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:!py-3 md:!text-[1.7rem] !font-[600] !py-1.5 bg-white rounded-xl duration-500 fig">
                                underwear
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => handleTypeClick('t-shirt')}>
                            <div className="bg-img">
                                <img
                                    src="https://i.pinimg.com/736x/e7/5e/37/e75e37021995a1bc27cab19d9f65bb39.jpg"
                                    style={{ width: 550, height: 450,objectFit:"cover" }}
                                    alt="t-shirt"
                                />
                            </div>
                            <div className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:!py-3 md:!text-[1.7rem] !font-[600] !py-1.5 bg-white rounded-xl duration-500 fig">
                                t-shirt
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default Collection
