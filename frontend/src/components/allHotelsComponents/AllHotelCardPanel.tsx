"use client";
import AllHotelCard from "./AllHotelCard";
import Link from "next/link";
import { useReducer, useState } from "react";
import { useEffect } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getHotels from "@/libs/getHotel";
import { CircularProgress } from "@mui/material";
import LoadingHotelCard from "../hotelsComponents/LoadingHotelCard";
import PaginationBar from "../PaginationBar";
import Skeleton from "@mui/material/Skeleton";
import { HotelItem, HotelJson } from "../../../interface";

export default function AllHotelCardPanel({ session }: { session: any }) {
  const [spinner, setSpinner] = useState(true);
  const [hotels, setHotels] = useState<HotelJson>();
  const pageReducer = (page: number, action: { newPage: number }) => {
    return action.newPage;
  };
  const [page, dispatchPage] = useReducer(pageReducer, 1);

  useEffect(() => {
    const fetchData = async () => {
      setSpinner(true);
      const hotels = await getHotels(session.user.token, 4, page, "None", "None", [], 0, 7000, 0);
      setHotels(hotels);
      setSpinner(false);
    };
    fetchData();
  }, [page]);

  return (
    <div className="my-0 relative bg-blue">
      <div className="relative flex flex-col px-28 py-4">
        <div className="flex flex-row">
          <div className="text-5xl mt-4">Manage All Hotel</div>
          <Link href={"/admin/managehotel"}>
            <button className="block rounded-full bg-sky-500 px-5 py-2 text-white shadow-sm m-5">
              Add Hotel
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-4grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-x-4 gap-y-6 mt-8 gap-8 w-full h-auto">
          {spinner ? <LoadingHotelCard /> : ""}
          {spinner ? <LoadingHotelCard /> : ""}
          {spinner ? <LoadingHotelCard /> : ""}
          {spinner ? <LoadingHotelCard /> : ""}
          {!spinner && hotels
            ? hotels.data.map((hotel: HotelItem) => (
                <AllHotelCard
                  key={hotel._id}
                  hotelName={hotel.name}
                  hotelID={hotel._id}
                  imgSrc={hotel.image}
                  address={hotel.region+', '+hotel.province}
                ></AllHotelCard>
              ))
            : ""}
        </div>
        <div className="py-5 justify-self-center mx-auto">
          {hotels && !spinner ? (
            <PaginationBar
              totalPages={Math.ceil(hotels.total / 4)}
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
        </div>
      </div>
    </div>
  );
}
