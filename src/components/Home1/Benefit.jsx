import React from 'react'


const Benefit = ({ props }) => {
    return (
        <>
            <div className="container icon">
                <div className={`benefit-block ${props}`}>
                    <div className="list-benefit !grid !items-start lg:!grid-cols-4 !grid-cols-2 !gap-[30px]">
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="fas fa-headset lg:text-7xl text-5xl"></i>
                            <div className="heading6 icon text-center mt-5">24/7 Customer Service</div>
                            <div className="caption1 text-secondary text-center mt-3">We&apos;re here to help you with any questions or concerns you have, 24/7.</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i class="fas fa-undo lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">14-Day Money Back</div>
                            <div className="caption1 text-secondary text-center mt-3">If you&apos;re not satisfied with your purchase, simply return it within 14 days for a refund.</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="fas fa-shield-halved lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">Our Guarantee</div>
                            <div className="caption1 text-secondary text-center mt-3"> We stand behind our products and services and guarantee your satisfaction.</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="fas fa-truck-fast lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">Shipping worldwide</div>
                            <div className="caption1 text-secondary text-center mt-3">We ship our products worldwide, making them accessible to customers everywhere.</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Benefit