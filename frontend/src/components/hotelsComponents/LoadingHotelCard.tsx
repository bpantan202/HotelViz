import Skeleton from '@mui/material/Skeleton';

export default function LoadingHotelCard() { 
    return (
        <div className="flex flex-col m-0 gap-2 border border-disable cursor-pointer min-w-[188px] hover:translate-y-[-4px] transition-all duration-250 ease-in-out hover:shadow-md w-full h-[300px] rounded-xl shadow-lg bg-white overflow-hidden hover:bg-blue-50 ">
            <div className=" h-[70%] relative">
                <Skeleton 
                    variant="rectangular" 
                    className="object-cover rounded-lg"
                    animation="wave"
                    height="100%" 
                    width="100%"  
                />
            </div>
            <div className=" h-[20%] px-4 py-1">
                <Skeleton variant="text" width="80%" /> 
                <Skeleton variant="text" width="50%" />
            </div>
        </div>
    )
}
