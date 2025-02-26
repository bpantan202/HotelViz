import Image from "next/image";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
export default function HotelCard({hotelName,hotelID,imgSrc,address,minPrice,maxPrice,rating,ratingCount}:{hotelName:string,hotelID:string,imgSrc:string,address:string,minPrice:number,maxPrice:number,rating:string,ratingCount:number}){
    return(
        <a className="font-sans flex flex-col m-0 gap-2 border border-disable cursor-pointer min-w-[188px] hover:translate-y-[-4px] transition-all duration-250 ease-in-out hover:shadow-md w-full h-[340px] rounded-xl shadow-lg bg-white overflow-hidden hover:bg-blue-50 "
        href={"/hotel/"+hotelID}>
            <div className=" h-[65%] relative">
                <Image
                src={imgSrc}
                alt="Hotel"
                fill={true}
                className="object-cover rounded-lg z-10"
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                ></Image>
            </div>
            <div className=" h-[20%] px-4 py-1 flex-column">
                    <p className="text-xl">{hotelName}</p>   
                    <h1>{address}</h1>
                    <div className="flow-root h-auto items-center py-2 ">
                        <div className="float-right flex flex-row items-center font-medium">
                            <StarIcon className="text-yellow-400 "/>
                            <h1 className="mr-[2px]">{`${rating}`}</h1>
                            <h1 className = "text-slate-500	text-xs ">{`(${ratingCount})`}</h1>
                        </div>
                        <div className="float-left flex flex-row text-large text-lg font-medium">
                            <p className="text-large">{`฿${minPrice} - ฿${maxPrice} `}</p>
                        </div>
                    </div>
            </div>
            {/* <div className="absolute z-30 rounded-tl-lg bg-white-/40 shadow-sm px-2 py-2 w-fit flex flex-row-reverse space-x-1 space-x-reverse p-[10px] hover:bg-slate-50/80 hover:backdrop-blur duration-250 ease-in-out transition-all w-"> */}
                {/* <button>Favorite</button> */}
                {/* <div className="text-red-400">{isFavorite ? <FavoriteIcon/>:<FavoriteBorderIcon/>}</div> */}
            {/* </div> */}
        </a>
    )
}