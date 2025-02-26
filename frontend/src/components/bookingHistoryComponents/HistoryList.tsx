"use client";

import { useSession } from "next-auth/react";
import deleteBooking from "@/libs/deleteBooking";
import { BookingItem, HistoryItem } from "../../../interface";
import HistoryItemDisplay from "./HistoryItemDisplay";

export default async function HistoryList({ bookings }: { bookings: any }) {
  const { data: session } = useSession();

  return (
    <div className="container pt-12 px-36 ">

      <h1
        className={`font-barlow text-3xl font-bold mb-4 ${
          session?.user.role === "admin" ? "text-blue-600" : "text-amber-700"
        }`}
      >
        {session?.user.role === "admin"
          ? "All Booking History"
          : "My Booking History"}
      </h1>

      {session && (
        <h3 className="font-barlow text-lg mb-6">
          Booking History Counts: {bookings.count}
        </h3>
      )}

      <div className="grid grid-cols-1 gap-6">
        {bookings.data.map((item: HistoryItem) => (
          <HistoryItemDisplay
            key={item._id}
            historyItem={item}
            // deleteBooking={deleteBooking}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}
