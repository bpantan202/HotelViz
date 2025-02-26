export default async function getCouponsRedeem(token: string){
    
    try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/summary`,
          {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!response.ok) {
          throw new Error("Failed to fetch coupon");
        }
    
        return await response.json();
      } catch (error: any) {
        throw new Error(`Failed to fetch coupon: ${error.message}`);
      }

}
  