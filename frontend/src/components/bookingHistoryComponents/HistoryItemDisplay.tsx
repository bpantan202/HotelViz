import React from "react";
import { BookingItem, HistoryItem, HotelItem } from "../../../interface";
import Image from "next/image";
import { Rating } from "@mui/material";
import rateHotelStar from "@/libs/rateHotelStar";
import { useState } from "react";
import { RatingDisplay } from "./RatingDisplay";


interface HistoryItemProps {
  historyItem: HistoryItem;
  session?: any;
}

const HistoryItemDisplay: React.FC<HistoryItemProps> = ({
  historyItem,
  session,
}) => {

  return (
    <div className="flex border border-disable cursor-pointer transition-all duration-250 ease-in-out w-full h-fit rounded-xl shadow-lg bg-white overflow-hidden ">
      <div className="w-1/3 relative">
        <Image
          src={historyItem.hotel?.image || "placeholder.jpg"}
          alt={(historyItem.hotel as unknown as HotelItem).name}
          layout="fill"
          objectFit="cover"
          className="rounded-l-xl"
        />
      </div>

      <div className="flex-1 flex flex-col gap-3 p-8">
        <div className="flex items-center gap-3">
          <div className="text-md font-medium">
            Hotel: {(historyItem.hotel as unknown as HotelItem).name}
          </div>
        </div>

        <div className="text-md">
          Booking Date: {historyItem.date.toString()}
        </div>
        <div className="text-md">
          Room type: {historyItem.roomType.toString()}
        </div>
        <div className="text-md">Contact Name: {historyItem.contactName}</div>
        <div className="text-md">Contact Email: {historyItem.contactEmail}</div>
        <div className="text-md">
          Contact Telephone: {historyItem.contactTel}
        </div>
        <div className="text-md">
          Created At: {historyItem.createdAt.toString()}
        </div>
        
        <hr/>
        <RatingDisplay historyItem={historyItem}/>
      </div>
    </div>
  );
};

export default HistoryItemDisplay;
