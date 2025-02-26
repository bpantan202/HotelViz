"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import BookingCard from "@/components/BookingCard";
import getOneHotel from "@/libs/getOneHotel";
import BookingForm from "@/components/BookingForm";
import ConfirmBookingForm from "@/components/paymentComponents/ConfirmBookingForm";
import dayjs, { Dayjs } from "dayjs";
import CouponSelected from "@/components/CouponSelected";

export default function Payment({
  params,
 
}: {
  params: { hid: string , contactName : string , contactEmail : string , contactTel : string , bookingDate : string | null , bookingLocation : string , key : string , price : number};
}) {

  const { data: session } = useSession();
  if (!session || !session.user.token) return <div>Not login</div>;

  const urlParams = useSearchParams();

  useEffect(() => {
    const fetchdata = async () => {
      const data = await getOneHotel(session.user.token, params.hid);
      setHotelName(data.data.name);
      sethotelImg(data.data.image);
      sethotelAddress(
        data.data.address +
          " " +
          data.data.district +
          " " +
          data.data.province +
          " " +
          data.data.postalcode
      );
      sethotelRegion(data.data.region);
      sethotelTel(data.data.tel);
      setamenities(data.data.amenities);
      setRoomtype(data.data.roomType);
    };

    fetchdata();
  }, []);

  const [hotelName, setHotelName] = useState("");
  const [hotelImg, sethotelImg] = useState("");
  const [hotelAddress, sethotelAddress] = useState("");
  const [hotelRegion, sethotelRegion] = useState("");
  const [hotelTel, sethotelTel] = useState("");
  const [amenities, setamenities] = useState([]);
  const [roomType,setRoomtype] = useState([])

  return (
    <main className="p-10 w-full">
      <div className="text-5xl">Payment</div>
      <div className="py-5 text-2xl text-gray-600">
        Make sure all the details on this page are correct before proceeding the
        booking.
      </div>
      <div className="w-[95%] flex  gap-5 py-4">
        <div className="  flex flex-col basis-2/5 p-10 rounded-lg shadow-lg">
          <div className="text-3xl font-medium">Booking details</div>
          <div className="text-base text-gray-600 mt-2">
            ensure you receive the booking comfirmation email
          </div>

          <ConfirmBookingForm 
          hotelID={params.hid} 
          contactname={params.contactName}
          contactemail={params.contactEmail}
          contacttel={params.contactTel}
          contactdatestr={params.bookingDate}
          contactlocation={params.bookingLocation}
          key={params.key}
          price={params.price}
          ></ConfirmBookingForm>
        </div>
        <div className="basis-3/5">
        <div className="  flex flex-col basis-3/5 p-10 rounded-lg shadow-lg">
          <div className="text-3xl font-medium">Coupon</div>

          <CouponSelected/>
        </div>
        </div>
      </div>
    </main>
  );
}