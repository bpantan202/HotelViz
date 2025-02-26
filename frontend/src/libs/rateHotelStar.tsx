import getOneHotel from "./getOneHotel"
export default async function rateHotelStar(token:string, id:string, userRating:number){

    try {
        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels/rating/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body:JSON.stringify({
                rating: userRating,
              }),
          }
        );
    
        if (!response2.ok) {
          throw new Error("Failed to fetch bookings");
        }
    
        return await response2.json();
      } catch (error: any) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
      }
}