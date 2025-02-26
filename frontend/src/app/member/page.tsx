"use client";
import MemberExp from "@/components/memberComponents/MemberExp";
import MemberInfo from "@/components/memberComponents/MemberInfo";
import Coupon from "@/components/memberComponents/Coupon";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserInformation, CouponItem, CouponSummaryItem } from "../../../interface";
import getUserProfile from "@/libs/getUserProfile";
import { Skeleton } from "@mui/material";
import MemberLoading from "@/components/memberComponents/MemberLoading";
import getCouponsForUser from "@/libs/getCouponsForUser";
import getCouponsRedeem from "@/libs/getCouponsRedeem";
import CouponSummary from "@/components/memberComponents/CouponSummary";
import dayjs from "dayjs";

export default function Member() {

  const { data: session, status } = useSession();
  
  const [userInfo, setUserInfo] = useState<UserInformation>(new UserInformation());

  const [userCoupons, setUserCoupons] = useState<CouponItem[]>([]);

  const [CouponsRedeem, setCouponsRedeem] = useState<CouponSummaryItem[]>([]);



  // useEffect(() => {
  //     const getUserInfo = async () => {
  //         if(session && userInfo._id == ""){
  //             const userInfoA:UserInformation = (await getUserProfile(session?.user.token)).data;
  //             setUserInfo(userInfoA);
  //         }
  //     };
  //     getUserInfo();
  // },[userInfo])


  useEffect(() => {
    const fetchUserData = async () => {
      if (session && userInfo._id === "") {
        const userInfoA:UserInformation = (await getUserProfile(session?.user.token)).data;
        const userCouponsData: CouponItem[] = (await getCouponsForUser(session?.user.token)).data;
        const CouponsRe: CouponSummaryItem[] = (await getCouponsRedeem(session?.user.token)).data;
        console.log ;
        setUserInfo(userInfoA);

        const filterCouponUser = userCouponsData.filter(coupon => coupon.used == false && dayjs().isBefore(dayjs(coupon.expiredDate)));
        setUserCoupons(filterCouponUser);

        const filteredCouponsRedeem = CouponsRe.filter(coupon => coupon.tiers.includes(userInfoA.tier) && coupon.unownedCount != 0 && dayjs().isBefore(dayjs(coupon.expiredDate)));
        setCouponsRedeem(filteredCouponsRedeem);

        // console.log(CouponsRe);
        // console.log(filteredCouponsRedeem);
      }
    };
    fetchUserData();
  }, [session, userInfo, userCoupons]);

    return(
        <main className=" flex flex-col px-28 py-8">
          {
            (userInfo._id == "")? 
            <div className="flex flex-wrap">
            <div className="w-full xl:w-1/2 p-4 min-w-[500px]">
            <MemberLoading/>
            </div>
            <div className="w-full xl:w-1/2 p-4 min-w-[500px]">
            <MemberLoading/>
            </div>
          </div>
        :
          <div className="flex flex-wrap">
            <div className="w-full xl:w-1/2 p-4 min-w-[500px]">
            <MemberExp memberInfo={userInfo}/>
            </div>
            <div className="w-full xl:w-1/2 p-4 min-w-[500px]">
            <MemberInfo memberInfo={userInfo}/>
            </div>
          </div>
          }
          {
            (userCoupons.length != 0)?
            <h1 className="text-2xl font-bold mx-4 mt-8">
              {
              (session?.user.role == "admin")? "All Coupon" : "Your Coupon"
              }
            </h1>
            : 
            <div></div>
          }
          <div className="flex overflow-x-auto mx-4 ">
              {userCoupons.map((coupon) => (
                <Coupon  coupon={coupon} />
              ))}
          </div>
          {
              (session?.user.role == "admin")? <div/> : 
              <div>
              <h1 className="text-2xl font-bold mx-4 mt-8">Redeem coupon here !</h1>
              <div className="flex overflow-x-auto mx-4 ">
                  {CouponsRedeem.map((coupon) => (
                    <CouponSummary coupon={coupon} userInfo={userInfo}/>
                  ))}
              </div></div>

          }
          
        </main>
    )
}