"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import createCoupon from "@/libs/createCoupon";
import updateSummaryCoupon from "@/libs/updateSummaryCoupon";
import deleteCoupon from "@/libs/deleteCoupon";
import { CouponItem, SummaryCoupon } from "../../../../interface";
import Link from "next/link";
import dayjs from "dayjs";
import getSingleCouponSummary from "@/libs/getSingleCouponSummary";
import { LinearProgress } from "@mui/material";

import CouponForm from "@/components/couponComponent/CouponForm";
import getCoupon from "@/libs/getCoupon";

export default function AddCoupon() {
  const { data: session } = useSession();

  const urlParams = useSearchParams();
  const id = urlParams.get("id");

  const makeCoupon = async () => {
    if (session) {
      const item = {
        type:coupon.type,
        discount:coupon.discount,
        tiers:coupon.tiers,
        point:coupon.point,
        expiredDate:dayjs(coupon.expiredDate),
        numberOfCoupons:numberOfCoupons,

      };
      if (id) {
        const response = await updateSummaryCoupon(session.user.token, id, item);
        
        if(response.success==false){
          alert(response.message)
        }
        else {
          window.location.href = "/admin/managecoupon";
        }
        
        
      } else{
        const response = await createCoupon(session.user.token, item);
        if(response.success==false){
          alert(response.message)
        }
        else window.location.href = "/admin/managecoupon";
      } 
      
    }
  };

  const [coupon, setCoupon] = useState<SummaryCoupon>(new SummaryCoupon());
  const [numberOfCoupons,setnumberOfCoupons] = useState<Number>(0);
  

  useEffect(() => {
    const getData = async () => {
      if (id != null && session&&coupon._id == "") {
        const response =(await getSingleCouponSummary(session.user.token, id)) as SummaryCoupon;

        setCoupon(response);
      }
    };
    getData();
  }, []);

  return (
    <main className="w-[100%] flex flex-row space-y-4">
      {session?.user.role == "admin" ? (
        <div className="w-[70%] m-10 flex flex-col">
            <div className="text-4xl font-medium py-5">{!id?"Add Coupon":"Edit Coupon"}</div>

          <div className="">
            
              {coupon._id == ""&&id? <LinearProgress />:
              <CouponForm
                coupon={coupon}
                onCouponChange={(value: SummaryCoupon) => {
                  setCoupon(value);
                  
                }}
                onNumberCouponChange={(value: Number) => {
                  setnumberOfCoupons(value);
                }}
                
              ></CouponForm>}
           
              <button
                name="Edit Coupon"
                className="block rounded-full bg-sky-500 px-5 py-2 text-white shadow-sm m-5"
                onClick={makeCoupon}
              >
                {id?"Edit Coupon":"Add Coupon"}
              </button>
            
            {id ?
            
              <button
                name="Delete Coupon"
                className="block rounded-full bg-red-500 px-5 py-2 text-white shadow-sm m-5"
                onClick={async () => {
                  if (id&&confirm("Are you sure you want to delete this Coupon?")) {
                    await deleteCoupon(session.user.token, id);

                    window.location.href="/admin/managecoupon"
                  }
                }}
              >
                Delete
              </button>:""}
            
            
          </div>

        </div>
        ) : ("")}
    </main>
  );
}
