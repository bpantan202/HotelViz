import Image from "next/image";
export default function hotelBanner() {
    return(
    <div className="relative flex flex-column justify-center items-center w-full h-[70vh] p-5">
        <Image
        className="object-cover opacity-70 z--1 "
        src={'/images/hotelPageBanner.jpg'}
        alt="cover"
        fill={true}
        priority
        ></Image>
        <div className="z-20 absolute text-center top-40">
            <h1 className="text-6xl font-barlow font-2xl font-bold text-gray-800 drop-shadow-lg ">From Thailand to Your Hands</h1>
            <br></br>
            <h3 className="text-3xl font-barlow font-2xl font-medium italic text-gray-700 drop-shadow-lg ">
            “ Experience the best hotels. Experience the best of you. ”
            </h3>
        </div>    
        <div className = "block bg-white w-full z-20 rounded-t-full h-[7vh] absolute bottom-0 "></div>
    </div>
    )
    
}