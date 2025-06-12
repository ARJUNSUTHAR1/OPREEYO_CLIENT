import React, { useState, useEffect } from 'react';
import * as Icon from "@phosphor-icons/react"; // Adjust as needed
import { Link, useNavigate } from 'react-router-dom';

// import Product from '../components/Product/Product'; // Adjust path
import productData from '../../../data/Product.json'; // Adjust path

import useLoginPopup from '../../../store/useLoginPopup'; // Adjust path
import useMenuMobile from '../../../store/useMenuMobile'; // Adjust path
import { useModalCartContext } from '../../../context/ModalCartContext'; // Adjust path
import { useModalWishlistContext } from '../../../context/ModalWishlistContext'; // Adjust path
import { useModalSearchContext } from '../../../context/ModalSearchContext'; // Adjust path
import { useCart } from '../../../context/CartContext'; // Adjust path
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../../store/authStore'; // adjust path as needed


const MenuOne = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const user = useAuthStore(state => state.user);


    const logout = useAuthStore((state) => state.logout);
  
    const handleLogout = () => {
      logout(); // clear Zustand store
      localStorage.removeItem('token'); // clear token if stored
      toast.success('Logged out successfully');
      handleLoginPopup()
      navigate('/login'); // or wherever you want to redirect
    };
  

    const [selectedType, setSelectedType] = useState(null);
    const [openSubNavMobile, setOpenSubNavMobile] = useState(null);
    const [fixedHeader, setFixedHeader] = useState(false);
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    const { openLoginPopup, handleLoginPopup } = useLoginPopup();
    const { openMenuMobile, handleMenuMobile } = useMenuMobile();
    const { openModalCart } = useModalCartContext();
    const { cartState } = useCart();
    const { openModalWishlist } = useModalWishlistContext();
    const { openModalSearch } = useModalSearchContext();

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPosition]);

    const handleOpenSubNavMobile = (index) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index);
    };

    const handleGenderClick = (gender) => {
        navigate(`/shop/breadcrumb1?gender=${gender}`);
    };

    const handleCategoryClick = (category) => {
        navigate(`/shop/breadcrumb1?category=${category}`);
    };

    const handleTypeClick = (type) => {
        setSelectedType(type);
        navigate(`/shop/breadcrumb1?type=${type}`);
    };


    console.log(user);

    return (
        <>
            <div className={`header-menu style-one ${fixedHeader ? 'fixed' : 'absolute'} top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="header-main flex justify-between h-full">
                        <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
                            {/* <i className="fas fa-bars text-2xl"></i> */}
                            <i className="fas fa-sliders-h text-2xl"></i>
                        </div>
                        <div className="left flex items-center gap-16">
                            <Link to={'/'} className='flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2'>
                                <div className="heading4 fig font-[900]">OPREEYO</div>
                            </Link>
                            <div className="menu-main h-full max-lg:hidden">
                                <ul className='flex items-center gap-8 h-full  icon'>
                                    <li className='h-full'>
                                        <Link to="#!" className='font-[900] text-[0.9rem] uppercase duration-300 h-full flex items-center justify-center'>
                                            Mens
                                        </Link>
                                        <div className="mega-menu absolute top-[74px] left-0 bg-white w-screen">
                                            <div className="container">
                                                <div className="flex justify-between py-8">
                                                    <div className="nav-link basis-2/3 grid grid-cols-4 gap-y-8">
                                                        <div className="nav-item">
                                                            <div className="text-button-uppercase pb-2">Formal Pants</div>
                                                            <ul>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleGenderClick('men')}
                                                                        className={`link text-secondary duration-300 cursor-pointer`}
                                                                    >
                                                                        FALANA 1
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleTypeClick('outerwear')}
                                                                        className={`link text-secondary duration-300 cursor-pointer`}
                                                                    >
                                                                        FALANA 2
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleTypeClick('sweater')}
                                                                        className={`link text-secondary duration-300 cursor-pointer`}
                                                                    >
                                                                        FALANA 3
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleTypeClick('shirt')}
                                                                        className={`link text-secondary duration-300 cursor-pointer`}
                                                                    >
                                                                        FALANA 4
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleGenderClick('men')}
                                                                        className={`link text-secondary duration-300 cursor-pointer view-all-btn`}
                                                                    >
                                                                        View All
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="nav-item">
                                                            <div className="text-button-uppercase pb-2">Accessories</div>
                                                            <ul>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleTypeClick('shirt')}
                                                                        className={`link text-secondary duration-300 cursor-pointer`}
                                                                    >
                                                                        FALANA 1
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleTypeClick('top')}
                                                                        className={`link text-secondary duration-300 cursor-pointer`}
                                                                    >
                                                                        FALANA 2
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleTypeClick('t-shirt')}
                                                                        className={`link text-secondary duration-300 cursor-pointer`}
                                                                    >
                                                                        FALANA 3
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleTypeClick('swimwear')}
                                                                        className={`link text-secondary duration-300 cursor-pointer`}
                                                                    >
                                                                        FALANA 4
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleCategoryClick('fashion')}
                                                                        className={`link text-secondary duration-300 view-all-btn`}
                                                                    >
                                                                        View All
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="banner-ads-block  pl-2.5 basis-1/3">
                                                        <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer" onClick={() => handleTypeClick('swimwear')}>
                                                            <div className="text-content py-14 pl-8 relative z-[1]">
                                                                <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">Save $10</div>
                                                                <div className="heading6 mt-2">Dive into Savings <br />on Swimwear</div>
                                                                <div className="body1 mt-3 text-secondary">
                                                                    Starting at <span className='text-red'>$59.99</span>
                                                                </div>
                                                            </div>
                                                            <img
                                                                src={'/images/slider/bg2-2.png'}
                                                                width={200}
                                                                height={100}
                                                                alt='bg-img'
                                                                className='basis-1/3 absolute right-0 top-0 duration-700'
                                                            />
                                                        </div>
                                                        <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer mt-8" onClick={() => handleTypeClick('accessories')}>
                                                            <div className="text-content py-14 pl-8 relative z-[1]">
                                                                <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">Save $10</div>
                                                                <div className="heading6 mt-2">20% off <br />accessories</div>
                                                                <div className="body1 mt-3 text-secondary">
                                                                    Starting at <span className='text-red'>$59.99</span>
                                                                </div>
                                                            </div>
                                                            <img
                                                                src={'/images/other/bg-feature.png'}
                                                                width={200}
                                                                height={100}
                                                                alt='bg-img'
                                                                className='basis-1/3 absolute right-0 top-0 duration-700'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link to="/about" className='font-[900] text-[0.9rem] uppercase duration-300 h-full flex items-center justify-center'>
                                            About us
                                        </Link>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link to="/contact" className='font-[900] text-[0.9rem] uppercase duration-300 h-full flex items-center justify-center'>
                                            Contact Us
                                        </Link>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link to="/store" className='font-[900] text-[0.9rem] uppercase duration-300 h-full flex items-center justify-center'>
                                            Stores
                                        </Link>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link to="/faq" className='font-[900]  text-[0.9rem] uppercase duration-300 h-full flex items-center justify-center'>
                                            FAQ
                                        </Link>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link to="/coming-soon" className='font-[900]  text-[0.9rem] uppercase duration-300 h-full flex items-center justify-center'>
                                            Coming Soon
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="right flex gap-12">
                            <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">
                                <Icon.MagnifyingGlass size={24} color='black' onClick={openModalSearch} />
                                <div className="line absolute bg-line w-px h-6 -right-6"></div>
                            </div>
                            <div className="list-action flex items-center gap-4">
                                <div className="user-icon flex items-center justify-center cursor-pointer">
                                    {
                                        user ?
                                            (
                                                <Icon.User size={24} color='black' onClick={handleLoginPopup} />
                                            )
                                            :
                                            (
                                                <Link to={'/login'} className="button-main w-full text-center icon !px-6 !py-2 !text-[0.7rem] icon">Login</Link>
                                            )
                                    }
                                    <div
                                        className={`login-popup absolute top-[74px] w-[180px] flex flex-col justify-center  p-7 rounded-xl bg-white box-shadow-sm 
                                            ${openLoginPopup ? 'open' : ''}`}
                                    >
                                        <Link to={'/my-account'} className="button-main bg-white text-black border border-black w-full text-center icon p-0 !px-2 !py-2 !text-[0.8rem]">Dashboard</Link>
                                        <div className="bottom mt-4 pt-4 border-t border-[#000]"></div>
                                        <button onClick={handleLogout} className="button-main bg-white text-black border border-black w-[60%]  text-center icon p-0 !px-0 !py-2 !text-[0.8rem] self-center">Logout</button>
                                    </div>
                                </div>
                                <div className="max-md:hidden wishlist-icon flex items-center cursor-pointer" onClick={openModalWishlist}>
                                    <Icon.Heart size={24} color='black' />
                                </div>
                                <div className="cart-icon flex items-center relative cursor-pointer hidden md:block" onClick={openModalCart}>
                                    <Icon.Handbag size={24} color='black' />
                                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
                <div className="menu-container bg-white h-full">
                    <div className="container h-full">
                        <div className="menu-main h-full overflow-hidden">
                            <div className="heading py-2 relative flex items-center justify-center">
                                <div
                                    className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                                    onClick={handleMenuMobile}
                                >
                                    <Icon.X size={17} />
                                </div>
                                <Link to={'/'} className='logo text-3xl font-semibold text-center icon'>OPREEYO</Link>
                            </div>
                            <div className="form-search relative mt-2 icon">
                                <Icon.MagnifyingGlass size={20} className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer' />
                                <input type="text" placeholder='What are you looking for?' className=' h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4' />
                            </div>
                            <div className="list-nav mt-6">
                                <ul>
                                    <li
                                        className={`${openSubNavMobile === 6 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(6)}
                                    >
                                        <a to={'#!'} className='text-xl font-semibold flex items-center justify-between mt-5'>Pages
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(6)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                            <div className="list-nav-item w-full pt-2 pb-6">
                                                <ul className='w-full'>
                                                    <li>
                                                        <Link to="/about" className={`link text-secondary duration-300 ${pathname === '/pages/about' ? 'active' : ''}`}>
                                                            About Us
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/contact" className={`link text-secondary duration-300 ${pathname === '/pages/contact' ? 'active' : ''}`}>
                                                            Contact Us
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/store" className={`link text-secondary duration-300 ${pathname === '/pages/store-list' ? 'active' : ''}`}>
                                                            Store List
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/faq" className={`link text-secondary duration-300 ${pathname === '/pages/faqs' ? 'active' : ''}`}>
                                                            FAQs
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/coming-soon" className={`link text-secondary duration-300 ${pathname === '/pages/coming-soon' ? 'active' : ''}`}>
                                                            Coming Soon
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="menu_bar fixed bg-white bottom-0 left-0 w-full h-[70px] sm:hidden z-[101]">
                <div className="menu_bar-inner grid grid-cols-4 items-center h-full">
                    <Link to={'/'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.House weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Home</span>
                    </Link>
                    <Link to={`/shop/breadcrumb1`} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.List weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Products</span>
                    </Link>
                    <Link to={'/'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.MagnifyingGlass weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Search</span>
                    </Link>
                    <Link to={'/cart'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <div className="icon relative">
                            <Icon.Handbag weight='bold' className='text-2xl' />
                            <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>
                        </div>
                        <span className="menu_bar-title caption2 font-semibold">Cart</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default MenuOne