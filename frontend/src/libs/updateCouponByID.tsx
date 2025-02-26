export default async function updateCouponByID(
    token: string,
    id: string,
    body: any
  ) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update coupons");
      }
  
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to update coupons: ${error.message}`);
    }
  }
  