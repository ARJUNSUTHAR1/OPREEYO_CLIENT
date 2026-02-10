import React from 'react'
import TopNavOne from '../../components/Header/TopNav/TopNavOne'
import MenuOne from '../../components/Header/Menu/MenuOne'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Footer from '../../components/Footer/Footer'
import { Link } from 'react-router-dom';

const StoreList = () => {
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Store list' subHeading='Store list' />
            </div>
            <div className='store-list md:py-20 py-10'>
                <div className="container">
                    <div className="item bg-surface overflow-hidden rounded-[20px]">
                        <div className="flex items-center lg:justify-end relative max-lg:flex-col icon">
                            <img
                                src={'https://i.pinimg.com/736x/f3/34/6f/f3346f0fc63ec07123fac6a7da45951f.jpg'}
                                width={3000}
                                height={2000}
                                alt='bg-img'
                                className='lg:absolute relative top-0 left-0 lg:bottom-0 lg:w-1/2 w-full h-full object-cover'
                            />
                            <div className="text-content lg:w-1/2 lg:pr-20 lg:pl-[100px] lg:py-14 sm:py-10 py-6 max-lg:px-6">
                                <div className="heading3">New York Office</div>
                                <div className="list-featrue lg:mt-10 mt-6">
                                    <div className="item flex lg:gap-10 gap-6">
                                        <div className='w-1/2'>
                                            <div className="heading6">Address:</div>
                                            <div className="text-secondary mt-2">2163 Phillips Gap Rd West Jefferson, North Carolina</div>
                                        </div>
                                        <div className='w-1/2'>
                                            <div className="heading6">Opentime:</div>
                                            <div className="text-secondary mt-2 whitespace-nowrap">Monay - Friday:</div>
                                            <div className='text-title text-black whitespace-nowrap'>08:00 - 20:00</div>
                                            <div className="text-secondary whitespace-nowrap">Saturday - Sunday:</div>
                                            <div className='text-title text-black whitespace-nowrap'>10:00 - 18:00</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-featrue mt-5">
                                    <div className="item flex lg:gap-10 gap-6">
                                        <div className='w-1/2'>
                                            <div className="heading6">Infomation:</div>
                                            <div className="text-secondary mt-2">+91-XXXXX-XXXXX<br />
                                                arjunsuthar2112@gmail.com</div>
                                        </div>
                                        <div className='w-1/2'>
                                            <div className="heading6">Our social media:</div>
                                            <div className="flex items-center sm:gap-4 gap-2 mt-2">
                                                <Link to={'https://www.facebook.com/'} target='_blank' className="item bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white duration-300">
                                                    <i className="fab fa-facebook-f  text-lg"></i>
                                                </Link>
                                                <Link to={'https://www.instagram.com/'} target='_blank' className="item bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white duration-300">
                                                    <i className="fab fa-instagram  text-lg"></i>
                                                </Link>
                                                <Link to={'https://www.youtube.com/'} target='_blank' className="item bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white duration-300">
                                                    <i className="fab fa-youtube  text-lg"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="item bg-surface overflow-hidden rounded-[20px] md:mt-20 mt-10">
                        <div className="flex items-center justify-start relative max-lg:flex-col-reverse">
                            <div className="text-content lg:w-1/2 w-full lg:pl-20 lg:pr-[100px] lg:py-14 sm:py-10 py-6 max-lg:px-6 icon">
                                <div className="heading3">Chicago Office</div>
                                <div className="list-featrue lg:mt-10 mt-6">
                                    <div className="item flex lg:gap-10 gap-6">
                                        <div className='w-1/2'>
                                            <div className="heading6">Address:</div>
                                            <div className="text-secondary mt-2">2163 Phillips Gap Rd West Jefferson, North Carolina</div>
                                        </div>
                                        <div className='w-1/2'>
                                            <div className="heading6">Opentime:</div>
                                            <div className="text-secondary mt-2 whitespace-nowrap">Monay - Friday:</div>
                                            <div className='text-title text-black whitespace-nowrap'>08:00 - 20:00</div>
                                            <div className="text-secondary whitespace-nowrap">Saturday - Sunday:</div>
                                            <div className='text-title text-black whitespace-nowrap'>10:00 - 18:00</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-featrue mt-5">
                                    <div className="item flex lg:gap-10 gap-6">
                                        <div className='w-1/2'>
                                            <div className="heading6">Infomation:</div>
                                            <div className="text-secondary mt-2">+91-XXXXX-XXXXX<br />
                                                arjunsuthar2112@gmail.com</div>
                                        </div>
                                        <div className='w-1/2'>
                                            <div className="heading6">Our social media:</div>
                                            <div className="flex items-center sm:gap-4 gap-2 mt-2">
                                                <Link to={'https://www.facebook.com/'} target='_blank' className="item bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white duration-300">
                                                    <i className="fab fa-facebook-f  text-lg"></i>
                                                </Link>
                                                <Link to={'https://www.instagram.com/'} target='_blank' className="item bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white duration-300">
                                                    <i className="fab fa-instagram  text-lg"></i>
                                                </Link>
                                                <Link to={'https://www.youtube.com/'} target='_blank' className="item bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white duration-300">
                                                    <i className="fab fa-youtube  text-lg"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <img
                                src={'https://i.pinimg.com/736x/cf/12/a4/cf12a4883c4db06733769d80f4e5917f.jpg'}
                                width={3000}
                                height={2000}
                                alt='bg-img'
                                className='lg:absolute relative top-0 right-0 bottom-0 lg:bottom-0 lg:w-1/2 w-full h-full object-cover'
                            />
                        </div>
                    </div>
                    <div className="item bg-surface overflow-hidden rounded-[20px] md:mt-20 mt-10">
                        <div className="flex items-center lg:justify-end relative max-lg:flex-col icon">
                            <img
                                src={'https://i.pinimg.com/736x/42/b3/7e/42b37e87b292ef14c2c4502caf05e513.jpg'}
                                width={3000}
                                height={2000}
                                alt='bg-img'
                                className='lg:absolute relative top-0 left-0 lg:bottom-0 lg:w-1/2 w-full h-full object-cover'
                            />
                            <div className="text-content lg:w-1/2 lg:pr-20 lg:pl-[100px] lg:py-14 sm:py-10 py-6 max-lg:px-6">
                                <div className="heading3">San Francisco Office</div>
                                <div className="list-featrue lg:mt-10 mt-6">
                                    <div className="item flex lg:gap-10 gap-6">
                                        <div className='w-1/2'>
                                            <div className="heading6">Address:</div>
                                            <div className="text-secondary mt-2">2163 Phillips Gap Rd West Jefferson, North Carolina</div>
                                        </div>
                                        <div className='w-1/2'>
                                            <div className="heading6">Opentime:</div>
                                            <div className="text-secondary mt-2 whitespace-nowrap">Monay - Friday:</div>
                                            <div className='text-title text-black whitespace-nowrap'>08:00 - 20:00</div>
                                            <div className="text-secondary whitespace-nowrap">Saturday - Sunday:</div>
                                            <div className='text-title text-black whitespace-nowrap'>10:00 - 18:00</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-featrue mt-5">
                                    <div className="item flex lg:gap-10 gap-6">
                                        <div className='w-1/2'>
                                            <div className="heading6">Infomation:</div>
                                            <div className="text-secondary mt-2">+91-XXXXX-XXXXX<br />
                                                arjunsuthar2112@gmail.com</div>
                                        </div>
                                        <div className='w-1/2'>
                                            <div className="heading6">Our social media:</div>
                                            <div className="flex items-center sm:gap-4 gap-2 mt-2">
                                                <Link to={'https://www.facebook.com/'} target='_blank' className="item bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white duration-300">
                                                    <i className="fab fa-facebook-f  text-lg"></i>
                                                </Link>
                                                <Link to={'https://www.instagram.com/'} target='_blank' className="item bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white duration-300">
                                                    <i className="fab fa-instagram  text-lg"></i>
                                                </Link>
                                                <Link to={'https://www.youtube.com/'} target='_blank' className="item bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white duration-300">
                                                    <i className="fab fa-youtube  text-lg"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default StoreList