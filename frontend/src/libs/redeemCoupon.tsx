export default async function redeemCoupon(
    token: string,
    couponType: string,
  ) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/redeem/${couponType}`, {
      method: "POST",
      headers: {
          Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to redeem coupon");
    }
  
    return await response.json();
  }
  