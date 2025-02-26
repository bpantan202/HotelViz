import LoyaltyIcon from '@mui/icons-material/Loyalty';
import {useReducer, useState } from "react";
import { CouponSummaryItem, UserInformation } from '../../../interface';
import redeemCoupon from '@/libs/redeemCoupon';
import { useSession } from "next-auth/react";
import dayjs from 'dayjs';

export default function CouponSummary(
    // {couponId,couponType, discount, tier, point, createdDate, expiredDate}: {couponId:string, couponType: string, discount: Number, tier: string[], point: Number, createdDate: Date, expiredDate: Date}
    { coupon, userInfo }: { coupon: CouponSummaryItem, userInfo: UserInformation }
) {

    // const [spinner, setSpinner] = useState(true);
    const { data: session } = useSession();


    function getColorDisplay(tier: string): string{
        if(tier == "Platinum" || tier == "platinum") {
            return "text-teal-500";
        } else if (tier == "Gold" || tier == "gold") {
            return "text-yellow-500";
        } else if (tier == "Silver" || tier == "silver") {
            return "text-slate-500";
        } else if (tier == "Bronze" || tier == "bronze") {
            return "text-yellow-800";
        } else {
            return "text-blue-800";
        }
    }


    return (
        <div className=" min-w-[500px] w-[500px] h-[auto] mr-8 my-4 self-start bg-gradient-to-br from-yellow-600 to-indigo-600  text-white text-center py-4 px-8  rounded-lg shadow-md relative  hover:translate-y-[-4px] transition-all duration-250 ease-in-out hover:shadow-md rounded-xl shadow-lg overflow-hidden border-neutral-100 border-[5px]">
            <h1 className="text-2xl font-bold -4">{coupon._id}</h1>
            <hr className='mx-5 my-1'/>
            <h3 className="text-xl font-semibold mb-5">{coupon.discount.toString()} Baht Discount</h3>
            
            <div className='flex justify-between mt-[20px] '>
                <div className='flex justify-start flex-wrap max-w-[45%] gap-2 content-end'>                            
                    {
                        coupon.tiers.map((tier) => (                
                        <span className=" flex self-start border border-white bg-white px-1.5 py-1 w-auto rounded justify-content-start">
                            <div className={`flex ${getColorDisplay(tier)}`} >
                            <h1 className='mr-1'><LoyaltyIcon fontSize={"inherit"}/></h1>
                            <h1 className="mr-[2px] text-sm font-semibold mt-[2px]">{tier}</h1>
                            </div>
                        </span>
                    ))}
                </div>
            <div className="flex flex-col justify-end items-end ">
                <div className='text-base font-semibold text-md'>Left : {coupon.unownedCount}</div>
                <h1 className='text-[11px]'>Valid Till : {dayjs(coupon.expiredDate.toString()).format('DD MMMM YYYY')}</h1>
                <div className='flex mt-2.5'>
                    <span className="border-dashed border text-white text-md px-2 py-1.5 rounded-l  content-center">{coupon.point.toString()} Points</span>
                    <button className="border bg-gradient-to-r from-stone-100 to-gray-100 text-slate-600 text-md font-semibold px-2 py-1.5 rounded-r w-[120px] content-center hover:text-white hover:from-neutral-800 hover:to-slate-800 hover:cursor-pointer"
                    onClick={async () => {
                        if (userInfo.point < coupon.point){
                            alert("You don't have enough point :(")
                        }
                        else if (session && confirm(`Are you sure you want to redeem this coupon with ${coupon.point.toString()} Points?`)) {
                        //   await .....
                            await redeemCoupon(session?.user.token,coupon._id);
                          window.location.reload();
                        }}}
                    >
                        Redeem
                    </button>
                </div>
                
            </div>
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
            <div className="w-12 h-12 bg-neutral-100 rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
        </div>
    )};