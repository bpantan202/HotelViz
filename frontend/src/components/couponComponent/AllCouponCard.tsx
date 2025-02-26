import React from 'react';
import styled from 'styled-components'; // Import styled-components
import './styles.css';

export default function AllCouponCard({ couponType, discount, tier, point, createdDate, expiredDate, count, usedCount, unusedCount, ownedCount, unownedCount }: { couponType: string, discount: number, tier: string[], point: number, createdDate: Date, expiredDate: Date, count: number, usedCount: number, unusedCount: number, ownedCount: number, unownedCount: number }) {
    return (
        <a href={"/admin/addcoupon/?id=" + couponType}>
            <div data-testid="Coupon" className="relative flex flex-col m-0 gap-2 border border-disable cursor-pointer min-w-[188px] hover:translate-y-[-4px] transition-all duration-250 ease-in-out hover:shadow-md w-full h-[270px] shadow-lg overflow-hidden" style={{width: 'calc(5/8 * 100vw)' }}>
                <div className="coupon-left"></div>
                <div className="remaining"></div>
                <div className="width-1/2 absolute left-0 right-0 px-4 py-4 text-center text-lg right-box">
                    <div className="coupon-type-box">
                        <p className="text-5xl font-semibold mb-2 text-crimson">{couponType}</p>
                    </div>
                    <table className="text-left w-3/5 border-collapse border-crimson">
                        <tbody>
                            <tr>
                                <td className="border border-crimson px-2 py-1 w-1/3 text-crimson">Discount</td>
                                <td className="border border-crimson px-2 py-1 text-crimson">{discount}</td>
                            </tr>
                            <tr>
                                <td className="border border-crimson px-2 py-1 w-1/3 text-crimson">Tier</td>
                                <td className="border border-crimson px-2 py-1 text-crimson">{tier.join(', ')}</td>
                            </tr>
                            <tr>
                                <td className="border border-crimson px-2 py-1 w-1/3 text-crimson">Point</td>
                                <td className="border border-crimson px-2 py-1 text-crimson">{point}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="h-1/2 px-8 py-10 flex flex-col justify-between left-box">
                    <div>
                        <p className="text-lg gray-text">count: {count.toString()}</p>
                        <p className="text-lg gray-text">usedCount: {usedCount.toString()}</p>
                        <p className="text-lg gray-text">unusedCount: {unusedCount.toString()}</p>
                        <p className="text-lg gray-text">ownedCount: {ownedCount.toString()}</p>
                        <p className="text-lg gray-text">unownedCount: {unownedCount.toString()}</p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-5 px-4 py-4 text-right text-lg">
                    <p>Created Date: {createdDate.toString().slice(0, 10)}</p>
                    <p className='px-3'>Expired Date: {expiredDate.toString().slice(0, 10)}</p>
                </div>
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
                <div className="circle4"></div>
                <div className="circle5"></div>
                <div className="circle6"></div>
                <div className="circle7"></div>
                <div className="circle8"></div>
            </div>
        </a>
    );
}
