export default async function createHistory(
  token: string,
  id: string,
  body: any
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels/${id}/bookings/history`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Failed to fetch history: ${error.message}`);
  }
}
