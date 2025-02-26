export default async function getHotels(token: string|null,limit:number,page:number,selectedRegion:string,selectedProvince:string,selectedAmenitiesList:string[],minPrice:number,maxPrice:number,rating:number){
    
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels?limit=${limit}&page=${page}&sort=_id&minPrice=${minPrice}&maxPrice=${maxPrice}&rating[gte]=${rating}`;
    if (selectedRegion !== "None") {
        url += `&region=${selectedRegion}`;
    }

    if (selectedProvince !== "None" && selectedProvince !== "") {
        url += `&province=${selectedProvince}`;
    }

    if (selectedAmenitiesList.length > 0) {
        for (const amenity of selectedAmenitiesList) {
          url += `&amenities=${amenity}`;
        }
      }      

    // console.log(url)
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    // const response = (selectedRegion==="None") ? await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels?limit=${limit}&page=${page}&sort=_id`,
    //     {
    //         method: 'GET',
    //         headers: {
    //         Authorization: `Bearer ${token}`,
    //         },
    //     }
    //     ) : await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels?limit=${limit}&page=${page}&region[in]=${selectedRegion}&sort=_id`,
    //     {
    //         method: 'GET',
    //         headers: {
    //         Authorization: `Bearer ${token}`,
    //         },
    //     }
    //     );

    if (!response.ok) {
      throw new Error("Failed to fetch hotels");
    }
    return await response.json();
}
  