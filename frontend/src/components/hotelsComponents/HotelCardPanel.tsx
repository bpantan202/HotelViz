"use client";
import HotelCard from "./HotelCard";
import Link from "next/link";
import {useReducer, useState } from "react";
import RegionButton from "./RegionButton";
import { useEffect } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getHotels from "@/libs/getHotel";
import { CircularProgress, Rating } from "@mui/material";
import LoadingHotelCard from "./LoadingHotelCard";
import PaginationBar from "../PaginationBar";
import Skeleton from "@mui/material/Skeleton";
import { HotelItem, HotelJson } from "../../../interface";
import getRandomHotels from "@/libs/getRandomHotel";
import Slider from '@mui/material/Slider';
import { Star } from "@mui/icons-material";


const minDistance = 100;

export default function HotelCardPanel({ session = null }: { session?: any }) {

 const [RecomedHotel, setRecomed] = useState<HotelJson| null>(null)

  const [spinner, setSpinner] = useState(true);
  const [hotels, setHotels] = useState<HotelJson | null>(null);

  
  const regionReducer = (
    selectedRegion: string,
    action: { regionName: string }
  ) => {
    if (selectedRegion === action.regionName) {
      return "None";
    }
    return action.regionName;
  };

  const provinceReducer = (
    selectedProvince: string,
    action: { provinceName: string }
  ) => {
    if (selectedProvince === action.provinceName) {
      return "None";
    }
    return action.provinceName;
  };

  const amenitiesReducer = (
    selectedAmenitiesList: string[],
    action: { type: string; amenitiesName: string }
  ) => {
    switch (action.type) {
      case "TOGGLE_AMENITIES":
        const amenitiesName = action.amenitiesName;
        const isAmenitySelected = selectedAmenitiesList.includes(amenitiesName);
        
        if (isAmenitySelected) {
          return selectedAmenitiesList.filter(item => item !== amenitiesName);
        } else {
          return [...selectedAmenitiesList, amenitiesName];
        }
      default:
        return selectedAmenitiesList;
    }
  };
  
  const [selectedRegion, dispatchRegion] = useReducer(regionReducer, "None");
  const [selectedProvince, dispatchProvince] = useReducer(provinceReducer, "None");
  const [selectedAmenitiesList, dispatchAmenities] = useReducer(amenitiesReducer,[]);


  const pageReducer = (page: number, action: { newPage: number }) => {
    return action.newPage;
  };
  const [page, dispatchPage] = useReducer(pageReducer, 1);

  // const regions = ["Bangkok", "North", "Northeast", "Central", "South"];
  const regions = [ "North", "Northeast", "Central", "East", "West", "South"];

  const provinces = [
    "Bangkok", "Pattaya", "Krabi", "Kanchanaburi", "Kalasin", "Kamphaeng Phet", "Khon Kaen", "Chanthaburi", "Chachoengsao", "Chon Buri", "Chai Nat", "Chaiyaphum", "Chumphon", 
    "Trang", "Trat", "Tak", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima", "Nakhon Si Thammarat", "Nakhon Sawan", "Nonthaburi", "Narathiwat", "Nan", 
    "Bueng Kan", "Buri Ram", "Pathum Thani", "Prachuap Khiri Khan", "Prachin Buri", "Pattani", "Phra Nakhon Si Ayutthaya", "Phayao", "Phangnga", "Phatthalung", "Phichit", 
    "Phitsanulok", "Phuket", "Maha Sarakham", "Mukdahan", "Yala", "Yasothon", "Ranong", "Rayong", "Ratchaburi", "Roi Et", "Lop Buri", "Lampang", "Lamphun", 
    "Si Sa Ket", "Sakon Nakhon", "Songkhla", "Satun", "Samut Prakan", "Samut Songkhram", "Samut Sakhon", "Saraburi", "Sa Kaeo", "Sing Buri", "Suphan Buri", "Surat Thani", "Surin", "Sukhothai", 
    "Nong Khai", "Nong Bua Lam Phu", "Amnat Charoen", "Udon Thani", "Uttaradit", "Uthai Thani", "Ubon Ratchathani", "Ang Thong", "Chiang Rai", "Chiang Mai", 
    "Phetchaburi", "Phetchabun", "Loei", "Phrae", "Mae Hong Son"
  ];

  const provincesByRegion: Record<string, string[]> = {
    North: ["Chiang Rai", "Chiang Mai", "Lampang", "Lamphun", "Phayao", "Phrae", "Nan", "Uttaradit", "Sukhothai", "Tak", "Phitsanulok", "Phetchabun", "Kamphaeng Phet", "Mae Hong Son"],
    Northeast: ["Kalasin", "Khon Kaen", "Chaiyaphum", "Nakhon Phanom", "Nakhon Ratchasima", "Bueng Kan", "Buri Ram", "Maha Sarakham", "Mukdahan", "Yasothon", "Roi Et", "Loei", "Sakhon Nakhon", "Nong Khai", "Nong Bua Lam Phu", "Amnat Charoen", "Udon Thani", "Sakon Nakhon", "Surin", "Ubon Ratchathani"],
    Central: ["Bangkok", "Nonthaburi", "Pathum Thani", "Samut Prakan", "Samut Sakhon", "Samut Songkhram", "Nakhon Pathom", "Phetchaburi", "Prachuap Khiri Khan", "Ratchaburi", "Sing Buri", "Saraburi", "Suphan Buri", "Ang Thong", "Lop Buri", "Chai Nat", "Phra Nakhon Si Ayutthaya"],
    East: ["Chanthaburi", "Chon Buri", "Rayong", "Sa Kaeo", "Trat"],
    West: ["Kanchanaburi", "Phetchaburi", "Prachuap Khiri Khan", "Ratchaburi"],
    South: ["Krabi", "Trang", "Phangnga", "Phatthalung", "Phuket", "Yala", "Ranong", "Songkhla", "Satun", "Surat Thani", "Pattani", "Narathiwat"]
  };  

  const amenities = [
    "Wifi", "TV", "Bathtub", "Pets Allowed", "Breakfast", "Bar", 
    "Coffee Shop", "Restaurant", "Gym", "Spa", "Pool", "Massage",
    "Luggage Storage", "Car Parking",
    "Laundry Service", "Room Service"
  ]

  const [price, setPrice] = useState<number[]>([0, 7000]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(7000);
  const [initialPrice, setInitialPrice] = useState<number[]>([0, 7000]);
  const [userRating,setRating] = useState<number>(0);


  useEffect(() => {
    const fetchData = async () => {
      setSpinner(true);
      setHotels(null);
      let hotels;
      if (session)
        hotels = await getHotels(session.user.token, 4, page, selectedRegion, selectedProvince, selectedAmenitiesList, minPrice, maxPrice, userRating);
      else hotels = await getHotels(null, 4, page, selectedRegion, selectedProvince, selectedAmenitiesList, minPrice, maxPrice, userRating);
      setHotels(hotels);
      setSpinner(false);
      console.log(`count ${hotels.count}`);
    };
  
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [page, selectedRegion, selectedProvince, selectedAmenitiesList, minPrice, maxPrice, userRating]);
  

  const [filteredProvinces, setFilteredProvinces] = useState<string[]>([]);

  useEffect(() => {
    if (selectedRegion !== "None") {
      setFilteredProvinces(provincesByRegion[selectedRegion]);
    } else {
      setFilteredProvinces([]);
    }
    const fetchData = async () => {
      let Recomend;
      if(session) Recomend = await getRandomHotels(session.user.token,4);
      else Recomend = await getRandomHotels(null,4);
      setRecomed(Recomend);
    };
    fetchData();
  }, [selectedRegion]);


  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }
  
    if (activeThumb === 0) {
      setPrice([Math.min(newValue[0], price[1] - minDistance), price[1]]);
    } else {
      setPrice([price[0], Math.max(newValue[1], price[0] + minDistance)]);
    }
  
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
    // dispatchPage({ newPage: 1 });
    // console.log("wow");
  };
  
  const handleMouseUp = () => {
    setInitialPrice(price);
    setMinPrice(price[0]);
    setMaxPrice(price[1]);
    // console.log("wooo");

  };

  const handleSliderChangeCommitted = () => {
    // console.log("weeee");
    dispatchPage({ newPage: 1 });
    console.log(page)
    if (initialPrice !== price) {
      const fetchData = async () => {
        setSpinner(true);
        setHotels(null);
        let hotels;
        if (session)
          hotels = await getHotels(session.user.token, 4, page, selectedRegion, selectedProvince, selectedAmenitiesList, price[0], price[1], userRating);
        else hotels = await getHotels(null, 4, page, selectedRegion, selectedProvince, selectedAmenitiesList, price[0], price[1], userRating);
        setHotels(hotels);
        setSpinner(false);
      };
      fetchData();
    }
  };


  return (
    <div className="my-0 relative bg-blue">
      <div className="relative flex flex-col px-28 py-4">  
      <div className="font-poppins font-medium text-2xl pb-9">
        Find hotel for your next trip 🗺️
      </div>
        <div className="border border-gray-300 rounded-2xl py-6 px-9">
        
        <div className="flex text-neutral-600">
        
        <div className="w-[50%]">
          <div className=" mb-2">Region :</div>
          <div className="flex flex-wrap gap-x-1.5 gap-y-2.5 justify-start ">
            {regions.map((regionName) => (
              <RegionButton
                key={regionName}
                name={regionName}
                selected={selectedRegion === regionName}
                onRegion={() => {
                  if (!spinner) {
                    dispatchRegion({ regionName: regionName });
                    dispatchPage({ newPage: 1 });
                    dispatchProvince({ provinceName: "" });
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div className="h-auto w-0.5 rounded-full bg-gray-200"></div>

          <div className="flex-row gap-x-1 justify-start px-7">
              <div className=" mb-2">Province :</div>
              <div>
              <select id="provincesDropdown" className="hover:translate-y-[-3px] transition-all duration-250 ease-in-out hover:shadow-md rounded-full bg-slate-100 px-5 py-2 text-sky-600 shadow-sm font-bold"
              onChange={(e) => {
                if (!spinner) {
                  const selectedProvince = e.target.value;
                  dispatchProvince({ provinceName: selectedProvince });
                  dispatchPage({ newPage: 1 });
                }
              }}
              >
                <option value="">select province</option>
                {(selectedRegion === "None"
                ? provinces
                :filteredProvinces).map((province) => (
                  <option key={province} 
                  value={province}
                  selected={selectedProvince === province}
                  >{province}</option>
                ))}
              </select>
              </div>
          </div>
        </div>
          

        <div className="flex mt-12">
        <div className="flex flex-wrap gap-x-1 gap-y-2 justify-start w-[50%] text-neutral-600">
          Price Range : ฿{price.join(' - ฿')}
          <Slider
            // getAriaLabel={() => 'Price range slider'}
            className="ml-5 mr-14"
            value={price}
            onChange={handleChange}
            valueLabelDisplay="auto"
            // getAriaValueText={() => 'Price range'}
            onMouseUp={handleMouseUp}
            onChangeCommitted={handleSliderChangeCommitted}
            min={0}
            max={7000}
            disableSwap
          />  
        </div>
        <div className="h-auto w-0.5 rounded-full bg-gray-200"/>
              <div className="mx-7 text-neutral-600">
              Rating : ≥ {userRating} 
              <div className="flex ml-1 mt-1">
              {/* <div className="mt-1 mr-1 text-lg text-neutral-400">≥</div> */}
              <Rating size='large' precision={0.5} 
                  onChange={(e,newValue) => {
                  e.stopPropagation; 
                  if(newValue){setRating(newValue);}
                  else{setRating(0);}
                  dispatchPage({ newPage: 1 });
                  // if (!spinner) {
                  //   dispatchRegion({ regionName: newValue });
                  // }
                }}>
              </Rating>
              </div>
        </div>
        </div>
        <div className="mt-10 text-neutral-600">Amenities :</div>
          <div className="flex flex-wrap gap-x-1.5 gap-y-2.5 mt-2 justify-start mb-5">
            
          {amenities.map((amenitiesName) => (
            <button 
              key={amenitiesName}
              name={amenitiesName}
              onClick={(e) => {
                e.stopPropagation();
                if (!spinner) {
                  dispatchAmenities({ type: "TOGGLE_AMENITIES", amenitiesName: amenitiesName });
                  dispatchPage({ newPage: 1 });
                }
              }}
              className={`hover:translate-y-[-3px] transition-all duration-250 ease-in-out hover:shadow-md rounded-full ${selectedAmenitiesList.includes(amenitiesName) ? 'bg-sky-600 text-slate-100' : 'bg-slate-100 text-sky-600'} px-5 py-2 shadow-sm font-bold`}
            >
              <div className="flex align-center">
              <img src={`/amenities/${amenitiesName}.png`} className="w-4 h-4 mr-2 my-auto" />
              {amenitiesName}
              </div>
            </button>
          ))}
        </div>
      </div>

          {hotels? hotels.count==0?
          <div>
            {page==1 ? <div className="py-10 text-center">We're sorry, No hotels match your filtering criteria.</div>:
                       <div className="py-10 text-center">You've gone through all hotels macthing your filtering criteria.</div>}
            <div className="font-poppins font-medium text-2xl pt-10">You Might Also Like</div>
            <div className="grid grid-cols-4grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-x-4 gap-y-6 mt-8 gap-8 w-full h-auto">
              {RecomedHotel?
              RecomedHotel.data.map((hotel: HotelItem) => (
                  <HotelCard
                    key={hotel._id}
                    hotelName={hotel.name}
                    hotelID={hotel._id}
                    imgSrc={hotel.image}
                    address={hotel.province}
                    minPrice={hotel.minPrice}
                    maxPrice={hotel.maxPrice}
                    rating={hotel.rating.toPrecision(3)}
                    ratingCount={hotel.ratingCount}
                  ></HotelCard>
                )):""}
            </div>
          </div>:"":""}
          
        
        
        <div className="grid grid-cols-4grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-x-4 gap-y-6 mt-8 gap-8 w-full h-auto">
          {spinner ? <LoadingHotelCard /> : ""}
          {spinner ? <LoadingHotelCard /> : ""}
          {spinner ? <LoadingHotelCard /> : ""}
          {spinner ? <LoadingHotelCard /> : ""}
          {hotels
            ? page==1&&hotels.count==0?""
            
            :(
              hotels.data.map((hotel: HotelItem) => (
                <HotelCard
                  key={hotel._id}
                  hotelName={hotel.name}
                  hotelID={hotel._id}
                  imgSrc={hotel.image}
                  address={hotel.province+', '+hotel.region}
                  minPrice={hotel.minPrice}
                  maxPrice={hotel.maxPrice}
                  rating={hotel.rating.toPrecision(3)}
                  ratingCount={hotel.ratingCount}
                ></HotelCard>
              )))
            : ""}
           
        </div>
        <div className="py-5 justify-self-center mx-auto">
          {hotels ?
           (
            !(page==1&&hotels.count==0)?(
              (selectedRegion === "None" && !(selectedProvince !== "None" && (selectedProvince !== "")) && (selectedAmenitiesList===null)) ? (
              <PaginationBar
                totalPages={Math.ceil(hotels.total / 4)}
                currentPage={page}
                onPage={(newPage: number) => dispatchPage({ newPage: newPage })}
              />
            ) : (
              <div className="list-style-none flex">
                {page > 1 ? (
                  <button
                    className="hover:bg-slate-50 relative block rounded-xl bg-transparent font-sans font-md px-5 py-3 text-lg text-surface hover:translate-y-[-1px] hover:shadow-md transition-all duration-450 ease-in-out "
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatchPage({ newPage: page - 1 });
                    }}
                  >
                    &laquo;
                  </button>
                ) : (
                  <button className="relative block rounded-xl bg-transparent text-gray-300 font-sans font-md px-5 py-3 text-lg text-surface ">
                    &laquo;
                  </button>
                )}
                <span
                  className={`relative block rounded-xl bg-transparent font-sans font-semibold px-5 py-3 text-lg text-surface `}
                >
                  {page}
                </span>
                {(page < hotels.total && hotels.count==4) ? (
                  <button
                    className="hover:bg-slate-50 relative block rounded-xl bg-transparent font-sans font-md px-5 py-3 text-lg text-surface hover:translate-y-[-1px] hover:shadow-md transition-all duration-450 ease-in-out "
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatchPage({ newPage: page + 1 });
                    }}
                  >
                    &raquo;
                  </button>
                ) : (
                  <button className="relative block rounded-xl bg-transparent text-gray-300 font-sans font-md px-5 py-3 text-lg text-surface ">
                    &raquo;
                  </button>
                )}
              </div>
            )
          ):"") : (
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
