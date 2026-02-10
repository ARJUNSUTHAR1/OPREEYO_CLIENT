import React, { useState } from 'react'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Link } from 'react-router-dom';

const TopNavOne = ({ props, slogan }) => {
    const [isOpenLanguage, setIsOpenLanguage] = useState(false)
    const [isOpenCurrence, setIsOpenCurrence] = useState(false)
    const [language, setLanguage] = useState('English')
    const [currence, setCurrence] = useState('USD')

    return (
        <>
            <div className={`top-nav md:h-[44px] h-[30px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="top-nav-main flex justify-between max-md:justify-center h-full">
                        <div className="left-content flex items-center gap-5 max-md:hidden">
                            {/* Language and Currency dropdowns removed */}
                        </div>
                        <div className="text-center text-button-uppercase text-white flex items-center">
                            {slogan}
                        </div>
                        <div className="right-content flex items-center gap-5 max-md:hidden">
                            <Link to={'https://www.facebook.com/'} target='_blank'>
                                <i className="fab fa-facebook-f text-white text-lg"></i>
                            </Link>
                            <Link to={'https://www.instagram.com/'} target='_blank'>
                                <i className="fab fa-instagram text-white text-lg"></i>
                            </Link>
                            <Link to={'https://www.youtube.com/'} target='_blank'>
                                <i className="fab fa-youtube text-white text-lg"></i>
                            </Link>
                            <Link to={'https://twitter.com/'} target='_blank'>
                                <i className="fab fa-twitter text-white text-lg"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopNavOne