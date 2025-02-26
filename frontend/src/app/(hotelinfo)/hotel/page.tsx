import HotelBanner from "@/components/hotelsComponents/HotelBanner";
import HotelCardPanel from "@/components/hotelsComponents/HotelCardPanel";
import getHotels from "@/libs/getHotel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Hotel() {
  const session = await getServerSession(authOptions);
  return (
    <main className="absolute inset-y-0 left-0 z-10 w-full">
      <HotelBanner />
      <HotelCardPanel session={session} />
    </main>
  );
}
