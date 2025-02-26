"use client";
import Link from "next/link";
import AllCouponCard from "./AllCouponCard";
import { useReducer, useState } from "react";
import { useEffect } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getSummaryCoupon from "@/libs/getSummaryCoupon";
import { CircularProgress } from "@mui/material";
import LoadingHotelCard from "../hotelsComponents/LoadingHotelCard";
import PaginationBar from "../PaginationBar";
import Skeleton from "@mui/material/Skeleton";
import { CouponItem, CouponJson, SummaryCoupon } from "../../../interface";

export default function AllCouponCardPanel({ session }: { session: any }) {
  const [spinner, setSpinner] = useState(true);
  const [coupons, setCoupons] = useState<SummaryCoupon[]>();


  useEffect(() => {
    const fetchData = async () => {
      setSpinner(true);
      const response = await getSummaryCoupon(session.user.token);
      setCoupons(response);
      setSpinner(false);
    };
    fetchData();
  }, []);

  return (
    <div className="my-0 relative bg-blue">
      <div className="relative flex flex-col px-28 py-4">
        <div className="flex flex-row">
          <div className="text-5xl mt-4">Manage All Coupon</div>
          <Link href={"/admin/addcoupon"}>
            <button data-testid="Add coupon" className="block rounded-full bg-sky-500 px-5 py-2 text-white shadow-sm m-5">
              Add Coupon
            </button>
          </Link>
        </div>
        <div className="grid grid-rows-4grid grid-rows-1 sm:grid-rows-2 md:grid-rows-3 lg:grid-rows-4 justify-items-center gap-x-4 gap-y-6 mt-8 gap-8 w-3/5 h-auto">
          {spinner ? <LoadingHotelCard /> : ""}
          {spinner ? <LoadingHotelCard /> : ""}
          {spinner ? <LoadingHotelCard /> : ""}
          {spinner ? <LoadingHotelCard /> : ""}
          {!spinner && coupons
            ? coupons.map((coupon:SummaryCoupon) => (
                <AllCouponCard
                  couponType={coupon._id}
                  discount={coupon.discount}
                  tier={coupon.tiers}
                  point={coupon.point}
                  createdDate={coupon.createdAt}
                  expiredDate={coupon.expiredDate}
                  count={coupon.count}
                  usedCount={coupon.usedCount}
                  unusedCount={coupon.unusedCount}
                  ownedCount={coupon.ownedCount}
                  unownedCount={coupon.unownedCount}
                ></AllCouponCard>
              ))
            : ""}
        </div>
        {/* <div className="py-5 justify-self-center mx-auto">
          {coupons && !spinner ? (
            <PaginationBar
              totalPages={Math.ceil(coupons.total / 4)}
              currentPage={page}
              onPage={(newPage: number) => dispatchPage({ newPage: newPage })}
            />
          ) : (
            <div className="list-style-none flex space-x-2 rounded-lg">
              <Skeleton
                variant="rectangular"
                className="rounded-3xl"
                width={40}
                height={40}
                animation="wave"
              />
              <Skeleton
                variant="rectangular"
                className="rounded-lg"
                width={40}
                height={40}
                animation="wave"
              />
              <Skeleton
                variant="rectangular"
                className="rounded-3xl"
                width={40}
                height={40}
                animation="wave"
              />
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
