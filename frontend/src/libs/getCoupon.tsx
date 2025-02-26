export default async function getOneCoupon(token: string, id: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to get one coupon");
      }
  
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to get one coupon: ${error.message}`);
    }
  }
  