export default async function createCoupon(
    token: string,
    body: any
  ) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
  
    
  
      return await response.json();
     } catch (error: any) {
       throw new Error(`${error.message}`);
     }
  }
  