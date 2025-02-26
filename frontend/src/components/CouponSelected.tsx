"use client"
import { useSession } from "next-auth/react";
import Coupon from "./memberComponents/Coupon";
import getCoupons from "@/libs/getCoupons";
import { useEffect } from "react";
import { fetchData } from "next-auth/client/_utils";
import { UserInformation } from "../../interface";
import { useState } from "react";
import getUserProfile from "@/libs/getUserProfile";
import { CouponItem } from "../../interface";
// import getCouponsForUser from "@/libs/getCouponsForUser";
import CouponForBooking from "./CouponForBooking";
import dayjs from "dayjs";

export default function CouponSelected ({onSelectCoupon , onSelectCouponId }:{onSelectCoupon: (discount: Number | undefined) => void , onSelectCouponId : (id: string | undefined) => void}){
    const { data: session } = useSession();

    const [userInfo, setUserInfo] = useState<UserInformation>(new UserInformation());

    const [userCoupons, setUserCoupons] = useState<CouponItem[]>([]);

    const [userCouponsU, setUserCouponsU] = useState<CouponItem[]>([]);

    const [selectedCoupon, setSelectedCoupon] = useState<CouponItem>();

    useEffect(() => {
        const fetchUserData = async () => {
          if (session && userInfo._id === "") {
            const userInfoA:UserInformation = (await getUserProfile(session?.user.token)).data;
            const userCouponsData: CouponItem[] = (await getCoupons(session?.user.token,100,100)).data;
            setUserInfo(userInfoA);
            setUserCoupons(userCouponsData);
          }
        };
        fetchUserData();
      }, [session, userInfo, userCoupons]);



    return(
        <div>
            {session?.user.role === "admin" ? (
                ""
            ):(
                // <div className="flex overflow-x-auto mx-4 ">
                //     {userCoupons.map((coupon) => (
                //     <Coupon  coupon={coupon} />
                // ))}
                // </div>
                <div className="flex overflow-x-auto mx-4 ">
                    {userCoupons.filter(coupon =>coupon.used == false && dayjs().isBefore(dayjs(coupon.expiredDate))).map((coupon) => (
                    <CouponForBooking
                        coupon={coupon}
                        onSelect={() => {{setSelectedCoupon(coupon)}; onSelectCoupon(coupon.discount); onSelectCouponId(coupon._id)}}
                    />
            ))}
                </div>          
            )}  
        </div>
    );
}