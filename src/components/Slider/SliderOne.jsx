import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import axios from 'axios';

import 'swiper/css/bundle';
import 'swiper/css/effect-fade';

const SliderOne = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/banners/active?type=slider`);
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default banner if no banners from API
  const defaultBanners = [
    {
      title: 'Summer Sale Collections',
      subtitle: 'Sale! Up To 50% Off!',
      buttonText: 'Shop Now',
      buttonLink: '/shop/breadcrumb1',
      image: 'https://assets.lummi.ai/assets/Qmb7ZYNXaMnXSD1UT2ALpLdoWdoqqr47Mssdioxo8TTzHf?auto=format&w=1500'
    }
  ];

  const displayBanners = banners.length > 0 ? banners : defaultBanners;

  if (loading) {
    return (
      <div className="slider-block style-one bg-linear xl:h-[680px] lg:h-[800px] md:h-[580px] sm:h-[500px] h-[350px] max-[420px]:h-[320px] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="slider-block style-one bg-linear xl:h-[680px] lg:h-[800px] md:h-[580px] sm:h-[500px] h-[350px] max-[420px]:h-[320px] w-full">
      <div className="slider-main h-full w-full">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={displayBanners.length > 1}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="h-full relative"
          autoplay={{ delay: 4000 }}
        >
          {displayBanners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div className="slider-item h-full w-full relative">
                <div className="container w-full h-full flex items-center relative">
                  <div className="text-content basis-1/2 z-10">
                    {banner.subtitle && (
                      <div className="text-sub-display">{banner.subtitle}</div>
                    )}
                    <div className="text-display md:mt-5 mt-2">{banner.title}</div>
                    {banner.description && (
                      <div className="text-secondary mt-3">{banner.description}</div>
                    )}
                    <Link to={banner.buttonLink || '/shop/breadcrumb1'} className="button-main md:mt-8 mt-3">
                      {banner.buttonText || 'Shop Now'}
                    </Link>
                  </div>
                  <div className="sub-img absolute sm:w-1/2 w-3/5 2xl:-right-[60px] -right-[16px] bottom-0">
                    <img
                      src={banner.image.startsWith('http') ? banner.image : `${BASE_URL}${banner.image}`}
                      width={670}
                      height={936}
                      alt={banner.title}
                      loading="eager"
                      style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SliderOne;
