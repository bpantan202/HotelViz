export default async function updateRating(
  token: string,
  id: string,
  body: any
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings/history/${id}`,
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
      throw new Error("Failed to fetch rating");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Failed to fetch rating: ${error.message}`);
  }
}
