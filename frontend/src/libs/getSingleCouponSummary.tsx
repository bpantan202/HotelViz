export default async function getSingleCouponSummary(token: string|null,coupon_Type:string){
    
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/type/${coupon_Type}`;

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
    return (await response.json()).data;
}