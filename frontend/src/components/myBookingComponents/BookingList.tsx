"use client";

import { useSession } from "next-auth/react";
import deleteBooking from "@/libs/deleteBooking";
import { BookingItem } from "../../../interface";
import BookingItemDisplay from "./BookingItemDisplay";
import HistoryIcon from '@mui/icons-material/History';
import createHistory from "@/libs/createHistory";

export default async function BookingList({ bookings }: { bookings: any }) {
  const { data: session } = useSession();

  const transferToHistory = async (bookingItem: BookingItem) => {
    if(session) {
      const item = {
        date: bookingItem.date,
        user: bookingItem.user,
        roomType: bookingItem.roomType,
        contactEmail: bookingItem.contactEmail,
        contactName: bookingItem.contactName,
        contactTel: bookingItem.contactTel,
        createdAt: bookingItem.createdAt,
        rating: -1,
      }
      await createHistory(session.user.token, bookingItem.hotel._id, item);
      await deleteBooking(session.user.token, bookingItem._id);
      location.reload();
    }
  }

  return (
    <div className="container pt-12 px-36 ">
      <table><tr>
        <td className="pt-3.5 pr-5"><h1
        className={`font-barlow text-3xl font-bold mb-4 
        ${session?.user.role === "admin" ? "text-blue-600" : "text-amber-700"}`
        }
      >
        {session?.user.role === "admin"
          ? "Manage All Bookings"
          : "Manage My Bookings"}
      </h1></td>
      <td><button onClick={(e) => window.location.href="/account/bookingHistory"} 
      className={`w-fit px-4 py-2.5 shadow-lg shadow-xl backdrop-blur-sm hover:shadow-xl hover:translate-y-[-2px] duration-300 ease-in-out text-white rounded-3xl font-sans font-lg font-medium
      ${session?.user.role === "admin" ? "bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500" : "bg-gradient-to-r from-amber-400 to-red-400 hover:from-amber-500 hover:to-red-500"}`}>
        Booking History <HistoryIcon/>
      </button></td>
      </tr></table>
      

      {session && (
        <h3 className="font-barlow text-lg mb-6 mt-4">
          Booking Counts: {bookings.count}
        </h3>
      )}



      <div className="grid grid-cols-1 gap-6">
        {bookings.data.map((item: BookingItem) => (
          <BookingItemDisplay
            key={item._id}
            bookingItem={item}
            deleteBooking={deleteBooking}
            transferToHistory={transferToHistory}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}
