"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Banner() {
  const covers = [
    "/img/cover.jpg",
    "/img/cover2.jpg",
    "/img/cover3.jpg",
    "/img/cover4.jpg",
  ];
  let [index, setIndex] = useState(0);
  const router = useRouter();

  const { data: session } = useSession();

  return (
    <div
      className="w-full h-[100vh] flex flex-col justify-center items-center 
      p-1.5 z-10 relative"
      onClick={() => {
        setIndex(index + 1);
      }}
    >
      <Image
        src="/images/MainBanner.jpg"
        alt="cover"
        className="object-cover"
        fill={true}
        priority
      ></Image>
      <div className="absolute top-[7rem] left-[5rem] w-[45%] justify-left mx-auto text-left text-gray-800 z-20">
        <h1 className="text-6xl font-barlow font-bold">Experience the finest in hotel stays</h1>
        <br></br>
        <h2 className="text-2xl font-barlow font-light w-[60%]">
          Explore our exclusive listings 
          and book your perfect hotel today
        </h2>
        <br></br>
        <div className="flex flex-row space-x-3">
          <button onClick={(e) => {e.stopPropagation(); router.push("/hotel");}} 
            className="w-fit px-4 py-2 shadow-lg hover:shadow-xl bg-orange-400 border-2 border-transparent block backdrop-blur-sm hover:bg-orange-500 duration-300 ease-in-out text-white rounded-lg font-sans font-xl font-semibold">
              Book Hotel
          </button>      
          {session ? (

            <button onClick={(e) => {e.stopPropagation(); router.push("/account/mybookings");}} 

              className="w-fit px-4 py-2 shadow-lg hover:shadow-xl bg-white text-orange-400 border-solid border-2 border-orange-400  block backdrop-blur-sm hover:bg-orange-100 duration-300 ease-in-out rounded-lg font-sans font-xl font-semibold">
                Check Bookings
            </button>):''}      
        </div>
      </div>
    </div>
  );
}
