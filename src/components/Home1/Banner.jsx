import React from 'react'
import { Link } from 'react-router-dom'

const Banner = () => {
    return (
        <>
            <div className="banner-block px-4 style-one grid sm:grid-cols-2 !gap-5 md:!pt-38 !pt-28">
                <Link to={'/shop/breadcrumb-img'} className="banner-item relative block overflow-hidden duration-500">
                    <div className="banner-img">
                        <img
                            src={'https://i.pinimg.com/736x/71/8e/a6/718ea6ff646ab34a19099e80b04714df.jpg'}
                            width={2000}
                            height={1300}
                            alt='banner1'
                            priority={true}
                            className='duration-1000 h-[700px] object-cover w-[1300px]'
                        />
                    </div>
                    <div className="banner-content absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <div className="heading2 text-white">Best Sellers</div>
                        <div className="text-button text-white relative inline-block pb-1 border-b-2 border-white duration-500 mt-2">Shop Now</div>
                    </div>
                </Link>
                <Link to={'/shop/breadcrumb-img'} className="banner-item relative block overflow-hidden duration-500">
                    <div className="banner-img">
                        <img
                            src={'https://i.pinimg.com/736x/34/30/f2/3430f2d03f73584cf972c75a3bb88450.jpg'}
                            width={2000}
                            height={1300}
                            alt='banner2'
                            priority={true}
                            className='duration-1000 h-[700px] w-[1300px] object-cover'
                        />
                    </div>
                    <div className="banner-content absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <div className="heading2 text-white">New Arrivals</div>
                        <div className="text-button text-white relative inline-block pb-1 border-b-2 border-white duration-500 mt-2">Shop Now</div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default Banner