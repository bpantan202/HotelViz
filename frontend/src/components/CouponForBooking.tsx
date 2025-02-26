import LoyaltyIcon from '@mui/icons-material/Loyalty';
import {useReducer, useState } from "react";
import { CouponItem } from "../../interface";
import { BooleanLiteral } from 'typescript';
import dayjs from 'dayjs';


export default function CouponForBooking(
    // {couponId,couponType, discount, tier, point, createdDate, expiredDate}: {couponId:string, couponType: string, discount: Number, tier: string[], point: Number, createdDate: Date, expiredDate: Date}
    { coupon , onSelect }: { coupon: CouponItem , onSelect : (coupon: CouponItem | undefined) => void}
) {

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

    // const [selected, setSelected] = useState<boolean>(false);

    const handleClick = () => {
        if(coupon.used) return alert("you cannot use this coupon(already used)")
        onSelect(coupon);
    };
    
    
    return (
        <div className=" min-w-[500px] w-[500px] h-[auto] mr-8 my-4 self-start bg-gradient-to-br from-yellow-600 to-indigo-600  text-white text-center py-4 px-8  rounded-lg shadow-md relative  hover:translate-y-[-4px] transition-all duration-250 ease-in-out hover:shadow-md rounded-xl shadow-lg overflow-hidden border-neutral-100 border-[5px]"
        onClick={handleClick}
        >
            <h1 className="text-2xl font-bold -4">{coupon.type}</h1>
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
                <h1 className='text-[15px] font-semibold'>Valid Till</h1>

                <h1 className='text-[13px]'>{dayjs(coupon.expiredDate.toString()).format('DD MMMM YYYY')}</h1>
            </div>
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
            <div className="w-12 h-12 bg-neutral-100 rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
        </div>
    )};