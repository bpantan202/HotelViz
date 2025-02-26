export default async function getBookingsHistory(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings/history`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch bookings history");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Failed to fetch bookings history: ${error.message}`);
  }
}
