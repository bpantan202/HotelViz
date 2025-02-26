export default async function getCoupons(token: string|null,limit:number,page:number){
    
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons`;

    // console.log(url)
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch coupons");
    }
    return await response.json();
}
  