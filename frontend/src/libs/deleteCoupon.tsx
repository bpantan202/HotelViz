export default async function deleteCoupon(token: string, coupon_Type: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/type/${coupon_Type}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete coupon");
      }
  
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to delete coupon: ${error.message}`);
    }
  }
  