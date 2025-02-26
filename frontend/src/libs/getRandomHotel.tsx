export default async function getRandomHotels(token: string|null,count:number){
    
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels/random?count=${count}`;

   
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
        ,
    });
    

    if (!response.ok) {
      throw new Error("Failed to fetch random hotels");
    
    }
    return await response.json();
}
  