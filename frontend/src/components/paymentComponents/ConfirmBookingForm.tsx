"use client";

import createBooking from "@/libs/createBooking";
import updateBooking from "@/libs/updateBooking";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingItem, RoomType } from "../../../interface";
import getOneBooking from "@/libs/getOneBooking";
import getBookings from "@/libs/getBookings";
import Link from "next/link";

export default function ConfirmBookingForm({ 
  hotelID = "" , 
  contactname = "" ,
  contactemail = "" , 
  contacttel = "" , 
  contactdatestr = "" , 
  contactlocation = "",
  key = "",
  price = 0,
}:{ hotelID?: string , 
    contactname : string,
    contactemail : string,
    contacttel : string,
    contactdatestr : string | null,
    contactlocation : string,
    key : string,
    price : number
  }) {
  const { data: session } = useSession();

  const urlParams = useSearchParams();
  const id = urlParams.get("id");
  const cname = urlParams.get("contactName")
  const cemail = urlParams.get("contactEmail")
  const ctel = urlParams.get("contactTel")
  const clocation = urlParams.get("bookingLocation")
  contactdatestr = urlParams.get("bookingDate")
  const contactdate = dayjs(contactdatestr)
  const ckey = urlParams.get("key")
  const cprice = urlParams.get("price")

  if (id) hotelID = id;
  if (cname) contactname = cname;
  if (cemail) contactemail = cemail;
  if (ctel) contacttel = ctel;
  if (clocation) contactlocation = clocation;
  if (ckey) key = ckey;
  if (cprice) price = Number(cprice);

  const room = new RoomType();
  room.key = key;
  room.price = price;
  
  const makeBooking = async () => {
    if (session) {
      const item = {
        date: dayjs(bookingDate).toDate(),
        roomType:roomtype,
        contactEmail: contactEmail,
        contactName: contactName,
        contactTel: contactTel,
      };
      console.log(roomtype);
      if (id) {
        await updateBooking(session.user.token, id, item);
        window.location.href = "/account/mybookings";
      } else {
        if (canCreateBooking) {
          await createBooking(session.user.token, bookingLocation, item);
          window.location.href = "/account/mybookings";
        } else alert("Can't book more than three");
      }
    }
  };

  const [canCreateBooking, setCanCreateBooking] = useState<boolean>(false);
  const [contactName, setName] = useState<string>(contactname);
  const [contactEmail, setEmail] = useState<string>(contactemail);
  const [contactTel, setTel] = useState<string>(contacttel);
  const [bookingDate, setBookingDate] = useState<Dayjs | null>(contactdate);
  const [bookingLocation, setBookingLocation] = useState<string>(hotelID);
  const [roomtype, setRoomType] = useState<RoomType | null>(null);

  useEffect(() => {
    const getBooking = async () => {
      if (!session) return;
      const bookings = await getBookings(session.user.token);
      setRoomType(room);
      if (bookings.count < 3) setCanCreateBooking(true);
    };
    if(!roomtype) getBooking();
  }, [contactName, contactEmail, contactTel, bookingDate, bookingLocation, roomtype]);
  
  return (
    <div className="">
      <div className="w-full space-y-2 m-5 ">
        <p className="text-xl">{key}</p>
        <p>Price : {price} THB</p>
        <p>Booking Date : {bookingDate?.toISOString()}</p>
        <p>Contact Name : {contactName}</p>
        <p>Contact Email: {contactEmail}</p>
        <p>Contact Tel  : {contactTel}</p>
      </div>
      <div className="flex flex-row-reverse">
        <button
          name="Book Now!"
          className="block rounded-full bg-orange-500 px-5 py-2 text-white shadow-sm mt-5"
          onClick={makeBooking}
        >
          Book Now!
        </button>
      </div>
    </div>
  );
}
