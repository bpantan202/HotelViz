"use client";
import BookingForm from "@/components/BookingForm";

export default function Booking() {
  return (
    <main className="w-[100%] flex flex-col items-center space-y-4 pb-4">
        <div className="text-4xl font-medium p-10">Edit your Booking</div>
      <div className=" w-[30%] flex flex-col p-10 rounded-lg shadow-lg z-40">
        <BookingForm></BookingForm>
      </div>
    </main>
  );
}
