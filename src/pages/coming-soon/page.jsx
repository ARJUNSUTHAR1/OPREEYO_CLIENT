import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { countdownTime } from '../../store/countdownTime'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const ComingSoon = () => {
    const [timeLeft, setTimeLeft] = useState(countdownTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(countdownTime());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <div className="coming-soon relative w-screen h-screen">
                <img
                    src={'https://i.pinimg.com/736x/8c/94/0b/8c940b3f8065bb781ade5b4e3a61a584.jpg'}
                    width={4000}
                    height={3000}
                    alt='bg'
                    className='absolute top-0 left-0 w-full h-full object-contain'
                />
                <div className="container w-full h-full icon">
                    <div className="text-content w-full h-full flex items-center justify-center relative">
                        <div className="content-main flex flex-col items-center lg:w-1/2 sm:w-3/5 w-full">
                            <div className="text-display font-[900]">Coming Soon</div>
                            <div className="countdown-time flex items-center gap-5 lg:mt-[60px] md:mt-10 mt-6 text-white">
                                <div className="item flex flex-col items-center">
                                    <div className="days time heading1">{timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}</div>
                                    <div className='text-button-uppercase font-medium'>Days</div>
                                </div>
                                <span className='heading4'>:</span>
                                <div className="item flex flex-col items-center">
                                    <div className="hours time heading1">{timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}</div>
                                    <div className='text-button-uppercase font-medium'>Hours</div>
                                </div>
                                <span className='heading4'>:</span>
                                <div className="item flex flex-col items-center">
                                    <div className="minutes time heading1">{timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}</div>
                                    <div className='text-button-uppercase font-medium'>Minutes</div>
                                </div>
                                <span className='heading4'>:</span>
                                <div className="item flex flex-col items-center">
                                    <div className="seconds time heading1">{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}</div>
                                    <div className='text-button-uppercase font-medium'>Seconds</div>
                                </div>
                            </div>
                            <div className="input-block w-full h-[52px] mt-6 bg-white rounded-xl">
                                <form className='w-full h-full relative' action="post">
                                    <input type="email" placeholder='Enter your e-mail' className='caption1 w-full h-full pl-4 pr-14 rounded-xl border border-[#000]' required />
                                    <button className='bg-black text-white absolute top-1 bottom-1 right-1 aspect-square rounded-xl flex items-center justify-center'>
                                        <Icon.ArrowRight className='text-white heading5' />
                                    </button>
                                </form>
                            </div>
                            <div className="list-link flex items-center gap-6 justify-center mt-6">
                                <Link to={'https://www.facebook.com/'} target='_blank'>
                                    <i className="text-white fab fa-facebook-f  text-lg"></i>
                                </Link>
                                <Link to={'https://www.instagram.com/'} target='_blank'>
                                    <i className="text-white fab fa-instagram  text-lg"></i>
                                </Link>
                                <Link to={'https://www.youtube.com/'} target='_blank'>
                                    <i className="text-white fab fa-youtube  text-lg"></i>
                                </Link>
                                <Link to={'https://twitter.com/'} target='_blank'>
                                    <i className="text-white fab fa-twitter  text-lg"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ComingSoon