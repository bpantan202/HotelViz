export default async function getSummaryCoupon(token: string|null){
    
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/summary`;

    // console.log(url)
    try{
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    
    if (!response.ok) {
        throw new Error("Failed to fetch coupons");
    }
    return (await response.json()).data;
}
catch(e){
    console.log(e);
}
}
  