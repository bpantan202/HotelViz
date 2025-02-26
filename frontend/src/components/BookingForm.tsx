"use client";

import createBooking from "@/libs/createBooking";
import updateBooking from "@/libs/updateBooking";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingItem, RoomType, CouponItem, UserInformation} from "../../interface";
import getOneBooking from "@/libs/getOneBooking";
import getBookings from "@/libs/getBookings";
import DateReserve from "./DateReserve";
import DateReserveEdit from "./DateReserveEdit";
import CouponSelected from "./CouponSelected";
import Coupon from "./memberComponents/Coupon";
import getUserProfile from "@/libs/getUserProfile";
import { 
FormControl, 
FormLabel,
Radio,
RadioGroup,
FormControlLabel,
} from "@mui/material";
import updateCouponByID from "@/libs/updateCouponByID";


export default function BookingForm({ hotelID = "",roomType}: { hotelID?: string,roomType?:RoomType[]}) {
  const { data: session } = useSession();

  const urlParams = useSearchParams();
  const id = urlParams.get("id");

  if (id) hotelID = id;

  const makeBooking = async () => {
    if (session) {
      const item = {
        date: dayjs(bookingDate).toDate(),
        roomType:roomtype?.key,
        contactEmail: contactEmail,
        contactName: contactName,
        contactTel: contactTel,
        price: roomtype?.price,
        discount: discount,
      };
      if (id) {
        await updateBooking(session.user.token, id, item);
        window.location.href = "/account/mybookings";
      } else {
        if (canCreateBooking) {
          if(couponId !== ''){
            await createBooking(session.user.token, bookingLocation, item);
            await updateCouponByID(session.user.token, couponId ,item);
            window.location.href = "/account/mybookings";
          }else{
            await createBooking(session.user.token, bookingLocation, item);
            window.location.href = "/account/mybookings";
          }
        } else alert("Can't book more than three");
      }
    }
  };

  const [canCreateBooking, setCanCreateBooking] = useState<boolean>(false);
  const [contactName, setName] = useState<string>("");
  const [contactEmail, setEmail] = useState<string>("");
  const [contactTel, setTel] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<Dayjs | null>(null);
  const [bookingLocation, setBookingLocation] = useState<string>(hotelID);
  const [roomtype, setRoomType] = useState<RoomType | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [couponId , setCouponId] = useState<string>('');
  const [discountPrice , setDiscountPrice] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<UserInformation>(new UserInformation());

  const fetchUserData = async () => {
      if (session && userInfo._id === "") {
        const userInfoA:UserInformation = (await getUserProfile(session?.user.token)).data;
        setUserInfo(userInfoA);
      }
    };

  const getBooking = async () => {
      if (!session) return;
      if (id != null && !contactEmail) {
        const booking: BookingItem = (
          await getOneBooking(session.user.token, id)
        ).data;
        setName(booking.contactName);
        setEmail(booking.contactEmail);
        setTel(booking.contactTel);
        setBookingDate(dayjs(booking.date));
        setBookingLocation(booking.hotel._id);
        setRoomType(booking.roomType);
      } else {
        const bookings = await getBookings(session.user.token);
        // setKey(roomtype? roomtype.key : null);
        // setPrice(roomtype? roomtype.price : null);
        if (bookings.count < 3) setCanCreateBooking(true);
      }
    };

    const updateDiscount = () => {
        setDiscount(0);
        if(roomtype){
          console.log(selectedValue ? selectedValue : null)
          if(selectedValue == 'Tier Discount'){
            let updatedDiscountPrice = roomtype?.price;
            let discount = 0;
            if(userInfo.tier == "Silver"){
              updatedDiscountPrice *= 0.98;
              discount = roomtype?.price - updatedDiscountPrice;
            }else if(userInfo.tier == "Gold"){
              updatedDiscountPrice *= 0.95;
              discount = roomtype?.price - updatedDiscountPrice;
            }else if(userInfo.tier == "Platinum"){
              updatedDiscountPrice *= 0.90;
              discount = roomtype?.price - updatedDiscountPrice;
            }
            setDiscountPrice(updatedDiscountPrice);
            setDiscount(discount)
          }
        }
      };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await getBooking();
      updateDiscount();
    };
  
    fetchData();
    // const fetchUserData = async () => {
    //   if (session && userInfo._id === "") {
    //     const userInfoA:UserInformation = (await getUserProfile(session?.user.token)).data;
    //     setUserInfo(userInfoA);
    //   }
    // };
    // const getBooking = async () => {
    //   if (!session) return;
    //   if (id != null && !contactEmail) {
    //     const booking: BookingItem = (
    //       await getOneBooking(session.user.token, id)
    //     ).data;
    //     setName(booking.contactName);
    //     setEmail(booking.contactEmail);
    //     setTel(booking.contactTel);
    //     setBookingDate(dayjs(booking.date));
    //     setBookingLocation(booking.hotel._id);
    //     setRoomType(booking.roomType);
    //   } else {
    //     const bookings = await getBookings(session.user.token);
    //     // setKey(roomtype? roomtype.key : null);
    //     // setPrice(roomtype? roomtype.price : null);
    //     if (bookings.count < 3) setCanCreateBooking(true);
    //   }
    // };
    // const updateDiscount = () => {
    //   setDiscount(0);
    //   if(roomtype){
    //     console.log(selectedValue ? selectedValue : null)
    //     if(selectedValue == 'Tier Discount'){
    //       let updatedDiscountPrice = roomtype?.price;
    //       if(userInfo.tier == "Silver"){
    //         updatedDiscountPrice *= 0.98;
    //       }else if(userInfo.tier == "Gold"){
    //         updatedDiscountPrice *= 0.95;
    //       }else if(userInfo.tier == "Platinum"){
    //         updatedDiscountPrice *= 0.90;
    //       }
    //       setDiscountPrice(updatedDiscountPrice);
    //     }
    //   }
    // };
    // fetchUserData();
    // getBooking();
    // updateDiscount();
    // console.log("roomtype?.price " + roomtype?.price)
    // console.log("discountPrice " + discountPrice)
    // console.log("discount " + discount)
  }, [session, userInfo,contactName, contactEmail, contactTel, bookingDate, bookingLocation, roomtype, selectedValue]);

  useEffect(() => {
    console.log("roomtype?.price " + roomtype?.price);
    console.log("discountPrice " + discountPrice);
    console.log("discount " + discount);
  }, [roomtype?.price, discountPrice, discount]);

  return (
    <div className="">
      <div className="w-full space-y-2">
        {!id&&roomType?

        <DateReserve
          contactName={contactName}
          contactEmail={contactEmail}
          contactTel={contactTel}
          bookingDate={bookingDate}
          bookingLocation={bookingLocation}
          roomtype={roomType}
          onNameChange={(value: string) => {
            setName(value);
          }}
          onEmailChange={(value: string) => {
            setEmail(value);
          }}
          onTelChange={(value: string) => {
            setTel(value);
          }}
          onDateChange={(value: Dayjs) => {
            setBookingDate(value);
          }}
          onLocationChange={(value: string) => {
            setBookingLocation(value);
          }}
          onRoomTypeChange={(value: RoomType) => {
            setRoomType(value);
          }}
        ></DateReserve>
        :
        <DateReserveEdit
        contactName={contactName}
          contactEmail={contactEmail}
          contactTel={contactTel}
          bookingDate={bookingDate}
          bookingLocation={bookingLocation}
          
          onNameChange={(value: string) => {
            setName(value);
          }}
          onEmailChange={(value: string) => {
            setEmail(value);
          }}
          onTelChange={(value: string) => {
            setTel(value);
          }}
          onDateChange={(value: Dayjs) => {
            setBookingDate(value);
          }}
          onLocationChange={(value: string) => {
            setBookingLocation(value);
          }}
          >
            </DateReserveEdit>}
      </div>

      <div>
      {!id&&roomType? 
          <div>
              <div className="border-t-2 border-gray-300 my-4"></div>
          { session?.user.role== "user" ? (
           <div>
               <div className="text-3xl font-medium mt-10">Payment</div>
             <div className="text-base text-gray-600 mt-2">
                 Choose your coupon for a discount on your reservation!
             </div>
   
             <FormControl component="fieldset" sx={{ mt: 1, display: 'flex flex-row' }}>
               <RadioGroup
                 aria-label="direction"
                 name="direction"
                 value={selectedValue}
                 onChange={(e) => setSelectedValue(e.target.value)}
               >
                 <FormControlLabel value="Tier Discount" control={<Radio />} label={"Tier Discount (" + userInfo.tier + ")"} />
                 <FormControlLabel value="My Coupons" control={<Radio />} label="My Coupons" />
               </RadioGroup>
             </FormControl>
             <div className="flex overflow-x-auto mx-4">
               {selectedValue === 'My Coupons' && <CouponSelected onSelectCoupon={(value)=> {setDiscount(value as number);console.log('coupon')}} onSelectCouponId={(value)=> {setCouponId(value as string)}}/> }
             </div>
       
             <div className="border-t-2 border-gray-300 my-4"></div>
           </div>
      
         ) : (
             <div></div>
         )
         }
         
         <div className="flex justify-between mt-5">
           <div className="text-3xl font-medium">Price</div>
           <div className="flex flex-end items-end">
             {selectedValue == '' ?  (
                 <div className="text-3xl">{roomtype?roomtype.price : 0} THB</div>
             ): (
               <div>
                 {selectedValue == 'Tier Discount' ? (
                   <div className="flex flex-end items-end">
                     <div className="text-xl line-through">{roomtype?.price}</div>
                     <div className="text-3xl text-orange-500">{discountPrice.toFixed(2)} THB</div>
                   </div>
                 ) : (
                   <div className="flex flex-end items-end">
                     <div className="text-xl line-through">{roomtype?.price}</div>
                     <div className="text-3xl text-orange-500">{Math.max((roomtype ? roomtype.price : 0) - Number(discount), 0).toFixed(2)} THB</div>
                   </div>
                 )}
               </div>
             )}
           </div>
         </div>
          </div>
      :
         <div></div>
      }
      </div>
      <div className="flex flex-row-reverse">
        <button
          name="Book Now!"
          className="block rounded-full bg-orange-500 px-10 py-2 text-white shadow-sm mt-5 text-xl"
          onClick={makeBooking}
        >
          Book Now!
        </button>
      </div>
    </div>
  );
}
