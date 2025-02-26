import rateHotelStar from "@/libs/rateHotelStar";
import updateRating from "@/libs/updateRating";
import { Rating } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function RatingDisplay({ historyItem }: { historyItem: any }) {
    const { data: session } = useSession();

    const [userRating,setRating] = useState<null|number>(0);

    const rateStar = async () => {
        if (session) {
            const item = {
                rating:userRating
            };
        const id = historyItem._id;
        await updateRating(session?.user.token, id, item);
        }
    }

    return (
        <div>
        {
            (historyItem.rating<=5 && historyItem.rating>=0)?
                  
                  <div>
                    <table>
                    <tr>
                      {session?.user.role === "admin" ?
                      <td className="text-lg text-gray-500">Rating : </td>
                      :
                      <td className="text-lg text-gray-500">You rate : </td>
                      }
                      <td><Rating size="medium" className=" p-1 mt-1" value={historyItem.rating} readOnly={true}></Rating></td>
                    </tr>
                    </table>
                  </div>
                  :
                  <div>
                    {
                      session?.user.role === "admin" ?
                      <div>
                        <div className="text-lg text-red-600">Users have not rated a star yet.</div> 
                      </div>
                      :
                      <div className="text-md text-gray-500">
                        Rate now to earn more member points.
                        <table className="mt-1"><tr>
                          <td><Rating size="medium" className=" pr-3 mt-1" value={userRating}
                            onChange={(e, newValue) => {
                                e.stopPropagation; 
                                if(newValue)
                                {
                                    setRating(newValue);
                                }
                                
                            }}></Rating></td>
                        <td><button onClick={async (e) => {e.stopPropagation();
                        if(userRating && session){
                          if (confirm(`Are you sure you want to rate this booking ${userRating} stars? \nYou can only rate once.`)) {
                            await rateHotelStar(session.user.token,historyItem.hotel.id,userRating);
                            await rateStar();
                            location.reload();
                          }} 
                        else {
                          alert('Please rate this booking. (1-5 stars)')
                        }
                        } 
                        } className="w-fit px-4 py-1.5 shadow-lg backdrop-blur-sm hover:shadow-xl duration-300 ease-in-out text-white rounded-lg font-sans font-lg font-semibold
                        bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500">
                          Rate
                        </button></td>
                        </tr></table>
                      </div>
                    }
                  </div>
          }
        </div>
    )
}