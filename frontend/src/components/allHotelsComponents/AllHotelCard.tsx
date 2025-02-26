import Image from "next/image";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
export default function AllHotelCard({hotelName,hotelID,imgSrc,address,isFavorite=false}:{hotelName:string,hotelID:string,imgSrc:string,address:string,isFavorite?:boolean}){
    return(
        <a className="flex flex-col m-0 gap-2 border border-disable cursor-pointer min-w-[188px] hover:translate-y-[-4px] transition-all duration-250 ease-in-out hover:shadow-md w-full h-[300px] rounded-xl shadow-lg bg-white overflow-hidden hover:bg-blue-50 "
        href={"/admin/managehotel?id="+hotelID}>
            <div className=" h-[70%] relative">
                <Image
                src={imgSrc}
                alt="Hotel"
                fill={true}
                className="object-cover rounded-lg z-10"
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                ></Image>
            </div>
            <div className=" h-[20%] px-4 py-1">
                    <p className="text-xl">{hotelName}</p>   
                    <h1>{address}</h1>
            </div>
        </a>
    )
}