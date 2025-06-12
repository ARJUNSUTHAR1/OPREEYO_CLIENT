import React from 'react';
import { Link } from 'react-router-dom';  // or just use <a> tags if no router
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css/bundle';
import 'swiper/css/effect-fade';

const SliderOne = () => {
  return (
    <div className="slider-block style-one bg-linear xl:h-[680px] lg:h-[800px] md:h-[580px] sm:h-[500px] h-[350px] max-[420px]:h-[320px] w-full">
      <div className="slider-main h-full w-full">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="h-full relative"
          autoplay={{ delay: 4000 }}
        >
          <SwiperSlide>
            <div className="slider-item h-full w-full relative">
              <div className="container w-full h-full flex items-center relative">
                <div className="text-content basis-1/2">
                  <div className="text-sub-display">Sale! Up To 50% Off!</div>
                  <div className="text-display md:mt-5 mt-2">Summer Sale Collections</div>
                  <Link to="/shop/breadcrumb-img" className="button-main md:mt-8 mt-3">
                    Shop Now
                  </Link>
                </div>
                <div className="sub-img absolute sm:w-1/2 w-3/5 2xl:-right-[60px] -right-[16px] bottom-0">
                  <img
                    src="https://assets.lummi.ai/assets/Qmb7ZYNXaMnXSD1UT2ALpLdoWdoqqr47Mssdioxo8TTzHf?auto=format&w=1500"
                    width={670}
                    height={936}
                    alt="bg1-1"
                    loading="eager"
                    style={{ display: 'block', width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="slider-item h-full w-full relative">
              <div className="container w-full h-full flex items-center relative">
                <div className="text-content basis-1/2">
                  <div className="text-sub-display">Sale! Up To 50% Off!</div>
                  <div className="text-display md:mt-5 mt-2">Fashion for Every Occasion</div>
                  <Link to="/shop/breadcrumb-img" className="button-main md:mt-8 mt-3">
                    Shop Now
                  </Link>
                </div>
                <div className="sub-img absolute w-1/2 2xl:-right-[60px] -right-[0] sm:-bottom-[60px] bottom-0">
                  <img
                    src="https://assets.lummi.ai/assets/Qme35Pkzpcm96HFCtCC2c2v9vHuV9adNaADRb3t7duguNU?auto=format&w=1500"
                    alt="bg1-2"
                    loading="eager"
                    style={{ display: 'block', width: '100%', height: '100%' ,objectFit:'contain'}}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="slider-item h-full w-full relative">
              <div className="container w-full h-full flex items-center relative">
                <div className="text-content basis-1/2">
                  <div className="text-sub-display">Sale! Up To 50% Off!</div>
                  <div className="text-display md:mt-5 mt-2">Stylish Looks for Any Season</div>
                  <Link to="/shop/breadcrumb-img" className="button-main md:mt-8 mt-3">
                    Shop Now
                  </Link>
                </div>
                <div className="sub-img absolute sm:w-1/2 w-2/3 2xl:-right-[60px] -right-[36px] sm:bottom-0 -bottom-[30px]">
                  <img
                    src="https://i.pinimg.com/736x/e6/a8/ee/e6a8ee96d34d62cbf6b13afe6f20342c.jpg"
                    width={670}
                    height={936}
                    alt="bg1-3"
                    loading="eager"
                    style={{ display: 'block', width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default SliderOne;
