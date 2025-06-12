import React from 'react'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Link } from 'react-router-dom';


const Breadcrumb= ({ heading, subHeading }) => {
    return (
        <>
            <div className="breadcrumb-block style-shared">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[64px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center icon font-bold">{heading}</div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link className='icon font-[600]' to={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize icon font-[600]'>{subHeading}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Breadcrumb