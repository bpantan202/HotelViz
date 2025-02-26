import React from "react";
import { BookingItem, HotelItem } from "../../../interface";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import session from "redux-persist/lib/storage/session";
import createHistory from "@/libs/createHistory";

interface BookingItemProps {
  bookingItem: BookingItem;
  deleteBooking: (token: string, bookingId: string) => Promise<void>;
  transferToHistory: (bookingItem: BookingItem) => Promise<void>;
  session?: any;
}

const BookingItemDisplay: React.FC<BookingItemProps> = ({
  bookingItem,
  deleteBooking,
  transferToHistory,
  session,
}) => {
  return (
    <div className="flex border border-disable cursor-pointer hover:translate-y-[-4px] transition-all duration-250 ease-in-out hover:shadow-md w-full h-fit rounded-xl shadow-lg bg-white overflow-hidden hover:bg-blue-50"
    onClick={() => {
      window.location.href = `/account/booking/?id=${bookingItem._id}`;
    }}>
      <div className="w-1/3 relative">
        <Image
          src={bookingItem.hotel?.image || "placeholder.jpg"}
          alt={(bookingItem.hotel as unknown as HotelItem).name}
          layout="fill"
          objectFit="cover"
          className="rounded-l-xl"
        />
      </div>

      <div className="flex-1 flex flex-col gap-3 p-8">
        <div className="flex items-center gap-3">
          <div className="text-md font-medium">
            Hotel: {(bookingItem.hotel as unknown as HotelItem).name}
          </div>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={async (e) => {
              if (session) {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this booking?")) {
                  await deleteBooking(session.user.token, bookingItem._id);
                } 
                location.reload();
              }
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </div>

        <div className="text-md">
          Booking Date: {bookingItem.date.toString()}
        </div>
        <div className="text-md">
          Room type: {bookingItem.roomType}
        </div>
        <div className="text-md">Contact Name: {bookingItem.contactName}</div>
        <div className="text-md">Contact Email: {bookingItem.contactEmail}</div>
        <div className="text-md">
          Contact Telephone: {bookingItem.contactTel}
        </div>
        <div className="text-md">
          Created At: {bookingItem.createdAt.toString()}
        </div>
      </div>  
        {
          session?.user.role === "admin" ?
          <div className="ml-auto mt-auto m-8">
            <button onClick={async (e) => {
              e.stopPropagation();
              await transferToHistory(bookingItem);
              }} 
              className="w-fit px-4 py-3 shadow-lg shadow-xl bg-gradient-to-r from-cyan-500 to-blue-500 backdrop-blur-sm hover:from-lime-500 hover:to-emerald-500 hover:shadow-xl duration-300 ease-in-out text-white rounded-xl font-sans font-lg font-medium">
               <CheckCircleOutlineIcon/> Approve
            </button>
          </div>
          :
          <div></div>
        }
      
    </div>
  );
};

export default BookingItemDisplay;
