import AllHotelCardPanel from "@/components/allHotelsComponents/AllHotelCardPanel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export default async function AllHotels() {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    return(
    <div>
        <AllHotelCardPanel session={session}/>
    </div>);
}